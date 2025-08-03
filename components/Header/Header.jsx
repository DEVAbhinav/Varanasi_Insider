import Image from 'next/image';
import styles from './Header.module.css';

export default function Header({ title, featuredImage }) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      {featuredImage && (
        <Image
          src={featuredImage}
          alt={title}
          className={styles.heroImage}
          fetchpriority="high"
          width={1591}
          height={1120}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  );
}
