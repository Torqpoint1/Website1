import styles from './WorkPlaceholder.module.css';

interface Props {
  label?: string;
}

/* Branded placeholder used until real project photography is sourced.
   A graphite block with the Torqpoint mark. */
export function WorkPlaceholder({ label }: Props) {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <span className={styles.mark}>
        Tp<span className={styles.dot} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
