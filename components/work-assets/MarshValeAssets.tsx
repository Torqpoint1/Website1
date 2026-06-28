import type { Post } from '@/lib/content';
import { WorkPlaceholder } from '@/components/WorkPlaceholder';
import { assetHas } from './AssetPhoto';
import styles from './MarshValeAssets.module.css';

/* Marsh & Vale Bathrooms — concept brand assets.
   Identity, social post, blog article and email in the brand's own scoped
   palette (slate/teal/copper) and type (Outfit + Jost). Photo slots fill
   from /public/work/marsh-vale-bathrooms. */

const SLUG = 'marsh-vale-bathrooms';

function Photo({ name, label, has, className }: { name: string; label: string; has: boolean; className?: string }) {
  const src = `/work/${SLUG}/${name}.jpg`;
  if (has) return <img src={src} alt="" className={className} loading="lazy" />;
  return (
    <div className={`${styles.slot} ${className ?? ''}`}>
      <WorkPlaceholder label={label} />
    </div>
  );
}

export function MarshValeAssets({ post }: { post: Post }) {
  const ok = (n: string) => assetHas(post, n);

  return (
    <section className={styles.marsh} aria-label="Sample brand assets for Marsh & Vale Bathrooms">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Jost:wght@300;400;500&display=swap"
      />

      <div className={styles.inner}>
        {/* ── 01 Identity ─────────────────────────────── */}
        <p className={styles.kicker}><span>01</span> Identity</p>
        <div className={styles.identity}>
          <Monogram />
          <p className={styles.wordmark}>Marsh &amp; Vale<br /><span className={styles.wordmarkSub}>Bathrooms</span></p>
          <p className={styles.tagline}>Clean lines · Cheltenham</p>
          <ul className={styles.swatches} aria-hidden="true">
            <li><span style={{ background: '#2B3138' }} />Slate</li>
            <li><span style={{ background: '#4C7C78' }} />Teal</li>
            <li><span style={{ background: '#B06F3F' }} />Copper</li>
            <li><span style={{ background: '#C7CBC9' }} />Mist</li>
            <li><span style={{ background: '#EEF1F0', border: '1px solid #DCE0DE' }} />Porcelain</li>
          </ul>
          <div className={styles.typePair}>
            <span className={styles.typeDisplay}>Aa</span>
            <span className={styles.typeLabel}>Outfit — display</span>
          </div>
          <div className={styles.typePair}>
            <span className={styles.typeBody}>AA</span>
            <span className={styles.typeLabel}>Jost — labels &amp; body</span>
          </div>
        </div>

        {/* ── 02 Social post ──────────────────────────── */}
        <p className={styles.kicker}><span>02</span> Social post</p>
        <div className={styles.social}>
          <div className={styles.post}>
            <Photo name="wetroom-wide" label="Finished walk-in wet room" has={ok('wetroom-wide')} className={styles.postPhoto} />
            <div className={styles.postShade} aria-hidden="true" />
            <p className={styles.postQuote}>
              The brief was three words: <span className={styles.copper}>&ldquo;make it bigger.&rdquo;</span>
            </p>
          </div>
          <div className={styles.socialBody}>
            <p className={styles.socialTitle}>The post that makes a researched purchase feel safe.</p>
            <p className={styles.socialText}>
              The room didn&rsquo;t change size. The way it works changed completely. We turned a
              cramped over-bath shower into a walk-in wet room — level-access tray, large-format
              porcelain, underfloor heating.
            </p>
            <p className={styles.socialText}>
              Thinking about yours? Send us a photo and we&rsquo;ll tell you honestly what&rsquo;s possible.
            </p>
            <p className={styles.hashtags}>#bathroomrenovation #wetroom #cheltenham #bathroomdesign</p>
          </div>
        </div>

        {/* ── 03 Blog article ─────────────────────────── */}
        <p className={styles.kicker}><span>03</span> Blog article</p>
        <div className={styles.blog}>
          <div className={styles.browser}>
            <span className={styles.url}>marshandvale.co.uk/journal/five-questions</span>
          </div>
          <Photo name="blog-hero" label="Wet room detail" has={ok('blog-hero')} className={styles.blogHero} />
          <div className={styles.blogBody}>
            <p className={styles.blogKicker}>Bathroom guide</p>
            <h4 className={styles.blogHeadline}>The five questions every customer asks before booking a bathroom.</h4>
            <p className={styles.blogMeta}>Marsh &amp; Vale Bathrooms · 6 min read</p>
            <p className={styles.blogIntro}>
              Most bathroom websites tell you how wonderful they are. This one just answers the
              things people actually ask us — because if you&rsquo;re researching a new bathroom in
              Cheltenham, you deserve straight answers, not sales talk.
            </p>
            <ol className={styles.blogList}>
              <li><span>01</span> How long will I be without a bathroom?</li>
              <li><span>02</span> Can you turn my bath into a walk-in shower or wet room?</li>
              <li><span>03</span> What does a full refit actually cost?</li>
              <li><span>04</span> Do you handle the tiling, electrics and plumbing?</li>
              <li><span>05</span> How far ahead do I need to book?</li>
            </ol>
          </div>
        </div>

        {/* ── 04 Email ────────────────────────────────── */}
        <p className={styles.kicker}><span>04</span> Email</p>
        <div className={styles.email}>
          <p className={styles.emailSubject}>Subject — &ldquo;Make it bigger&rdquo; — without moving a single wall</p>
          <div className={styles.emailHeader}>Marsh &amp; Vale</div>
          <div className={styles.emailBody}>
            <Photo name="email-hero" label="Wet room hero" has={ok('email-hero')} className={styles.emailHero} />
            <h4 className={styles.emailHeadline}>You don&rsquo;t need more space. You need the right layout.</h4>
            <p className={styles.emailText}>Hello —</p>
            <p className={styles.emailText}>
              We just finished a wet room in Cheltenham that proves it — a cramped ensuite that now
              feels twice the size, without a single wall moving. The before-and-after&rsquo;s worth a look.
            </p>
            <p className={styles.emailText}>
              If your bathroom&rsquo;s overdue, reply and we&rsquo;ll book a time to come and measure up.
            </p>
            <span className={styles.emailBtn}>See the before &amp; after →</span>
            <p className={styles.emailFoot}>Marsh &amp; Vale Bathrooms · Cheltenham · Design &amp; installation · Unsubscribe anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Monogram() {
  return (
    <svg className={styles.monogram} viewBox="0 0 40 52" fill="none" aria-hidden="true">
      <path
        d="M20 4C20 4 7 20 7 32a13 13 0 0 0 26 0C33 20 20 4 20 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 34a6 6 0 0 0 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
