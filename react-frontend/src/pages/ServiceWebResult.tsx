import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './ServiceSoftwareDevResult.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import EditableField from '../components/EditableField';
import EditModal from '../components/EditModal';
import WebresultSection from '../components/WebresultSection';
import CategoryGrid from '../components/CategoryGrid';

interface WebExperience {
  locale: string;
  title: string;
  description: string;
}

const ServiceWebResult: React.FC = () => {
  const [webExperience, setWebExperience] = useState<WebExperience | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const { language } = useLanguage();
  const { user } = useAuth();

  const fetchWebExperience = () => {
    axios
      .get(`/webresult_experiences?locale=${language}`)
      .then((response) => setWebExperience(response.data))
      .catch((error) => console.error('Error fetching web experience data:', error));
  };

  useEffect(() => {
    fetchWebExperience();
  }, [language]);

  const handleEditClick = async (field: string, value: string): Promise<void> => {
    setEditField(field);
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = async (value: string): Promise<void> => {
    if (webExperience) {
      const updatedData = {
        webresult_experience: {
          locale: webExperience.locale,
          [editField === 'description' ? 'description' : 'marketing_title']: value,
        },
      };

      try {
        const response = await axios.put(
          `/webresult_experiences/${webExperience.locale === 'en' ? 1 : 2}`,
          updatedData
        );
        setWebExperience({
          ...webExperience,
          [editField === 'description' ? 'description' : 'title']: value,
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving updated web experience data:', error);
        throw error;
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>WORKS</h2>
      <div className={styles.underline}></div>
      <h3 className={styles.subheading}>
        Site creation and marketing (SEO, listing, affiliate, Facebook) track record
      </h3>

      {webExperience && (
        <div className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <div className={styles.line}></div>
            <h2 className={styles.sectionTitle}>Website creation experience</h2>
          </div>

          <EditableField
            value={webExperience.description}
            fieldName="Description"
            isAdmin={!!user}
            onEdit={() => handleEditClick('description', webExperience.description)}
            className={styles.preserveWhitespace}
          />

          <EditableField
            value={webExperience.title}
            fieldName="Marketing Title"
            isAdmin={!!user}
            onEdit={() => handleEditClick('marketing_title', webExperience.title)}
            className={`${styles.preserveWhitespace} ${styles.marketingTitle}`}
          />
        </div>
      )}

      {isEditing && (
        <EditModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          value={editValue}
          fieldName={editField}
        />
      )}
      <CategoryGrid />
      <WebresultSection />
    </div>
  );
};

export default ServiceWebResult;