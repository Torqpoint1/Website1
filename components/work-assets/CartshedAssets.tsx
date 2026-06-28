import type { Post } from '@/lib/content';
import { AssetPhoto } from './AssetPhoto';
import styles from './CartshedAssets.module.css';

const SLUG = 'the-old-cartshed';

export function CartshedAssets({ post }: { post: Post }) {
  const Photo = (p: { name: string; label: string; className?: string }) => (
    <AssetPhoto post={post} slug={SLUG} {...p} />
  );

  return (
    <section className={styles.cart} aria-label="Sample brand assets for The Old Cartshed">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap"
      />
      <div className={styles.inner}>
        {/* 01 Identity */}
        <p className={styles.kicker}><span>01</span> Identity</p>
        <div className={styles.identity}>
          <Monogram />
          <p className={styles.wordmark}>The Old<br />Cartshed</p>
          <p className={styles.tagline}>Stay · The Cotswolds</p>
          <ul className={styles.swatches} aria-hidden="true">
            <li><span style={{ background: '#221C18' }} />Ink</li>
            <li><span style={{ background: '#B5552B' }} />Ember</li>
            <li><span style={{ background: '#5E6249' }} />Moss</li>
            <li><span style={{ background: '#B7AC9A' }} />Stone</li>
            <li><span style={{ background: '#F0E8D9', border: '1px solid #E2D8C5' }} />Oat</li>
          </ul>
          <div className={styles.typePair}>
            <span className={styles.typeDisplay}>Aa</span>
            <span className={styles.typeLabel}>Spectral — display</span>
          </div>
          <div className={styles.typePair}>
            <span className={styles.typeBody}>Aa</span>
            <span className={styles.typeLabel}>Jost — labels &amp; body</span>
          </div>
        </div>

        {/* 02 Social post */}
        <p className={styles.kicker}><span>02</span> Social post</p>
        <div className={styles.social}>
          <div className={styles.post}>
            <Photo name="interior-dusk" label="Interior — wood-burner at dusk" className={styles.postPhoto} />
            <span className={styles.postTag}>Autumn dates open</span>
            <p className={styles.postQuote}>
              6pm, the wood-burner lit, the valley going gold through the window.
            </p>
          </div>
          <div className={styles.socialBody}>
            <p className={styles.socialTitle}>The caption that sells the feeling, not the floor plan.</p>
            <p className={styles.socialText}>
              The bit the listing photos never capture: not another sound for miles. A few autumn
              dates have just opened up — book direct through the link in our bio. Same barn, better
              value than the booking sites.
            </p>
            <p className={styles.hashtags}>#cotswolds #holidaycottage #stowonthewold #directbooking</p>
          </div>
        </div>

        {/* 03 Guest newsletter */}
        <p className={styles.kicker}><span>03</span> Guest newsletter</p>
        <div className={styles.email}>
          <p className={styles.emailSubject}>Subject — Your table by the wood-burner is still here</p>
          <div className={styles.emailBody}>
            <p className={styles.emailBrand}>The Old Cartshed</p>
            <Photo name="email-hero" label="Barn exterior at golden hour" className={styles.emailHero} />
            <h4 className={styles.emailHeadline}>Autumn is quietly the Cartshed&rsquo;s best season.</h4>
            <p className={styles.emailText}>Hello again —</p>
            <p className={styles.emailText}>
              It&rsquo;s been a year since you stayed. Misty mornings, log fires, the Cotswolds at
              their emptiest — it&rsquo;s our favourite time here, and we saved you first refusal on
              the autumn dates.
            </p>
            <p className={styles.emailText}>
              Booked direct, of course: no platform fees, better rate. Just reply and we&rsquo;ll
              hold one for you.
            </p>
            <span className={styles.emailBtn}>Hold my dates →</span>
            <p className={styles.emailFoot}>The Old Cartshed · near Stow-on-the-Wold · Direct bookings only · Unsubscribe anytime</p>
          </div>
        </div>

        {/* 04 Google Business post */}
        <p className={styles.kicker}><span>04</span> Google Business post</p>
        <div className={styles.gbp}>
          <div className={styles.gbpHead}>
            <div className={styles.gbpAvatar}><Monogram /></div>
            <div>
              <p className={styles.gbpName}>The Old Cartshed</p>
              <p className={styles.gbpCat}>Holiday home · Stow-on-the-Wold</p>
            </div>
          </div>
          <Photo name="gbp-photo" label="Interior with countryside view" className={styles.gbpPhoto} />
          <p className={styles.gbpText}>
            Autumn dates now open. Log fires, copper bath, the valley to yourselves. Book direct for
            the best rate — no booking-site fees.
          </p>
          <div className={styles.gbpBtns}>
            <span className={styles.gbpBtnPrimary}>Book</span>
            <span className={styles.gbpBtn}>Call</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Monogram() {
  return (
    <svg className={styles.monogram} viewBox="0 0 56 52" fill="none" aria-hidden="true">
      <path d="M8 24 28 8l20 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 22v24h30V22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 46V32h10v14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
