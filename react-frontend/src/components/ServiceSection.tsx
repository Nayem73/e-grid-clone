import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ServiceSection.module.css';

interface Service {
  id: number;
  title: string;
  description: string;
  image_url: string;
  slug: string;
}

const ServiceSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the services!', error);
      });
  }, []);

  return (
    <section className={styles.services}>
      <div className={styles.container}>
        <h2 className={styles.heading}>SERVICE</h2>
        <h3 className={styles.subheading}>service</h3>
        <div className={styles.underline}></div>
        <div className={styles.content}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`${styles.serviceItem} ${index % 2 === 0 ? styles.left : styles.right}`}>
              <div className={styles.text}>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <a href={service.slug} className={styles.readMore}>READ MORE</a>
              </div>
              <div className={styles.image}>
                <img src={service.image_url} alt={service.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
