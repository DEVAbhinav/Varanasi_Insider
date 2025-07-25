import styles from './Header.module.css';

export default function Header({ title, featuredImage }) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>THis is dummy titile</h1>
      </div>
      {featuredImage && (
        <img
          src={featuredImage}
          alt={title}
          className={styles.heroImage}
          fetchpriority="high"
        />
      )}
    </div>
  );
}
