// Email a quote/invoice to a client via Resend. Needs RESEND_API_KEY (and
// ideally RESEND_FROM once the torqpoint.com domain is verified in Resend).
// JWT-verified like the AI endpoint; the browser never sees the key.

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function gbp(n: number): string {
  return `£${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error:
        'Email sending is not switched on yet — it needs a free Resend account and one key in Vercel (an approval tap).',
    });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const token = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  if (!supabaseUrl || !anonKey || !token) {
    res.status(401).json({ error: 'Not signed in.' });
    return;
  }
  const userCheck = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, authorization: `Bearer ${token}` },
  });
  if (!userCheck.ok) {
    res.status(401).json({ error: 'Not signed in.' });
    return;
  }

  const { to, subject, message, kind, doc, business, accountName } = req.body ?? {};
  if (!to || !doc?.number) {
    res.status(400).json({ error: 'Missing recipient or document.' });
    return;
  }

  const rows = (doc.line_items ?? [])
    .map(
      (l: any) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E3E1DB;">${esc(l.description)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #E3E1DB;text-align:right;">${l.qty}</td>
        <td style="padding:10px 0;border-bottom:1px solid #E3E1DB;text-align:right;">${gbp(l.unit_price)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #E3E1DB;text-align:right;font-weight:600;">${gbp(l.line_total)}</td>
      </tr>`,
    )
    .join('');

  const isInvoice = kind === 'invoice';
  const html = `
  <div style="background:#F8F7F4;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;color:#16181C;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #E3E1DB;border-radius:12px;padding:32px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <span style="font-size:22px;font-weight:700;">${esc(business?.name ?? 'Torqpoint')}<span style="display:inline-block;width:8px;height:8px;background:#EE5A1E;margin-left:5px;"></span></span>
        <span style="font-size:13px;color:#3C4147;text-transform:uppercase;letter-spacing:1px;">${isInvoice ? 'Invoice' : 'Quote'} ${esc(doc.number)}</span>
      </div>
      ${message ? `<p style="font-size:14px;line-height:1.6;color:#3C4147;margin:24px 0 0;">${esc(message).replace(/\n/g, '<br/>')}</p>` : ''}
      <table style="width:100%;border-collapse:collapse;margin-top:28px;font-size:14px;">
        <tr>
          <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #16181C;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#3C4147;">Description</th>
          <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #16181C;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#3C4147;">Qty</th>
          <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #16181C;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#3C4147;">Unit</th>
          <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #16181C;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#3C4147;">Total</th>
        </tr>
        ${rows}
      </table>
      <table style="width:100%;margin-top:16px;font-size:14px;">
        <tr><td></td><td style="text-align:right;color:#3C4147;padding:2px 0;">Subtotal&nbsp;&nbsp;${gbp(doc.subtotal)}</td></tr>
        ${Number(doc.vat_amount) > 0 ? `<tr><td></td><td style="text-align:right;color:#3C4147;padding:2px 0;">VAT&nbsp;&nbsp;${gbp(doc.vat_amount)}</td></tr>` : ''}
        <tr><td></td><td style="text-align:right;font-size:20px;font-weight:700;padding-top:8px;">${isInvoice ? 'Total due' : 'Total'}&nbsp;&nbsp;${gbp(doc.total)}</td></tr>
      </table>
      ${
        isInvoice
          ? `<div style="margin-top:28px;padding:16px;background:#F8F7F4;border-radius:8px;font-size:13px;line-height:1.6;color:#3C4147;">
              ${doc.due_date ? `<strong style="color:#16181C;">Due ${esc(doc.due_date)}</strong><br/>` : ''}
              ${business?.bank_details ? esc(business.bank_details).replace(/\n/g, '<br/>') + '<br/>' : ''}
              ${business?.payment_link ? `Pay online: <a href="${esc(business.payment_link)}" style="color:#EE5A1E;">${esc(business.payment_link)}</a><br/>` : ''}
              ${business?.payment_terms ? esc(business.payment_terms) : ''}
            </div>`
          : `<p style="margin-top:28px;font-size:13px;color:#3C4147;">Quoted up front, no lock-in. Reply to this email to accept and we'll get started.</p>`
      }
      <p style="margin-top:28px;font-size:12px;color:#3C4147;border-top:1px solid #E3E1DB;padding-top:12px;">
        ${esc(business?.name ?? 'Torqpoint')} · Gloucestershire${accountName ? ` · for ${esc(accountName)}` : ''}
      </p>
    </div>
  </div>`;

  const from =
    process.env.RESEND_FROM ?? 'Torqpoint <onboarding@resend.dev>';
  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: subject || `${isInvoice ? 'Invoice' : 'Quote'} ${doc.number} — ${business?.name ?? 'Torqpoint'}`,
      html,
    }),
  });

  if (!send.ok) {
    const detail = await send.text();
    res.status(502).json({
      error: `The email service refused it: ${detail.slice(0, 300)}`,
    });
    return;
  }
  res.status(200).json({ ok: true });
}
