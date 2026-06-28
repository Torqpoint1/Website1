import styles from './PageDecor.module.css';

/* One continuous layer of barely-there forge squares behind the whole
   page. Because it spans the full document (not each section), the
   ambient texture never gets clipped at the seam where two adjacent
   white sections meet — the squares simply drift on past the join. */
export function PageDecor() {
  return (
    <div className={styles.decor} aria-hidden="true">
      <span className={styles.s1} />
      <span className={styles.s2} />
      <span className={styles.s3} />
      <span className={styles.s4} />
      <span className={styles.s5} />
      <span className={styles.s6} />
      <span className={styles.s7} />
      <span className={styles.s8} />
      <span className={styles.s9} />
      <span className={styles.s10} />
    </div>
  );
}
