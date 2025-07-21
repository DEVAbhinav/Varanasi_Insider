import styles from './ArticleSection.module.css';

export default function ArticleSection({ contentHtml }) {
  return (
    <div
      className={styles.articleBody}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
