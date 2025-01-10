import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './NewsSection.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import EditableField from '../components/EditableField';
import AddNewsForm from './AddNewsForm';
import { X } from 'lucide-react';

interface NewsTranslation {
  id: number;
  news_id: number;
  locale: string;
  title: string;
  description: string;
  image_url: string;
}

interface News {
  id: number;
  slug: string;
  news_translations: NewsTranslation[];
  created_at: string;
}

interface NewsEdit {
  news_id: number;
  slug: string;
  enTranslation: NewsTranslation;
  jpTranslation: NewsTranslation;
  activeLocale: string;
}

interface NewsSectionProps {
  limit?: number;
  showReadMore?: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({
  limit,
  showReadMore = true
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsEdit | null>(null);
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isAddingNews, setIsAddingNews] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [language]);

  const fetchNews = async () => {
    try {
      const response = await axios.get('/news');
      const sortedNews = response.data.sort((a: News, b: News) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const limitedNews = limit ? sortedNews.slice(0, limit) : sortedNews;
      setNews(limitedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleNewsEdit = async (newsItem: News): Promise<void> => {
    const enTranslation = newsItem.news_translations.find(t => t.locale === 'en')!;
    const jpTranslation = newsItem.news_translations.find(t => t.locale === 'jp')!;

    setEditingNews({
      news_id: newsItem.id,
      slug: newsItem.slug,
      enTranslation,
      jpTranslation,
      activeLocale: language
    });
    setIsEditing(true);
  };

  const handleSave = async (values: { title: string; description: string; image_url: string; slug: string }) => {
    if (!editingNews) return;

    const updatedNews = {
      news: {
        slug: values.slug,
        news_translations_attributes: [
          {
            id: editingNews.enTranslation.id,
            locale: 'en',
            title: language === 'en' ? values.title : editingNews.enTranslation.title,
            description: language === 'en' ? values.description : editingNews.enTranslation.description,
            image_url: values.image_url
          },
          {
            id: editingNews.jpTranslation.id,
            locale: 'jp',
            title: language === 'jp' ? values.title : editingNews.jpTranslation.title,
            description: language === 'jp' ? values.description : editingNews.jpTranslation.description,
            image_url: values.image_url
          }
        ]
      }
    };

    try {
      await axios.put(`/news/${editingNews.news_id}`, updatedNews);
      setIsEditing(false);
      setEditingNews(null);
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  return (
    <section className={styles.news}>
      <div className={styles.container}>
        <h2 className={styles.heading}>NEWS</h2>
        <div className={styles.underline}></div>
        <h3 className={styles.subheading}>
          {language === 'en' ? "what's new" : language === 'jp' ? '新着情報' : "what's new"}
        </h3>
        {user && (
          <button
            onClick={() => setIsAddingNews(true)}
            className={styles.addNewsButton}
          >
            Add News
          </button>
        )}
        <div className={styles.content}>
          {news.map((newsItem) => {
            const translation = newsItem.news_translations.find(t => t.locale === language);
            if (!translation) return null;

            return (
              <div key={newsItem.id} className={`${styles.newsCard} ${user ? styles.isAdmin : ''}`}>
                <a
                  href={newsItem.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.imageContainer}
                >
                  <img src={translation.image_url} alt={translation.title} className={styles.newsImage} />
                </a>
                <div className={styles.textContent}>
                  <div className={styles.dateCategory}>
                    <a
                      href={newsItem.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.date}
                    >
                      {formatDate(newsItem.created_at)}
                    </a>
                    <a
                      href={newsItem.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.category}
                    >
                      {language === 'en' ? 'notice' : 'お知らせ'}
                    </a>
                  </div>
                  <EditableField
                    value={translation.title}
                    fieldName="Title"
                    isAdmin={!!user}
                    onEdit={() => handleNewsEdit(newsItem)}
                    className={styles.title}
                  />
                  <EditableField
                    value={translation.description}
                    fieldName="Description"
                    isAdmin={!!user}
                    onEdit={() => handleNewsEdit(newsItem)}
                    className={`${styles.description} ${styles.preserveWhitespace}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <AddNewsForm
          isOpen={isAddingNews}
          onClose={() => setIsAddingNews(false)}
          onSuccess={fetchNews}
        />
        {showReadMore && (
          <div className={styles.readMoreWrapper}>
            <a href="/news" className={styles.readMore}>
              READ MORE
            </a>
          </div>
        )}
      </div>

      {isEditing && editingNews && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit News</h2>
              <button onClick={() => {
                setIsEditing(false);
                setEditingNews(null);
              }} className={styles.closeButton}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <textarea
                  value={editingNews.activeLocale === 'en' ?
                    editingNews.enTranslation.title :
                    editingNews.jpTranslation.title}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    [editingNews.activeLocale === 'en' ? 'enTranslation' : 'jpTranslation']: {
                      ...(editingNews.activeLocale === 'en' ? editingNews.enTranslation : editingNews.jpTranslation),
                      title: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={editingNews.activeLocale === 'en' ?
                    editingNews.enTranslation.description :
                    editingNews.jpTranslation.description}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    [editingNews.activeLocale === 'en' ? 'enTranslation' : 'jpTranslation']: {
                      ...(editingNews.activeLocale === 'en' ? editingNews.enTranslation : editingNews.jpTranslation),
                      description: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image URL</label>
                <textarea
                  value={editingNews.enTranslation.image_url}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    enTranslation: { ...editingNews.enTranslation, image_url: e.target.value },
                    jpTranslation: { ...editingNews.jpTranslation, image_url: e.target.value }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Slug</label>
                <textarea
                  value={editingNews.slug}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    slug: e.target.value
                  })}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => handleSave({
                  title: editingNews.activeLocale === 'en' ?
                    editingNews.enTranslation.title :
                    editingNews.jpTranslation.title,
                  description: editingNews.activeLocale === 'en' ?
                    editingNews.enTranslation.description :
                    editingNews.jpTranslation.description,
                  image_url: editingNews.enTranslation.image_url,
                  slug: editingNews.slug
                })}
                className={styles.saveButton}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingNews(null);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;