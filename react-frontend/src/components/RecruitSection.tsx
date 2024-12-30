import React from 'react';
import styles from './RecruitSection.module.css';

const RecruitSection: React.FC = () => (
  <section className={styles.recruit}>
    <div className={styles.overlay}>
      <h2 className={styles.heading}>RECRUIT</h2>
      <h3 className={styles.subheading}>Recruitment Information</h3>
      <p>Join our team and help us create a better future.</p>
      <button className={styles.ctaButton}>Click here for recruitment details</button>
    </div>
  </section>
);

export default RecruitSection;