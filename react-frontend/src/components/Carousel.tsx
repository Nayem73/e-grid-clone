import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './Carousel.module.css';

interface CarouselImage {
  id: number;
  image_url: string;
}

interface CarouselTranslation {
  id: number;
  locale: string;
  title: string;
  description: string;
}

const Carousel: React.FC = () => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [translation, setTranslation] = useState<CarouselTranslation | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Fetch carousel images
    axios.get('http://localhost:3000/api/carousel_images')
      .then(response => {
        setCarouselImages(response.data);
      })
      .catch(error => {
        console.error('Error fetching carousel images:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch translation based on selected language
    axios.get(`http://localhost:3000/api/carousel_translations?locale=${language}`)
      .then(response => {
        setTranslation(response.data);
      })
      .catch(error => {
        console.error('Error fetching carousel translation:', error);
      });
  }, [language]);

  return (
    <section className={styles.carouselSection}>
      <div className={styles.textContent}>
        <h1>{translation?.title || 'Loading...'}</h1>
        <p>{translation?.description || 'Loading description...'}</p>
      </div>
      <div className={styles.carousel}>
        {carouselImages.map(image => (
          <div key={image.id} className={styles.carouselItem}>
            <img src={image.image_url} alt={`Carousel ${image.id}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
