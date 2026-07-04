// Website enquiry → lead (Layer 7). The torqpoint.com contact form posts here;
// a new account (lead) + deal + activity appear in the CRM automatically.
// Uses the service role key server-side; the website never sees any secrets.

const ALLOWED_ORIGIN_SUFFIXES = ['torqpoint.com', '.vercel.app'];

function corsOrigin(origin: string | undefined): string | null {
  if (!origin) return null;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_ORIGIN_SUFFIXES.some(
      (s) => host === s || host.endsWith(s.startsWith('.') ? s : `.${s}`),
    )
      ? origin
      : null;
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  const origin = corsOrigin(req.headers.origin);
  if (origin) {
    res.setHeader('access-control-allow-origin', origin);
    res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
    res.setHeader('access-control-allow-headers', 'content-type');
  }
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    res.status(503).json({ error: 'Enquiry capture is not configured yet.' });
    return;
  }

  const { name, business, email, message, botcheck } = req.body ?? {};
  // Honeypot: real visitors never fill this.
  if (botcheck) {
    res.status(200).json({ ok: true });
    return;
  }
  if (!business?.trim() && !name?.trim()) {
    res.status(400).json({ error: 'Missing name/business.' });
    return;
  }

  const headers = {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    'content-type': 'application/json',
    prefer: 'return=representation',
  };
  const insert = async (table: string, payload: unknown) => {
    const r = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`${table}: ${await r.text()}`);
    const rows = await r.json();
    return rows[0];
  };

  try {
    // Single-operator CRM: everything belongs to the first (only) profile.
    const ownerResp = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id&order=created_at.asc&limit=1`,
      { headers },
    );
    const owner = (await ownerResp.json())[0];
    if (!owner) throw new Error('No CRM user exists yet.');

    const accountName = (business?.trim() || name?.trim()).slice(0, 200);
    const account = await insert('accounts', {
      owner_id: owner.id,
      name: accountName,
      lead_source: 'inbound',
      pipeline_stage: 'new_lead',
      status: 'lead',
      primary_contact_name: name?.trim()?.slice(0, 200) || null,
      primary_contact_email: email?.trim()?.slice(0, 200) || null,
    });

    await insert('deals', {
      owner_id: owner.id,
      account_id: account.id,
      title: `${accountName} — website enquiry`,
      pipeline_stage: 'new_lead',
      status: 'open',
    });

    await insert('activities', {
      owner_id: owner.id,
      account_id: account.id,
      type: 'message',
      body: `Website enquiry:\n\n${(message ?? '').trim().slice(0, 4000) || '(no message)'}`,
    });

    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(502).json({ error: err?.message ?? 'Could not record the enquiry.' });
  }
}
