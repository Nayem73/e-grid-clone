import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './ServiceSection.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import EditableField from '../components/EditableField';
import { X } from 'lucide-react';

interface ServiceTranslation {
  id: number;
  service_id: number;
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

interface ServiceEdit {
  service_id: number;
  enTranslation: ServiceTranslation;
  jpTranslation: ServiceTranslation;
  activeLocale: string;
}

const ServiceSection: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<ServiceEdit | null>(null);
  const { language } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, [language]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceEdit = async (service: Service): Promise<void> => {
    const enTranslation = service.service_translations.find(t => t.locale === 'en')!;
    const jpTranslation = service.service_translations.find(t => t.locale === 'jp')!;

    setEditingService({
      service_id: service.id,
      enTranslation,
      jpTranslation,
      activeLocale: language
    });
    setIsEditing(true);
  };

  const handleSave = async (values: { title: string; description: string; image_url: string }) => {
    if (!editingService) return;

    const updatedService = {
      service: {
        slug: services.find(s => s.id === editingService.service_id)?.slug,
        service_translations_attributes: [
          {
            id: editingService.enTranslation.id,
            locale: 'en',
            title: language === 'en' ? values.title : editingService.enTranslation.title,
            description: language === 'en' ? values.description : editingService.enTranslation.description,
            image_url: values.image_url
          },
          {
            id: editingService.jpTranslation.id,
            locale: 'jp',
            title: language === 'jp' ? values.title : editingService.jpTranslation.title,
            description: language === 'jp' ? values.description : editingService.jpTranslation.description,
            image_url: values.image_url
          }
        ]
      }
    };

    try {
      await axios.put(`/services/${editingService.service_id}`, updatedService);
      setIsEditing(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      throw error;
    }
  };

  return (
    <section className={styles.services}>
      <div className={styles.container}>
        <h2 className={styles.heading}>SERVICE</h2>
        <div className={styles.underline}></div>
        <h3 className={styles.subheading}>
          {language === 'en' ? 'Service' : language === 'jp' ? 'サービス' : 'Service'}
        </h3>
        <div className={styles.content}>
          {services.map((service, index) => {
            const translation = service.service_translations.find(t => t.locale === language);
            if (!translation) return null;

            return (
              <div
                key={service.id}
                className={`${styles.serviceItem} ${index % 2 === 0 ? styles.left : styles.right} ${user ? styles.isAdmin : ''}`}
              >
                <div className={styles.text}>
                  <EditableField
                    value={translation.title}
                    fieldName="Title"
                    isAdmin={!!user}
                    onEdit={() => handleServiceEdit(service)}
                  />
                  <EditableField
                    value={translation.description}
                    fieldName="Description"
                    isAdmin={!!user}
                    onEdit={() => handleServiceEdit(service)}
                    className={styles.preserveWhitespace}
                  />
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

      {isEditing && editingService && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Service</h2>
              <button onClick={() => {
                setIsEditing(false);
                setEditingService(null);
              }} className={styles.closeButton}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <textarea
                  value={editingService.activeLocale === 'en' ?
                    editingService.enTranslation.title :
                    editingService.jpTranslation.title}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    [editingService.activeLocale === 'en' ? 'enTranslation' : 'jpTranslation']: {
                      ...(editingService.activeLocale === 'en' ? editingService.enTranslation : editingService.jpTranslation),
                      title: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={editingService.activeLocale === 'en' ?
                    editingService.enTranslation.description :
                    editingService.jpTranslation.description}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    [editingService.activeLocale === 'en' ? 'enTranslation' : 'jpTranslation']: {
                      ...(editingService.activeLocale === 'en' ? editingService.enTranslation : editingService.jpTranslation),
                      description: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image URL</label>
                <textarea
                  value={editingService.enTranslation.image_url}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    enTranslation: { ...editingService.enTranslation, image_url: e.target.value },
                    jpTranslation: { ...editingService.jpTranslation, image_url: e.target.value }
                  })}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => handleSave({
                  title: editingService.activeLocale === 'en' ?
                    editingService.enTranslation.title :
                    editingService.jpTranslation.title,
                  description: editingService.activeLocale === 'en' ?
                    editingService.enTranslation.description :
                    editingService.jpTranslation.description,
                  image_url: editingService.enTranslation.image_url
                })}
                className={styles.saveButton}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingService(null);
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

export default ServiceSection;