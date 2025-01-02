import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Carousel.module.css';
import { useLanguage } from '../contexts/LanguageContext';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/carousel_images')
      .then((response) => setCarouselImages(response.data))
      .catch((error) => console.error('Error fetching carousel images:', error));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/carousel_translations?locale=${language}`)
      .then((response) => setTranslation(response.data))
      .catch((error) => console.error('Error fetching carousel translation:', error));
  }, [language]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? carouselImages.length - 1 : prevSlide - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className={styles.carouselSection}>
      <div
        className={styles.carousel}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselImages.map((image) => (
          <div key={image.id} className={styles.carouselItem}>
            <img src={image.image_url} alt={`Slide ${image.id}`} />
          </div>
        ))}
      </div>

      <div className={styles.textContent}>
        <h1>OUR MISSION</h1>
        <p>{translation?.description || '進化し続け\nIT×Xによりお客様の課題を解決し、\nビジネスを成功に導くことでお客様と社員の未来を創る'}</p>
      </div>

      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide}>
        <ChevronLeft size={48} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextSlide}>
        <ChevronRight size={48} />
      </button>

      <div className={styles.dotsContainer}>
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;