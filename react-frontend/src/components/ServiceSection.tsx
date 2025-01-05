import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ServiceSection.module.css';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceTranslation {
  locale: string;
  title: string;
  description: string;
  image_url: string;
}

interface Service {
  id: number;
  slug: string;
  service_translations: ServiceTranslation[];
}

const ServiceSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const { language } = useLanguage();

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
        <div className={styles.underline}></div>
        <h3 className={styles.subheading}>service</h3>
        <div className={styles.content}>
          {services.map((service, index) => {
            const translation = service.service_translations.find(t => t.locale === language);
            if (!translation) return null;

            return (
              <div
                key={service.id}
                className={`${styles.serviceItem} ${index % 2 === 0 ? styles.left : styles.right}`}
              >
                <div className={styles.text}>
                  <h4>{translation.title}</h4>
                  <p>{translation.description}</p>
                  <a href={service.slug} className={styles.readMore}>READ MORE</a>
                </div>
                <div className={styles.image}>
                  <img src={translation.image_url} alt={translation.title} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
