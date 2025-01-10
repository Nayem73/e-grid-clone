import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './PressSection.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import EditableField from '../components/EditableField';
import AddPressForm from './AddPressForm';
import { X } from 'lucide-react';

interface PressTranslation {
  id: number;
  press_id: number;
  locale: string;
  title: string;
  description: string;
  image_url: string;
}

interface Press {
  id: number;
  slug: string;
  press_translations: PressTranslation[];
  created_at: string;
}

interface PressEdit {
  press_id: number;
  slug: string;
  enTranslation: PressTranslation;
  jpTranslation: PressTranslation;
  activeLocale: string;
}

interface PressSectionProps {
  limit?: number;
  showReadMore?: boolean;
}

const PressSection: React.FC<PressSectionProps> = ({
  limit,
  showReadMore = true
}) => {
  const [press, setPress] = useState<Press[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPress, setEditingPress] = useState<PressEdit | null>(null);
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isAddingPress, setIsAddingPress] = useState(false);

  useEffect(() => {
    fetchPress();
  }, [language]);

  const fetchPress = async () => {
    try {
      const response = await axios.get('/presses');
      const sortedPress = response.data.sort((a: Press, b: Press) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const limitedPress = limit ? sortedPress.slice(0, limit) : sortedPress;
      setPress(limitedPress);
    } catch (error) {
      console.error('Error fetching press:', error);
    }
  };

  const handlePressEdit = async (pressItem: Press): Promise<void> => {
    const enTranslation = pressItem.press_translations.find(t => t.locale === 'en')!;
    const jpTranslation = pressItem.press_translations.find(t => t.locale === 'jp')!;

    setEditingPress({
      press_id: pressItem.id,
      slug: pressItem.slug,
      enTranslation,
      jpTranslation,
      activeLocale: language
    });
    setIsEditing(true);
  };

  const handleSave = async (values: { title: string; description: string; image_url: string; slug: string }) => {
    if (!editingPress) return;

    const updatedPress = {
      press: {
        slug: values.slug,
        press_translations_attributes: [
          {
            id: editingPress.enTranslation.id,
            locale: 'en',
            title: language === 'en' ? values.title : editingPress.enTranslation.title,
            description: language === 'en' ? values.description : editingPress.enTranslation.description,
            image_url: values.image_url
          },
          {
            id: editingPress.jpTranslation.id,
            locale: 'jp',
            title: language === 'jp' ? values.title : editingPress.jpTranslation.title,
            description: language === 'jp' ? values.description : editingPress.jpTranslation.description,
            image_url: values.image_url
          }
        ]
      }
    };

    try {
      await axios.put(`/presses/${editingPress.press_id}`, updatedPress);
      setIsEditing(false);
      setEditingPress(null);
      fetchPress();
    } catch (error) {
      console.error('Error saving press:', error);
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
    <section className={styles.press}>
      <div className={styles.container}>
        <h2 className={styles.heading}>PRESS RELEASE</h2>
        <div className={styles.underline}></div>
        <h3 className={styles.subheading}>
          {language === 'en' ? "press release" : language === 'jp' ? 'プレスリリース' : "press release"}
        </h3>
        {user && (
          <button
            onClick={() => setIsAddingPress(true)}
            className={styles.addPressButton}
          >
            Add Press
          </button>
        )}
        <div className={styles.content}>
          {press.map((pressItem) => {
            const translation = pressItem.press_translations.find(t => t.locale === language);
            if (!translation) return null;

            return (
              <div key={pressItem.id} className={`${styles.pressCard} ${user ? styles.isAdmin : ''}`}>
                <a
                  href={pressItem.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.imageContainer}
                >
                  <img src={translation.image_url} alt={translation.title} className={styles.pressImage} />
                </a>
                <div className={styles.textContent}>
                  <div className={styles.dateCategory}>
                    <a
                      href={pressItem.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.date}
                    >
                      {formatDate(pressItem.created_at)}
                    </a>
                    <a
                      href={pressItem.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.category}
                    >
                      {language === 'en' ? 'press release' : 'プレスリリース'}
                    </a>
                  </div>
                  <EditableField
                    value={translation.title}
                    fieldName="Title"
                    isAdmin={!!user}
                    onEdit={() => handlePressEdit(pressItem)}
                    className={styles.title}
                  />
                  <EditableField
                    value={translation.description}
                    fieldName="Description"
                    isAdmin={!!user}
                    onEdit={() => handlePressEdit(pressItem)}
                    className={`${styles.description} ${styles.preserveWhitespace}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <AddPressForm
          isOpen={isAddingPress}
          onClose={() => setIsAddingPress(false)}
          onSuccess={fetchPress}
        />
        {showReadMore && (
          <div className={styles.readMoreWrapper}>
            <a href="/pressrelease" className={styles.readMore}>
              READ MORE
            </a>
          </div>
        )}
      </div>

      {isEditing && editingPress && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Press</h2>
              <button onClick={() => {
                setIsEditing(false);
                setEditingPress(null);
              }} className={styles.closeButton}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <textarea
                  value={editingPress.activeLocale === 'en' ?
                    editingPress.enTranslation.title :
                    editingPress.jpTranslation.title}
                  onChange={(e) => setEditingPress({
                    ...editingPress,
                    [editingPress.activeLocale === 'en' ? 'enTranslation' : 'jpTranslation']: {
                      ...(editingPress.activeLocale === 'en' ? editingPress.enTranslation : editingPress.jpTranslation),
                      title: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={editingPress.activeLocale === 'en' ?
                    editingPress.enTranslation.description :
                    editingPress.jpTranslation.description}
                  onChange={(e) => setEditingPress({
                    ...editingPress,
                    [editingPress.activeLocale === 'en' ? 'enTranslation' : 'jpTranslation']: {
                      ...(editingPress.activeLocale === 'en' ? editingPress.enTranslation : editingPress.jpTranslation),
                      description: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image URL</label>
                <textarea
                  value={editingPress.enTranslation.image_url}
                  onChange={(e) => setEditingPress({
                    ...editingPress,
                    enTranslation: { ...editingPress.enTranslation, image_url: e.target.value },
                    jpTranslation: { ...editingPress.jpTranslation, image_url: e.target.value }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Slug</label>
                <textarea
                  value={editingPress.slug}
                  onChange={(e) => setEditingPress({
                    ...editingPress,
                    slug: e.target.value
                  })}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => handleSave({
                  title: editingPress.activeLocale === 'en' ?
                    editingPress.enTranslation.title :
                    editingPress.jpTranslation.title,
                  description: editingPress.activeLocale === 'en' ?
                    editingPress.enTranslation.description :
                    editingPress.jpTranslation.description,
                  image_url: editingPress.enTranslation.image_url,
                  slug: editingPress.slug
                })}
                className={styles.saveButton}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingPress(null);
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

export default PressSection;