import React from 'react';
import styles from './ServiceSection.module.css';

const ServiceSection: React.FC = () => (
  <section className={styles.services}>
    <div className={styles.container}>
      <h2 className={styles.heading}>SERVICE</h2>
      <h3 className={styles.subheading}>service</h3>
      <div className={styles.underline}></div>
      <div className={styles.content}>
        <div className={styles.text}>
          <h4>Our Services</h4>
          <p>We offer a range of services to meet your needs.</p>
          <button className={styles.readMore}>READ MORE</button>
        </div>
        <div className={styles.images}>
          <img src="/path/to/image1.jpg" alt="Service 1" />
          <img src="/path/to/image2.jpg" alt="Service 2" />
        </div>
      </div>
    </div>
  </section>
);

export default ServiceSection;