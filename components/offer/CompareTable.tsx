import { ScrollReveal } from '@/components/ScrollReveal';
import styles from './CompareTable.module.css';

type Mark = 'yes' | 'no' | null;

const ROWS: { label: string; them: string; us: string; themMark?: Mark; usMark?: Mark }[] = [
  { label: 'Typical annual cost', them: '£1,200–£2,000+', us: '£5,400 (£450 a month)' },
  { label: 'Who else sees the enquiry', them: 'Several competing firms', us: 'Only you', themMark: 'no', usMark: 'yes' },
  { label: 'You own the profile', them: 'No', us: 'Yes', themMark: 'no', usMark: 'yes' },
  { label: 'Pay whether you win or not', them: 'Yes', us: 'No — nothing per lead', themMark: 'no', usMark: 'yes' },
  { label: 'What you keep if you stop', them: 'Nothing', us: 'Every case study, photo and page', themMark: 'no', usMark: 'yes' },
];

function Icon({ mark }: { mark?: Mark }) {
  if (!mark) return null;
  return mark === 'yes' ? (
    <svg viewBox="0 0 16 16" className={`${styles.icon} ${styles.iconYes}`} aria-hidden="true">
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className={`${styles.icon} ${styles.iconNo}`} aria-hidden="true">
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Directory platforms vs Engine — the pricing page's real job. */
export function CompareTable() {
  return (
    <div className={styles.wrap} role="table" aria-label="Directory platforms compared with Torqpoint Engine">
      <div className={styles.headRow} role="row">
        <div role="columnheader" className={styles.corner}><span className={styles.srOnly}>Compared on</span></div>
        <div role="columnheader" className={styles.themHead}>Directory platforms</div>
        <div role="columnheader" className={styles.usHead}>
          <span className="point point--sm" aria-hidden="true" />
          Torqpoint Engine
        </div>
      </div>
      <ScrollReveal className={styles.body} stagger staggerStep={0.09}>
        {ROWS.map(r => (
          <div key={r.label} className={styles.row} role="row">
            <div className={styles.label} role="rowheader">{r.label}</div>
            <div className={styles.them} role="cell">
              <span className={styles.mobileHead}>Directories</span>
              <span className={styles.value}><Icon mark={r.themMark} />{r.them}</span>
            </div>
            <div className={styles.us} role="cell">
              <span className={styles.mobileHead}>Engine</span>
              <span className={styles.value}><Icon mark={r.usMark} />{r.us}</span>
            </div>
          </div>
        ))}
      </ScrollReveal>
    </div>
  );
}
