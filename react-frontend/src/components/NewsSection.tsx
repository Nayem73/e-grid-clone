import React from 'react';
import styles from './NewsSection.module.css';

const NewsSection: React.FC = () => (
  <section className={styles.news}>
    <div className={styles.container}>
      <h2 className={styles.heading}>NEWS</h2>
      <div className={styles.underline}></div>
      <div className={styles.newsList}>
        <div className={styles.newsItem}>
          <img src="/path/to/news1.jpg" alt="News 1" />
          <div className={styles.newsContent}>
            <span className={styles.date}>2024.01.01</span>
            <span className={styles.category}>Notice</span>
            <h3>News Title 1</h3>
            <p>Brief description of news item 1.</p>
          </div>
        </div>
        <div className={styles.newsItem}>
          <img src="/path/to/news2.jpg" alt="News 2" />
          <div className={styles.newsContent}>
            <span className={styles.date}>2024.01.02</span>
            <span className={styles.category}>Press Release</span>
            <h3>News Title 2</h3>
            <p>Brief description of news item 2.</p>
          </div>
        </div>
        <div className={styles.newsItem}>
          <img src="/path/to/news3.jpg" alt="News 3" />
          <div className={styles.newsContent}>
            <span className={styles.date}>2024.01.03</span>
            <span className={styles.category}>Notice</span>
            <h3>News Title 3</h3>
            <p>Brief description of news item 3.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default NewsSection;