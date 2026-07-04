// Vercel serverless function — the only place the Anthropic API is called.
// The key lives in the ANTHROPIC_API_KEY env var, never client-side.
// Auth: every request must carry a valid Supabase user JWT.
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are the in-house assistant for Torqpoint, a content & marketing studio in Gloucestershire run by Luke Deakin.

Torqpoint turns one finished job into content across every channel: a case study, social posts, an email, a blog, a Google Business post. Clients are makers and builders — joiners, builders, landscapers, trades and craft businesses. The client sends phone photos and a few lines; Torqpoint researches the business (voice, audience, what they care about), writes in that voice, the client approves, and it goes live. Sold one-off or as a monthly retainer, quoted up front, no lock-in.

House voice: grounded, precise, considered, plain-spoken. Short sentences. Real specifics. No buzzwords, no exclamation marks, no hype. Talk like someone who understands the trade and respects the reader's time. British English.

When drafting outreach or client messages, write as Luke: friendly, direct, brief. Never invent facts about a business — if you don't know, leave a [placeholder]. Output should be ready to copy and send, with no preamble or commentary unless asked.`;

const ACTIONS: Record<string, { instruction: string; webSearch?: boolean }> = {
  draft_outreach: {
    instruction:
      'Draft a first outreach message (email) to this lead from Luke at Torqpoint. Reference what makes their business a fit. Keep it under 150 words, end with a low-pressure call suggestion. Provide a subject line.',
  },
  draft_followup: {
    instruction:
      'Draft a follow-up message to this lead from Luke, based on where things stand in the activity log. Warm, brief, no pressure. Provide a subject line if email fits best.',
  },
  summarise: {
    instruction:
      'Summarise this lead/client for Luke in under 150 words: who they are, where the relationship stands, money on the table, and anything overdue or at risk. Use short bullet points with a one-line headline.',
  },
  next_move: {
    instruction:
      'Suggest the single best next move on this deal, in 2-3 sentences, then give one alternative. Be concrete — what to do, when, and why it fits where the deal sits.',
  },
  chase_draft: {
    instruction:
      'This deal has gone quiet. Draft a short, graceful chase message from Luke that revives the conversation without sounding needy. Under 100 words. Provide a subject line.',
  },
  draft_deliverable: {
    instruction:
      'Write the content for this deliverable in the Torqpoint house voice, using the account research notes and any brief in the deliverable body. If key facts are missing, use [placeholders] rather than inventing. Output only the content itself, ready for review.',
  },
  lead_research: {
    webSearch: true,
    instruction:
      'Research this business on the web. Produce: 1) FIT BRIEF — what they do, location, who their customers are, their voice/tone online, content gaps Torqpoint could fill (be specific about what you actually found); 2) FIRST OUTREACH — a first outreach email from Luke, under 150 words, referencing something real you found, ending with a low-pressure call suggestion, with a subject line. If you cannot find the business, say so plainly.',
  },
  run_my_week: {
    instruction:
      "Write Luke's Monday briefing from this CRM snapshot. Sections: THE WEEK IN ONE LINE; NEEDS YOU (due/overdue follow-ups and deliverables, in priority order); DEALS GOING COLD (open deals with no recent activity — for the coldest one, include a two-line chase draft); MONEY (unpaid + overdue invoices, who to invoice, MRR); ONE SUGGESTION (a single high-leverage action for the week). Keep it tight and scannable — plain text, no markdown tables.",
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error:
        'The AI layer is not connected yet — the Anthropic API key needs adding to the environment (an approval tap).',
    });
    return;
  }

  // Verify the caller is the signed-in CRM user.
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

  const { action, context } = req.body ?? {};
  const spec = ACTIONS[action as string];
  if (!spec) {
    res.status(400).json({ error: `Unknown action: ${action}` });
    return;
  }

  const client = new Anthropic({ apiKey });
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      tools: spec.webSearch
        ? [{ type: 'web_search_20260209', name: 'web_search', max_uses: 6 } as any]
        : undefined,
      messages: [
        {
          role: 'user',
          content: `${spec.instruction}\n\nContext from the CRM:\n${JSON.stringify(
            context ?? {},
            null,
            2,
          )}`,
        },
      ],
    });

    const text = response.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n');
    res.status(200).json({ text });
  } catch (err: any) {
    res.status(502).json({
      error: err?.message ?? 'The AI call failed — try again in a moment.',
    });
  }
}
