import styles from './Marquee.module.css';

const items = [
  'Social posts',
  'Case studies',
  'Email & newsletters',
  'Blog articles',
  'Google Business posts',
  'Website design & build',
  'Profiles & setup',
];

export function Marquee() {
  // Duplicated once so the -50% translate loops seamlessly
  const sequence = [...items, ...items];

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className="marquee">
        <div className="marquee__track">
          {sequence.map((item, i) => (
            <span key={i} className="marquee__item">
              {item}
              <span className="point point--md" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
