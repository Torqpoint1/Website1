# Torqpoint website

Content & marketing studio — [torqpoint.com](https://torqpoint.com)

---

## Adding content (no code needed)

### Journal posts

1. Go to **`/admin`** on the live site (e.g. `torqpoint.com/admin`)
2. Log in with your GitHub account
3. Click **Journal → New Journal post**
4. Fill in: Title, Date, Excerpt (one sentence for the listing page), Body
5. Click **Publish** — the post goes live in about 30 seconds

**Or**, create a `.md` file in `content/journal/` directly on GitHub:

```
---
title: "Your post title"
date: "2025-07-01"
excerpt: "One sentence preview shown on the listing page."
---

Your post content in normal paragraphs.

## A subheading if you need one

More text...
```

Name the file with a URL-friendly slug, e.g. `how-case-studies-win-work.md`.

---

### Case studies (Work page)

Go to **Work / Case Studies → New Case study** in the CMS, or create a `.md` file in `content/work/`:

```
---
title: "Extension and kitchen renovation — Smith Builders"
client: "Smith Builders"
date: "2025-06-15"
summary: "A two-storey extension and full kitchen renovation, turned into a case study and social series."
cover: "/images/smith-builders-cover.jpg"
---

Your case study content here...
```

Upload cover images via the CMS media library (drag and drop), then reference them as `/images/filename.jpg`.

---

## Contact form setup

The form uses [Web3Forms](https://web3forms.com) (free).

1. Go to [web3forms.com](https://web3forms.com) and enter `info@torqpoint.com`
2. They'll email you an **Access Key**
3. Add it to your Vercel environment variables:
   - Name: `NEXT_PUBLIC_WEB3FORMS_KEY`
   - Value: your key
4. Redeploy — forms will now deliver to your inbox

---

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → import `torqpoint1/website1`
2. Framework: **Next.js** (auto-detected)
3. Add environment variable: `NEXT_PUBLIC_WEB3FORMS_KEY`
4. Click Deploy

**Connect torqpoint.com:**
- In Vercel: Settings → Domains → add `torqpoint.com`
- Add the `A` and `CNAME` records Vercel shows you to your DNS provider

---

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** CSS Modules + CSS custom properties
- **Content:** Markdown files in `/content/` (no database)
- **CMS:** Decap CMS at `/admin` (GitHub-backed, no-code editing)
- **Forms:** Web3Forms → info@torqpoint.com
- **Deploy:** Vercel
- **Fonts:** Bricolage Grotesque + Fraunces (Google Fonts)