// components/ServicePage/ServiceContent.jsx
import styles from './ServiceContent.module.css';

export default function ServiceContent({ contentHtml }) {
  return (
    <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
      <article 
        className={styles.serviceArticle}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </section>
  );
}
