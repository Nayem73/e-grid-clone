import React, { useEffect, useRef, useState } from 'react';
import axios from '../api/axios';
import { ChevronLeft, ChevronRight, Edit2, X } from 'lucide-react';
import styles from './Carousel.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface CarouselImage {
  id: number;
  image_url: string;
}

interface CarouselTranslation {
  id?: number;
  locale: string;
  title: string;
  description: string;
}

const Carousel: React.FC = () => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [translation, setTranslation] = useState<CarouselTranslation | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<CarouselTranslation | null>(null);
  const { language } = useLanguage();
  const { user } = useAuth();

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const transitionDuration = 1000;

  useEffect(() => {
    axios
      .get('/carousel_images')
      .then((response) => setCarouselImages(response.data))
      .catch((error) => console.error('Error fetching carousel images:', error));
  }, []);

  useEffect(() => {
    axios
      .get(`/carousel_translations?locale=${language}`)
      .then((response) => setTranslation(response.data))
      .catch((error) => console.error('Error fetching carousel translation:', error));
  }, [language]);

  const nextSlide = () => {
    if (carouselImages.length > 0) {
      if (currentSlide === carouselImages.length - 1) {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none';
        }
        setCurrentSlide(0);

        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = `transform ${transitionDuration}ms ease-out`;
          }
        }, 20);
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

    return () => clearInterval(interval);
  }, [carouselImages, currentSlide]);

  const handleImageEdit = (image: CarouselImage) => {
    setEditingImage(image);
    setIsEditing(true);
  };

  const handleTranslationEdit = () => {
    if (translation) {
      setEditingTranslation(translation);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      if (editingImage) {
        await axios.put(`/carousel_images/${editingImage.id}`, {
          carousel_image: { image_url: editingImage.image_url }
        });

        const response = await axios.get('/carousel_images');
        setCarouselImages(response.data);
      }

      if (editingTranslation) {
        await axios.put(`/carousel_translations/${editingTranslation.id}`, {
          carousel_translation: {
            locale: editingTranslation.locale,
            title: editingTranslation.title,
            description: editingTranslation.description
          }
        });

        const translationResponse = await axios.get(`/carousel_translations?locale=${language}`);
        setTranslation(translationResponse.data);
      }

      setIsEditing(false);
      setEditingImage(null);
      setEditingTranslation(null);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <div className={styles.carouselSection} ref={carouselRef}>
      <div className={styles.carouselContainer}>
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`${styles.carouselItem} ${index === currentSlide ? styles.active : styles.inactive}`}
          >
            <img src={image.image_url} alt={`Slide ${image.id}`} />
          </div>
        ))}

        {user && (
          <div className={styles.editImageButtonContainer}>
            <button
              className={styles.editImageButton}
              onClick={() => handleImageEdit(carouselImages[currentSlide])}
            >
              <Edit2 size={16} />
              <span>Edit Image</span>
            </button>
          </div>
        )}
      </div>

      <div className={styles.textContent}>
        {user && (
          <button
            className={styles.editTextButton}
            onClick={handleTranslationEdit}
          >
            <Edit2 size={16} />
            <span>Edit Text</span>
          </button>
        )}
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

      {isEditing && (editingImage || editingTranslation) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit {editingImage ? 'Image' : 'Translation'}</h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingImage(null);
                  setEditingTranslation(null);
                }}
                className={styles.closeButton}
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {editingImage && (
                <div className={styles.formGroup}>
                  <label>Image URL</label>
                  <textarea
                    value={editingImage.image_url}
                    onChange={(e) => setEditingImage({
                      ...editingImage,
                      image_url: e.target.value
                    })}
                    className={styles.textarea}
                  />
                </div>
              )}
              {editingTranslation && (
                <>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <textarea
                      value={editingTranslation.title}
                      onChange={(e) => setEditingTranslation({
                        ...editingTranslation,
                        title: e.target.value
                      })}
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      value={editingTranslation.description}
                      onChange={(e) => setEditingTranslation({
                        ...editingTranslation,
                        description: e.target.value
                      })}
                      className={styles.textarea}
                    />
                  </div>
                </>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={handleSave}
                className={styles.saveButton}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingImage(null);
                  setEditingTranslation(null);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;