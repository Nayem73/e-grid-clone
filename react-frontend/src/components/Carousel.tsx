import React, { useEffect, useRef, useState } from 'react';
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

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const transitionDuration = 1000; // Match CSS transition duration (ms)

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
    if (carouselImages.length > 0) {
      if (currentSlide === carouselImages.length - 1) {
        // Temporarily disable the transition for instant reset
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none';
        }
        setCurrentSlide(0);

        // Re-enable the transition after resetting to the first slide
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = `transform ${transitionDuration}ms ease-out`;
          }
        }, 20); // Delay slightly to allow DOM changes to apply
      } else {
        setCurrentSlide((prevSlide) => prevSlide + 1);
      }
    }
  };

  const prevSlide = () => {
    if (carouselImages.length > 0) {
      setCurrentSlide((prevSlide) =>
        prevSlide === 0 ? carouselImages.length - 1 : prevSlide - 1
      );
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [carouselImages, currentSlide]);

  return (
    <div className={styles.carouselSection}>
      {carouselImages.map((image, index) => (
        <div
          key={image.id}
          className={`${styles.carouselItem} ${index === currentSlide ? styles.active : styles.inactive
            }`}
        >
          <img src={image.image_url} alt={`Slide ${image.id}`} />
        </div>
      ))}

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
    </div>
  );
};

export default Carousel;
