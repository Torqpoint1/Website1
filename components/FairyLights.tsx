import { FESTIVE } from '@/lib/festive';
import styles from './FairyLights.module.css';

const COUNT = 20;

/** A subtle string of warm fairy lights strung under the header — visible on
 *  light and dark sections alike. Static markup; gated by the FESTIVE flag. */
export function FairyLights() {
  if (!FESTIVE) return null;
  return (
    <div className={styles.lights} aria-hidden="true">
      {Array.from({ length: COUNT }).map((_, i) => (
        <span key={i} className={styles.bulb} style={{ ['--i' as string]: i }} />
      ))}
    </div>
  );
}
