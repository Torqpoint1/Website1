/**
 * Shared content + structure for the eight service detail pages under
 * /services/<slug>/. Copy is transcribed verbatim from the content brief
 * (British English, em dashes, *asterisks* mark italic emphasis — rendered
 * by withEmphasis in components/services). The eight pages are separate
 * routes/files that each compose <ServicePage> with this data by tier.
 */

export type Tier = 1 | 2 | 3;

export interface ProofCard {
  /** real /work/<slug>/ case study */
  workSlug: string;
  client: string;
  blurb: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface HowStep {
  title: string;
  desc: string;
}

export interface CapabilityItem {
  title: string;
  desc: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  tier: Tier;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  standfirst: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  shortVersion: string;
  /** Tier 1: full prose. Tier 2: merged why/who paragraphs. */
  whyItMatters?: string[];
  whoItsFor?: string;
  whatYouGet?: string[];
  howItWorks: HowStep[];
  proof?: ProofCard[];
  faqs?: Faq[];
  pairsWith: string[];
  /** Tier 3 only */
  thingsWeGetAskedFor?: CapabilityItem[];
  closingLine?: string;
  photoNote?: string;
}

/** Footer prev/next order — loops (content brief). */
export const SERVICE_ORDER: string[] = [
  'social-posts',
  'case-studies',
  'email-newsletters',
  'blog-articles',
  'google-business-posts',
  'profiles-setup',
  'website-design-build',
  'anything-else',
];

const SECONDARY_PROOF = { label: 'See it in the work', href: '#proof' };
const PRIMARY_START = { label: 'Start a project', href: '/contact' };

export const SERVICES: Record<string, ServiceData> = {
  'social-posts': {
    slug: 'social-posts',
    name: 'Social posts',
    tier: 1,
    metaTitle: 'Social posts',
    metaDescription:
      'Done-for-you social posts for Gloucestershire businesses — written, formatted and scheduled from the photos already on your phone. One post or a month at a time.',
    eyebrow: 'Service · Social posts',
    h1: 'A month of posts, built from the photos already on your phone.',
    standfirst:
      'You finish the job, take a few photos, and move on to the next one. We turn those photos into a month of posts — written, formatted and scheduled — so your feed keeps working while you don’t.',
    primaryCta: PRIMARY_START,
    secondaryCta: SECONDARY_PROOF,
    shortVersion:
      'Social posts are the steady drumbeat that keeps your business visible between jobs. We take the photos and details you already have and turn them into scroll-stopping posts in your voice — captions, formatting, hashtags and scheduling all handled. One post before a busy spell, or a full month in a single batch.',
    whyItMatters: [
      'Most good local businesses post in bursts — three times one week, then nothing for two months. The platform forgets you, and so do your customers. A quiet feed reads as a quiet business, even when you’re flat out.',
      'A steady feed does the opposite. It keeps you in front of past customers and warm leads, so when the need comes up again — the next bathroom, the next garden, the next event — you’re the name they already have. Right now your best work is sitting in your camera roll, seen by no one. This is how it earns its keep.',
    ],
    whoItsFor:
      'Any business whose work photographs well and whose next job often comes from being remembered: makers and designers, home-improvement and outdoor trades, hosts and venues, studios and salons. If you’re proud of what you produce but “doing the socials” keeps sliding to the bottom of the list — this is built for you.',
    whatYouGet: [
      'Captions written in your voice — researched, never generic filler',
      'Posts formatted properly for the platform (Instagram, Facebook, LinkedIn)',
      'Relevant, researched hashtags — not a random wall of tags',
      'A consistent look and tone that fits your brand',
      'Scheduled and ready to publish — or we publish for you',
      'One post, a batch, or a full month — your call',
    ],
    howItWorks: [
      {
        title: 'Send the raw material.',
        desc: 'A batch of photos and a few lines — or just a voice note. No shoot to schedule, no afternoon away from the work.',
      },
      {
        title: 'We research and create.',
        desc: 'We learn your business and write each post in your voice, formatted and ready for the platform.',
      },
      {
        title: 'You approve, we deliver.',
        desc: 'A couple of minutes to check it over, then it’s scheduled and live.',
      },
    ],
    proof: [
      {
        workSlug: 'ashcroft-joinery-oak-staircase',
        client: 'Ashcroft Joinery — six-slide carousel',
        blurb:
          'One staircase turned into a scroll-and-save carousel that opens with *“Six weeks of work. One staircase. Zero screws.”*',
      },
      {
        workSlug: 'fieldhouse-landscapes-cotswold-garden',
        client: 'Fieldhouse Landscapes — before-and-after',
        blurb:
          'An overgrown plot to a sandstone terrace, told as the kind of transformation post people actually stop for.',
      },
      {
        workSlug: 'foxglove-and-fern-wedding-florist',
        client: 'Foxglove & Fern — one wedding, a season of posts',
        blurb: 'A single day’s flowers turned into a carousel that does the selling.',
      },
    ],
    faqs: [
      {
        q: 'Do I need to do a photo shoot?',
        a: 'No. Phone photos are perfect — that’s the whole point. If a job really deserves a proper shoot, we can source and arrange one through our network.',
      },
      {
        q: 'What if I don’t know what to write?',
        a: 'That’s exactly what you’re handing over. You send the raw material; we do the words.',
      },
      {
        q: 'Which platforms do you cover?',
        a: 'Instagram, Facebook and LinkedIn most often — wherever your customers actually are. We format for each one properly rather than posting the same thing everywhere.',
      },
      {
        q: 'Will it actually sound like me?',
        a: 'Yes. We research your business and write in your voice. No copy-paste captions, no “we are thrilled to announce”.',
      },
      {
        q: 'Do I have to commit every month?',
        a: 'No. Take a single post, a batch before a busy spell, or a rolling month-by-month set. Scale it up or down whenever.',
      },
    ],
    pairsWith: ['case-studies', 'profiles-setup', 'google-business-posts'],
  },

  'case-studies': {
    slug: 'case-studies',
    name: 'Case studies',
    tier: 1,
    metaTitle: 'Case studies',
    metaDescription:
      'We write up your finished jobs as proper case studies — the proof you send a prospect before they commit. Built from your photos, written in your voice.',
    eyebrow: 'Service · Case studies',
    h1: 'Your finished jobs, written up to win the next one.',
    standfirst:
      'A great job that nobody can see isn’t proof — it’s a memory. We turn one completed project into a written case study you can send to a prospect who’s deciding between you and a cheaper quote.',
    primaryCta: PRIMARY_START,
    secondaryCta: { label: 'See a sample case study', href: '#proof' },
    shortVersion:
      'A case study is the story of one job, told properly: the brief, the problem, what you did, and why it was worth it. It’s the single most persuasive thing you can put in front of someone who’s about to choose. We build it from your photos and a few notes — no writing, no shoot, no time off the tools.',
    whyItMatters: [
      'Most jobs are bought on price until someone gives the buyer a reason to look past it. A case study is that reason. It shows the thinking and the craft a quote can’t — in close-up, in your own words — so the prospect can *see* exactly where the money goes.',
      'One project, written up properly, becomes the thing that wins the next three. It works on your website, in your inbox, and in a reply to “can you send me some examples?” Without it, your best argument for your price stays trapped on a phone.',
    ],
    whoItsFor:
      'Anyone whose work is bought on trust and quality rather than the lowest number: makers, designers, installers, builders, hosts, and premium local services. If you’ve ever lost a job to a cheaper quote and thought *“if they could only see the difference”* — this is how you show it.',
    whatYouGet: [
      'A written case study in a clear, repeatable structure: the project, the problem, what you did, why it worked',
      'Written in your voice — plain and confident, never corporate filler',
      'A short version for social or email, and a longer version for your site',
      'Built entirely from your photos and notes',
      'Yours to use anywhere — send it, post it, put it on the website',
    ],
    howItWorks: [
      {
        title: 'Send the raw material.',
        desc: 'Photos from the job and a few voice notes on what made it tricky or special.',
      },
      {
        title: 'We research and write.',
        desc: 'We shape it into a case study that leads with proof and reads like you.',
      },
      {
        title: 'You approve, we deliver.',
        desc: 'Delivered ready to send and ready to publish.',
      },
    ],
    proof: [
      {
        workSlug: 'ashcroft-joinery-oak-staircase',
        client: 'Ashcroft Joinery',
        blurb:
          'A hand-cut oak staircase, written up to open with *“Most staircases are bought on price. This one was bought on the photo of a single joint.”*',
      },
      {
        workSlug: 'marsh-vale-bathrooms-wet-room',
        client: 'Marsh & Vale Bathrooms',
        blurb:
          'A cramped ensuite rebuilt as a walk-in wet room — turned into a case study that feeds the whole funnel.',
      },
      {
        workSlug: 'maeve-clarke-interiors-townhouse',
        client: 'Maeve Clarke Interiors',
        blurb:
          'A finished room is a portfolio piece — if anyone sees it. We made the piece that wins the next client.',
      },
    ],
    faqs: [
      {
        q: 'How much of my time does this take?',
        a: 'Minutes. You send photos and a couple of voice notes; we do the rest.',
      },
      {
        q: 'What if the job wasn’t photographed well?',
        a: 'We work with what you have, and we’ll tell you honestly if a quick reshoot would lift it. We can arrange one if you want.',
      },
      {
        q: 'Can I send it to prospects directly?',
        a: 'That’s what it’s built for — a link or a PDF you can fire off the moment someone asks for examples.',
      },
      {
        q: 'Do you need the client’s permission?',
        a: 'We’ll guide you on what’s safe to share. Plenty of strong case studies work without naming the client at all.',
      },
      {
        q: 'How is this different from a blog article?',
        a: 'A case study proves *you*. A blog article helps you get *found*. They work best together.',
      },
    ],
    pairsWith: ['social-posts', 'blog-articles', 'website-design-build'],
  },

  'email-newsletters': {
    slug: 'email-newsletters',
    name: 'Email & newsletters',
    tier: 1,
    metaTitle: 'Email & newsletters',
    metaDescription:
      'Email that keeps you in front of past customers and warm leads — a single send or a regular newsletter, written and ready to go. Gloucestershire content studio.',
    eyebrow: 'Service · Email & newsletters',
    h1: 'The cheapest list you’ll ever own — and the one most businesses ignore.',
    standfirst:
      'Your past customers already trust you. Email is how you stay in front of them, so the next job — and the referral — comes back to you instead of going to whoever they remembered first.',
    primaryCta: PRIMARY_START,
    secondaryCta: SECONDARY_PROOF,
    shortVersion:
      'Email is the one channel you actually own. No algorithm deciding who sees you, no paying to reach people who already chose you once. We write the send — a one-off announcement or a regular newsletter — in your voice, formatted and ready to go out to past customers and warm leads.',
    whyItMatters: [
      'Most of your future work is hiding in people who already hired you. They liked the job. They’d happily use you again or pass your name on — they’ve just forgotten, because nothing has reminded them.',
      'A short, well-written email fixes that for almost nothing. It turns a finished job into the next enquiry, and a quiet list into a steady source of repeat work and referrals. Social posts reach whoever the platform decides to show. Email lands in front of the people who already said yes.',
    ],
    whoItsFor:
      'Any business that has done good work for people before — which is all of them. Especially powerful if your jobs are occasional and high-value (a bathroom, a garden, an event), where staying remembered between purchases is the whole game.',
    whatYouGet: [
      'A single send or a regular newsletter — monthly, quarterly, whatever suits',
      'Subject lines written to get opened',
      'Copy in your voice, built around your latest work',
      'Clean, on-brand formatting that works on a phone',
      'Set up ready to send — or sent for you',
      'Simple guidance on growing and looking after your list',
    ],
    howItWorks: [
      {
        title: 'Tell us the goal.',
        desc: 'A new project to show off, an offer, or just “keep us front of mind this quarter”.',
      },
      {
        title: 'We research and write.',
        desc: 'Subject line, body and layout — in your voice, never a template.',
      },
      {
        title: 'You approve, we deliver.',
        desc: 'Scheduled and sent, or handed over ready to fire.',
      },
    ],
    proof: [
      {
        workSlug: 'marsh-vale-bathrooms-wet-room',
        client: 'Marsh & Vale Bathrooms',
        blurb:
          'One wet-room job turned into a case study, a blog *and* an email that keeps the referrals coming — one job feeding the whole funnel.',
      },
      {
        workSlug: 'the-old-cartshed-holiday-let',
        client: 'The Old Cartshed',
        blurb:
          'A holiday let that relied on booking sites and their commission — we built the content engine, email included, that fills the calendar directly.',
      },
    ],
    faqs: [
      {
        q: 'I don’t have a list. Can you still help?',
        a: 'Yes. We’ll help you start one the right way and make the first sends count.',
      },
      {
        q: 'How often should I email?',
        a: 'Often enough to be remembered, rarely enough to be welcome. For most local businesses that’s monthly or quarterly — we’ll advise.',
      },
      {
        q: 'Will people unsubscribe?',
        a: 'A few always will, and that’s fine — they were never going to buy. The ones who stay are your warmest leads.',
      },
      {
        q: 'What do I even say?',
        a: 'That’s our job. You point us at the latest work or the goal; we find the angle.',
      },
      {
        q: 'Which tool do you use?',
        a: 'We work with whatever you’re on, or set you up on something simple and free to start.',
      },
    ],
    pairsWith: ['case-studies', 'social-posts', 'profiles-setup'],
  },

  'blog-articles': {
    slug: 'blog-articles',
    name: 'Blog articles',
    tier: 1,
    metaTitle: 'Blog articles',
    metaDescription:
      'Genuinely useful blog articles written in your voice — the kind that answer real customer questions and help you show up on Google. Built for Gloucestershire businesses.',
    eyebrow: 'Service · Blog articles',
    h1: 'The questions every customer asks first — answered on your website, found on Google.',
    standfirst:
      'Before anyone enquires, they search. A good blog article puts your answer in front of them at that exact moment — useful enough to build trust, and written properly enough to rank.',
    primaryCta: PRIMARY_START,
    secondaryCta: SECONDARY_PROOF,
    shortVersion:
      'A blog article is a genuinely useful piece written around a real question your customers type into Google — “how much does a wet room cost?”, “what’s the best time to plant a garden?”. Done properly, it does two jobs at once: it helps the right people find you, and it builds trust before they’ve even spoken to you.',
    whyItMatters: [
      'Your customers are searching long before they’re ready to buy. If you’re not the one answering, your competitor is — and they get the trust *and* the enquiry.',
      'Good articles are some of the only marketing that keeps working after it’s published. A post written today can bring in enquiries for years, quietly, from people you never paid to reach. Most “business blogs” fail because they’re thin, generic and clearly written for a robot. Ours are written for the customer first — which, conveniently, is also what Google now rewards.',
    ],
    whoItsFor:
      'Any business whose customers research before they buy, and who’d benefit from showing up when they do. Especially valuable for considered, higher-value services where people want to feel informed before they commit.',
    whatYouGet: [
      'Articles built around questions your customers actually search',
      'Written in your voice — useful and readable, never keyword soup',
      'Naturally optimised so Google can understand and rank them',
      'A clear structure with headings, so it’s easy to read on a phone',
      'Formatted and ready to publish on your site',
      'A topic plan, if you want a steady stream rather than one-offs',
    ],
    howItWorks: [
      {
        title: 'Tell us your world.',
        desc: 'The questions you get asked constantly, the jobs you want more of.',
      },
      {
        title: 'We research and write.',
        desc: 'We find what people are searching, then write the genuinely useful answer in your voice.',
      },
      {
        title: 'You approve, we deliver.',
        desc: 'Delivered ready to publish — or published for you.',
      },
    ],
    proof: [
      {
        workSlug: 'marsh-vale-bathrooms-wet-room',
        client: 'Marsh & Vale Bathrooms',
        blurb:
          '“A cramped ensuite, and the blog post that brings in the next ten.” One job became a case study, an email *and* a blog built to rank.',
      },
    ],
    faqs: [
      {
        q: 'Isn’t blogging dead?',
        a: 'Thin, generic blogging is. Genuinely useful articles that answer real questions are more valuable than ever — they’re exactly what search engines now push to the top.',
      },
      {
        q: 'Will this actually help me rank?',
        a: 'It’s one of the strongest long-term plays there is. It’s not overnight — good rankings build over months — but the work compounds.',
      },
      {
        q: 'Is this just AI spam?',
        a: 'No. We research properly and write in your voice. The whole point is to sound like a real expert, because you are one.',
      },
      {
        q: 'How long should articles be?',
        a: 'As long as the answer needs — no longer. We write to be read, not to hit a word count.',
      },
      {
        q: 'How often should I publish?',
        a: 'Even one strong article a month builds real momentum over a year. Consistency beats volume.',
      },
    ],
    pairsWith: ['google-business-posts', 'case-studies', 'website-design-build'],
  },

  'google-business-posts': {
    slug: 'google-business-posts',
    name: 'Google Business posts',
    tier: 2,
    metaTitle: 'Google Business posts',
    metaDescription:
      'Keep your Google Business Profile active and working — regular posts and updates that help you show up in local search and turn your listing into enquiries.',
    eyebrow: 'Service · Google Business posts',
    h1: 'The first thing local customers see — kept active, kept working.',
    standfirst:
      'For a local business, your Google Business Profile is often the front door — seen before your website, before your socials. We keep it active with regular posts, so the listing that people actually find is the one that’s clearly switched on.',
    primaryCta: PRIMARY_START,
    secondaryCta: SECONDARY_PROOF,
    shortVersion:
      'Your Google Business Profile is the panel that appears when someone searches your name — or searches “[your service] near me”. Posting to it regularly keeps it fresh, gives Google reasons to show you, and turns a static listing into something that actively pulls in calls and enquiries. We write and schedule those posts for you.',
    whyItMatters: [
      'When someone searches for what you do nearby, Google decides who to show. An active, well-kept profile is one of the clearest signals you’re a real, current, trustworthy business — and it’s shown right at the moment of intent, when someone is *ready* to call.',
      'A neglected profile does the opposite. No recent posts, an old photo, a half-finished description — it quietly tells a ready-to-buy customer to keep scrolling to whoever looks more on it. This is some of the highest-intent visibility you can get, and most businesses leave it switched off.',
    ],
    whoItsFor:
      'Any business that serves a local area and gets work from people searching nearby — trades, home services, hospitality, retail, clinics, studios. If “near me” searches could bring you customers, this is where you win or lose them.',
    whatYouGet: [
      'Regular Google Business posts — offers, updates, recent jobs',
      'Written to prompt the next action: call, message, enquire',
      'Your latest photos put to work on the listing',
      'A tidy, complete, on-brand profile that reads as switched-on',
      'Scheduled so it stays consistent without you thinking about it',
    ],
    howItWorks: [
      {
        title: 'Point us at the profile.',
        desc: 'We review what’s there and what’s missing.',
      },
      {
        title: 'We create and post.',
        desc: 'Regular updates built from your work, written to convert.',
      },
      {
        title: 'It stays active.',
        desc: 'Consistent posting in the background, so your front door always looks open.',
      },
    ],
    proof: [
      {
        workSlug: 'fieldhouse-landscapes-cotswold-garden',
        client: 'Fieldhouse Landscapes',
        blurb:
          'Local, visual, before-and-after work — exactly the kind that makes a “near me” searcher stop and choose you.',
      },
    ],
    pairsWith: ['profiles-setup', 'blog-articles', 'social-posts'],
  },

  'profiles-setup': {
    slug: 'profiles-setup',
    name: 'Profiles & setup',
    tier: 2,
    metaTitle: 'Profiles & setup',
    metaDescription:
      'Get your social profiles, Google listing and directories set up properly and looking the part — consistent, complete and built to convert the people who find you.',
    eyebrow: 'Service · Profiles & setup',
    h1: 'Look the part everywhere someone might check you out.',
    standfirst:
      'Before anyone hires you, they look you up — your Instagram, your Google listing, your bio. If those are half-finished or inconsistent, you lose people before you ever hear from them. We get them set up, complete and looking the part.',
    primaryCta: PRIMARY_START,
    secondaryCta: SECONDARY_PROOF,
    shortVersion:
      'Profiles & setup is the groundwork: the bios, photos, descriptions, links and details across your social profiles and listings — set up properly, kept consistent, and written to convert. It’s the unglamorous bit that quietly decides whether everything else you do actually lands.',
    whyItMatters: [
      'Every post, email and search result sends people to the same place: your profile. If that profile is a mismatched logo, an empty bio and a dead link, you’ve spent effort getting someone interested only to lose them at the door.',
      'A complete, consistent, well-written profile does the opposite. It looks established. It answers “what do they do, where, and how do I contact them?” in seconds. It’s the cheapest credibility you’ll ever buy — and it makes every other thing you do convert better.',
    ],
    whoItsFor:
      'Anyone just getting serious about being online, anyone whose profiles have grown messy over the years, and anyone who’s about to start posting and wants the foundation right first. If you’ve never quite finished your bio, this is for you.',
    whatYouGet: [
      'Social profiles set up and polished — bio, photo, links, highlights',
      'Your Google Business Profile claimed, completed and tidied',
      'Key directories and listings consistent across the board',
      'A clear, on-brand description that says what you do and who for',
      'The right contact paths and links so an interested person can act',
      'One consistent look and tone everywhere you appear',
    ],
    howItWorks: [
      {
        title: 'Send us what you’ve got.',
        desc: 'Logins or links to whatever exists — or nothing, if you’re starting fresh.',
      },
      {
        title: 'We set it up properly.',
        desc: 'Complete, consistent and written to convert, across every profile.',
      },
      {
        title: 'You’re ready to go.',
        desc: 'A foundation that makes your posts, emails and listings all work harder.',
      },
    ],
    proof: [
      {
        workSlug: 'foxglove-and-fern-wedding-florist',
        client: 'Foxglove & Fern',
        blurb:
          'One wedding turned into a case study, a carousel *and* a profile that does the selling — the listing working as hard as the content.',
      },
    ],
    pairsWith: ['google-business-posts', 'social-posts', 'website-design-build'],
  },

  'website-design-build': {
    slug: 'website-design-build',
    name: 'Website design & build',
    tier: 1,
    metaTitle: 'Website design & build',
    metaDescription:
      'A fast, on-brand website built to win enquiries — designed around your content and your business. We oversee high-quality builds for Gloucestershire businesses.',
    eyebrow: 'Service · Website design & build',
    h1: 'A proper online home — designed in your brand, built to win enquiries.',
    standfirst:
      'Your content needs somewhere to live and somewhere to convert. We oversee high-quality website builds designed around your brand and your best work — fast, clear, and built to turn visitors into enquiries rather than just looking nice.',
    primaryCta: PRIMARY_START,
    secondaryCta: SECONDARY_PROOF,
    shortVersion:
      'A website is the one place online that’s entirely yours — no algorithm, no commission, no borrowed audience. We design and oversee the build of a fast, on-brand site that shows off your work and is built to convert: clear, credible, and pointed at getting people to enquire.',
    whyItMatters: [
      'Most enquiries end up on your website before they decide. A slow, dated or confusing site quietly loses them — and you never even know it happened. A sharp one does the opposite: it makes a serious business look serious, puts your best work front and centre, and makes enquiring the obvious next step.',
      'This is also where everything else you do pays off. Your case studies, your blog, your photos — they all have a home that’s working for you around the clock, and that you actually own. (This very site is the example: designed and built in-house.)',
    ],
    whoItsFor:
      'Any business that’s outgrown a free page, a tired old site, or relying entirely on social and booking platforms. Especially if your work is visual and high-value, and your current site doesn’t do it justice.',
    whatYouGet: [
      'A site designed around your brand — not a generic template',
      'Built for speed and for phones, where most people will see it',
      'Structured to convert: clear messaging, obvious next steps, working enquiry paths',
      'Your best work, case studies and content built in',
      'The right groundwork so Google can find you',
      'Oversight from brief to live — we manage the build, you stay in your business',
    ],
    howItWorks: [
      {
        title: 'Tell us the goal.',
        desc: 'What the site needs to do, who it’s for, and the work you want to lead with.',
      },
      {
        title: 'We design and oversee the build.',
        desc: 'On-brand, fast, and built to convert — managed end to end.',
      },
      {
        title: 'You review, we deliver.',
        desc: 'Built, checked and launched — then kept working as your content grows.',
      },
    ],
    proof: [
      {
        workSlug: 'ashcroft-joinery-oak-staircase',
        client: 'Ashcroft Joinery',
        blurb:
          'A website hero and feature built so one staircase keeps selling for years — *“Built by hand. Built to outlive you.”*',
      },
      {
        workSlug: 'maeve-clarke-interiors-townhouse',
        client: 'Maeve Clarke Interiors',
        blurb:
          'A portfolio, a social set and a site built to hold them — the finished rooms presented as carefully as they were designed.',
      },
      {
        workSlug: 'the-old-cartshed-holiday-let',
        client: 'The Old Cartshed',
        blurb:
          'A beautiful barn nobody could find, given a home that drives direct bookings instead of paying commission.',
      },
    ],
    faqs: [
      {
        q: 'Do you build it yourselves?',
        a: 'We design and oversee high-quality builds end to end, drawing on our network where specialist work is needed — you get one point of contact and a result that’s looked after.',
      },
      {
        q: 'How long does it take?',
        a: 'It depends on size, but we’ll give you a clear timeline up front. Most small-business sites move faster than people expect.',
      },
      {
        q: 'Will I be able to update it?',
        a: 'Yes — we build it so you can, and we can keep handling it if you’d rather not.',
      },
      {
        q: 'What about hosting and the domain?',
        a: 'We’ll guide the whole lot, or handle it for you. No jargon, no surprises.',
      },
      {
        q: 'Can you just improve my current site?',
        a: 'Often, yes. Sometimes a refresh is smarter than a rebuild — we’ll tell you straight.',
      },
    ],
    pairsWith: ['case-studies', 'blog-articles', 'profiles-setup'],
  },

  'anything-else': {
    slug: 'anything-else',
    name: 'Anything else',
    tier: 3,
    metaTitle: 'Anything else',
    metaDescription:
      'No content or marketing challenge is off the table. If it grows your business or builds your reputation, we’ll make it happen — just tell us what you need.',
    eyebrow: 'Service · Anything else',
    h1: 'If it grows your business, it’s on the table.',
    standfirst:
      'The list covers what we’re asked for most — not the limit of what we do. If your content or marketing challenge isn’t on it, that’s not a no. It’s just the start of a conversation.',
    primaryCta: { label: 'Tell us what you need', href: '/contact' },
    shortVersion:
      'No content or marketing task is off the table. If it grows your business or builds your reputation, we’ll either make it happen or arrange the right people to. You don’t have to map your problem onto a menu — tell us the goal, and we’ll work out the route.',
    thingsWeGetAskedFor: [
      {
        title: 'Photography & video',
        desc: 'sourced and arranged through our network when a job deserves a proper shoot',
      },
      {
        title: 'Lead magnets & guides',
        desc: 'a useful download that turns visitors into contacts',
      },
      {
        title: 'Landing pages',
        desc: 'a focused page for a campaign, offer or service',
      },
      {
        title: 'Review drives',
        desc: 'a simple system to ask for, gather and respond to reviews',
      },
      {
        title: 'Ad copy & creative',
        desc: 'words and assets for paid campaigns',
      },
      {
        title: 'Print & physical',
        desc: 'flyers, signage, vehicle graphics, business cards',
      },
      {
        title: 'Brand tidy-ups',
        desc: 'sorting out a logo, colours and a consistent look',
      },
      {
        title: 'Profile & content audits',
        desc: 'an honest look at what’s working and what isn’t',
      },
    ],
    howItWorks: [
      {
        title: 'Tell us the goal.',
        desc: 'Don’t worry about what it’s called or which box it fits — just describe what you’re trying to achieve.',
      },
      {
        title: 'We scope it.',
        desc: 'We tell you honestly whether it’s something we do directly, something we arrange, or something you don’t actually need.',
      },
      {
        title: 'We make it happen.',
        desc: 'One point of contact, on-brand throughout, built around your business.',
      },
    ],
    closingLine:
      'There’s no content or marketing task we can’t facilitate. If you’re not sure it’s something we do — ask anyway. The worst case is we point you to someone better.',
    photoNote:
      'If getting the most from your content needs a proper shoot, we can source and arrange it through our network — just mention it when you get in touch.',
    pairsWith: [],
  },
};

export function getService(slug: string): ServiceData | undefined {
  return SERVICES[slug];
}

/** Looping prev/next in the defined footer order. */
export function getAdjacent(slug: string): { prev: ServiceData; next: ServiceData } {
  const i = SERVICE_ORDER.indexOf(slug);
  const prevSlug = SERVICE_ORDER[(i - 1 + SERVICE_ORDER.length) % SERVICE_ORDER.length];
  const nextSlug = SERVICE_ORDER[(i + 1) % SERVICE_ORDER.length];
  return { prev: SERVICES[prevSlug], next: SERVICES[nextSlug] };
}

export const BASE_URL = 'https://torqpoint.com';

/**
 * Per-page metadata. Sets a self-referencing canonical + og:url (the live
 * site otherwise inherits the homepage og:url from the root layout, which
 * the brief asks us to fix here).
 */
export function serviceMetadata(slug: string) {
  const s = SERVICES[slug];
  const url = `${BASE_URL}/services/${s.slug}/`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${s.metaTitle} | Torqpoint`,
      description: s.metaDescription,
      url,
      siteName: 'Torqpoint',
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${s.metaTitle} | Torqpoint`,
      description: s.metaDescription,
    },
  };
}
