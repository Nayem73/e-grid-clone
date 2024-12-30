import React from 'react';
import styles from './ProductsSection.module.css';

const ProductsSection: React.FC = () => (
  <section className={styles.products}>
    <div className={styles.container}>
      <h2 className={styles.heading}>PRODUCTS</h2>
      <div className={styles.underline}></div>
      <div className={styles.productList}>
        <div className={styles.productItem}>
          <img src="/path/to/diagate.jpg" alt="Dia-Gate" />
          <h3>Dia-Gate</h3>
          <p>Blood sugar management</p>
        </div>
        <div className={styles.productItem}>
          <img src="/path/to/grloco.jpg" alt="GRLOCO" />
          <h3>GRLOCO</h3>
          <p>Location information service</p>
        </div>
        <div className={styles.productItem}>
          <img src="/path/to/pharmaco-picos.jpg" alt="Pharmaco-PICOS" />
          <h3>Pharmaco-PICOS</h3>
          <p>Simulation service</p>
        </div>
      </div>
    </div>
  </section>
);

export default ProductsSection;