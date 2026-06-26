import Link from 'next/link';
import styles from './Logo.module.css';

interface LogoProps {
  dark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ dark = false, size = 'md' }: LogoProps) {
  return (
    <Link href="/" className={`${styles.logo} ${styles[size]} ${dark ? styles.dark : ''}`} aria-label="Torqpoint — home">
      <span className={styles.wordmark}>Torqpoint</span>
      <span className={styles.point} aria-hidden="true" />
    </Link>
  );
}
