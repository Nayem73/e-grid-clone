import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => (
  <section className={styles.hero}>
    <div className={styles.slider}>
      <div className={styles.slide}>
        <div className={styles.overlay}>
          <h1>OUR MISSION</h1>
          <p>WE CONTINUE TO EVOLVE AND SOLVE OUR CUSTOMERS' PROBLEMS THROUGH ITXX, LEADING THEIR BUSINESSES TO SUCCESS AND CREATING A FUTURE FOR OUR CUSTOMERS AND EMPLOYEES.</p>
        </div>
      </div>
      {/* Add more slides as needed */}
    </div>
    <div className={styles.indicators}>
      <span className={styles.active}></span>
      <span></span>
      <span></span>
    </div>
  </section>
);

export default HeroSection;