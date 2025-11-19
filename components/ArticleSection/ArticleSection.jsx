import { useEffect, useRef } from 'react';
import styles from './ArticleSection.module.css';

export default function ArticleSection({ contentHtml }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tables = containerRef.current.querySelectorAll('table');
    tables.forEach((table) => {
      // Check if already wrapped to prevent double wrapping
      if (table.parentElement.classList.contains(styles.tableWrapper)) return;

      const wrapper = document.createElement('div');
      wrapper.className = styles.tableWrapper;

      // Insert wrapper before table
      table.parentNode.insertBefore(wrapper, table);

      // Move table into wrapper
      wrapper.appendChild(table);
    });
  }, [contentHtml]);

  return (
    <div
      ref={containerRef}
      className={styles.articleBody}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
