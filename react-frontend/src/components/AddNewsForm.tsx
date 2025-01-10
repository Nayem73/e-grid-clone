import React, { useState } from 'react';
import axios from '../api/axios';
import styles from './NewsSection.module.css';
import { X } from 'lucide-react';

interface NewsTranslationForm {
  locale: string;
  title: string;
  description: string;
}

interface AddNewsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddNewsForm: React.FC<AddNewsFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeLocale, setActiveLocale] = useState<'en' | 'jp'>('en');
  const [imageUrl, setImageUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [translations, setTranslations] = useState<{
    en: NewsTranslationForm;
    jp: NewsTranslationForm;
  }>({
    en: { locale: 'en', title: '', description: '' },
    jp: { locale: 'jp', title: '', description: '' }
  });

  const handleSubmit = async () => {
    const newsData = {
      news: {
        slug,
        news_translations_attributes: [
          {
            locale: 'en',
            title: translations.en.title,
            description: translations.en.description,
            image_url: imageUrl
          },
          {
            locale: 'jp',
            title: translations.jp.title,
            description: translations.jp.description,
            image_url: imageUrl
          }
        ]
      }
    };

    try {
      await axios.post('/news', newsData);
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating news:', error);
    }
  };

  const resetForm = () => {
    setImageUrl('');
    setSlug('');
    setTranslations({
      en: { locale: 'en', title: '', description: '' },
      jp: { locale: 'jp', title: '', description: '' }
    });
    setActiveLocale('en');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Add News</h2>
          <div className={styles.languageToggle}>
            <button
              className={`${styles.langButton} ${activeLocale === 'jp' ? styles.active : ''}`}
              onClick={() => setActiveLocale('jp')}
            >
              JP
            </button>
            <button
              className={`${styles.langButton} ${activeLocale === 'en' ? styles.active : ''}`}
              onClick={() => setActiveLocale('en')}
            >
              EN
            </button>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Title ({activeLocale.toUpperCase()})</label>
            <textarea
              value={translations[activeLocale].title}
              onChange={(e) => setTranslations({
                ...translations,
                [activeLocale]: {
                  ...translations[activeLocale],
                  title: e.target.value
                }
              })}
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description ({activeLocale.toUpperCase()})</label>
            <textarea
              value={translations[activeLocale].description}
              onChange={(e) => setTranslations({
                ...translations,
                [activeLocale]: {
                  ...translations[activeLocale],
                  description: e.target.value
                }
              })}
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Image URL</label>
            <textarea
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Slug</label>
            <textarea
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button
            onClick={handleSubmit}
            className={styles.saveButton}
            disabled={
              !translations.en.title || !translations.en.description ||
              !translations.jp.title || !translations.jp.description ||
              !imageUrl || !slug
            }
          >
            Add News
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewsForm;