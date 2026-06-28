import type { Post } from '@/lib/content';
import { AssetPhoto } from './AssetPhoto';
import styles from './FieldhouseAssets.module.css';

const SLUG = 'fieldhouse-landscapes';

export function FieldhouseAssets({ post }: { post: Post }) {
  const Photo = (p: { name: string; label: string; className?: string }) => (
    <AssetPhoto post={post} slug={SLUG} {...p} />
  );

  return (
    <section className={styles.field} aria-label="Sample brand assets for Fieldhouse Landscapes">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Jost:wght@300;400;500&display=swap"
      />
      <div className={styles.inner}>
        {/* 01 Identity */}
        <p className={styles.kicker}><span>01</span> Identity</p>
        <div className={styles.identity}>
          <Monogram />
          <p className={styles.wordmark}>Fieldhouse<br />Landscapes</p>
          <p className={styles.tagline}>Gardens · Cirencester</p>
          <ul className={styles.swatches} aria-hidden="true">
            <li><span style={{ background: '#2E3D2E' }} />Pine</li>
            <li><span style={{ background: '#6F8A55' }} />Leaf</li>
            <li><span style={{ background: '#B06A45' }} />Clay</li>
            <li><span style={{ background: '#C8BFB0' }} />Stone</li>
            <li><span style={{ background: '#F3F0E8', border: '1px solid #E5E0D4' }} />Chalk</li>
          </ul>
          <div className={styles.typePair}>
            <span className={styles.typeDisplay}>Aa</span>
            <span className={styles.typeLabel}>Newsreader — display</span>
          </div>
          <div className={styles.typePair}>
            <span className={styles.typeBody}>Aa</span>
            <span className={styles.typeLabel}>Jost — labels &amp; body</span>
          </div>
        </div>

        {/* 02 Before / after social */}
        <p className={styles.kicker}><span>02</span> Before / after social</p>
        <div className={styles.social}>
          <div className={styles.beforeAfter}>
            <div className={styles.baItem}>
              <span className={styles.baTag}>Before</span>
              <Photo name="before" label="Overgrown garden" className={styles.baPhoto} />
            </div>
            <span className={styles.baArrow} aria-hidden="true">→</span>
            <div className={styles.baItem}>
              <span className={styles.baTag}>After</span>
              <Photo name="after" label="Finished garden" className={styles.baPhoto} />
            </div>
          </div>
          <div className={styles.socialBody}>
            <p className={styles.socialTitle}>The post that does a landscaper&rsquo;s selling for them.</p>
            <p className={styles.socialText}>
              Swipe for the same garden, five weeks apart. Waist-high weeds and a slope nobody
              could stand on → a sandstone terrace, two dry-stone beds and a border that looks
              good in every season.
            </p>
            <p className={styles.socialText}>
              This is what&rsquo;s hiding under most &ldquo;we&rsquo;ll never sort that out&rdquo;
              gardens. Thinking about yours? Drop us a message — we&rsquo;ll tell you honestly
              what&rsquo;s possible.
            </p>
            <p className={styles.hashtags}>#cotswoldgarden #landscaping #beforeandafter #cirencester</p>
          </div>
        </div>

        {/* 03 Newsletter */}
        <p className={styles.kicker}><span>03</span> Newsletter</p>
        <div className={styles.email}>
          <p className={styles.emailSubject}>Subject — The garden that was taller than its own gate</p>
          <div className={styles.emailBody}>
            <p className={styles.emailBrand}>Fieldhouse Landscapes</p>
            <div className={styles.emailBa}>
              <div className={styles.baItem}>
                <span className={styles.baTag}>Before</span>
                <Photo name="before" label="Overgrown" className={styles.emailBaPhoto} />
              </div>
              <div className={styles.baItem}>
                <span className={styles.baTag}>After</span>
                <Photo name="after" label="Finished" className={styles.emailBaPhoto} />
              </div>
            </div>
            <h4 className={styles.emailHeadline}>A genuine jungle, five weeks later.</h4>
            <p className={styles.emailText}>Morning —</p>
            <p className={styles.emailText}>
              We finished a walled garden near Cirencester last month that started as a proper
              jungle — weeds taller than the gate. It&rsquo;s the kind of before-and-after that
              reminds us why we do this, so we wrote it up.
            </p>
            <p className={styles.emailText}>
              Spring&rsquo;s the right time to plan summer gardens. If yours needs a rethink, reply
              and we&rsquo;ll come and take a look. No hard sell, just an honest opinion.
            </p>
            <span className={styles.emailBtn}>See the transformation →</span>
            <p className={styles.emailFoot}>Fieldhouse Landscapes · Cirencester · Garden design &amp; build · Unsubscribe anytime</p>
          </div>
        </div>

        {/* 04 Google Business post */}
        <p className={styles.kicker}><span>04</span> Google Business post</p>
        <div className={styles.gbp}>
          <div className={styles.gbpHead}>
            <div className={styles.gbpAvatar}><Monogram /></div>
            <div>
              <p className={styles.gbpName}>Fieldhouse Landscapes</p>
              <p className={styles.gbpCat}>Landscaper · Cirencester</p>
            </div>
          </div>
          <Photo name="gbp-photo" label="Freshly landscaped garden" className={styles.gbpPhoto} />
          <p className={styles.gbpText}>
            Spring books up fast. Patios, planting and full garden redesigns across the Cotswolds.
            Send a photo of your space and we&rsquo;ll tell you what&rsquo;s possible.
          </p>
          <div className={styles.gbpBtns}>
            <span className={styles.gbpBtnPrimary}>Get a quote</span>
            <span className={styles.gbpBtn}>Call</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Monogram() {
  return (
    <svg className={styles.monogram} viewBox="0 0 48 56" fill="none" aria-hidden="true">
      <path d="M24 54V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 30c-8 0-13-4-14-12 8 0 13 4 14 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 24c8 0 13-4 14-12-8 0-13 4-14 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
