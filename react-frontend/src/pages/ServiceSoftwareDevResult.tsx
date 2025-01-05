import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './ServiceSoftwareDevResult.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import EditableField from '../components/EditableField';
import EditModal from '../components/EditModal';

interface ServiceSoftwareDev {
  id: number;
  locale: string;
  description: string;
  main_dev_language_1: string;
  main_dev_language_2: string;
  image_url: string;
  others: string;
  contact_form: string;
}

interface ServiceSoftwareDevResultDetail {
  id: number;
  locale: string;
  system_name: string;
  language: string;
  scope: string;
}

const ServiceSoftwareDevResult: React.FC = () => {
  const [softwareDev, setSoftwareDev] = useState<ServiceSoftwareDev | null>(null);
  const [resultDetails, setResultDetails] = useState<ServiceSoftwareDevResultDetail[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const { language } = useLanguage();
  const { user } = useAuth();

  const fetchSoftwareDev = () => {
    const localeId = language === 'en' ? 1 : 2;
    axios
      .get(`/service_softwaredev/${localeId}`)
      .then((response) => setSoftwareDev(response.data))
      .catch((error) => console.error('Error fetching software development data:', error));
  };

  const fetchResultDetails = () => {
    axios
      .get('/service_softwaredev_results')
      .then((response) => {
        const allResults = response.data.map(
          (result: { service_softwaredev_result_details: ServiceSoftwareDevResultDetail[] }) => result.service_softwaredev_result_details
        );
        const filteredResults = allResults.flat().filter(
          (result: ServiceSoftwareDevResultDetail) => result.locale === language
        );
        setResultDetails(filteredResults);
      })
      .catch((error) => console.error('Error fetching result details:', error));
  };

  useEffect(() => {
    fetchSoftwareDev();
    fetchResultDetails();
  }, [language]);

  const handleEditClick = async (field: string, value: string): Promise<void> => {
    setEditField(field);
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = async (value: string): Promise<void> => {
    if (softwareDev && editField) {
      const updatedSoftwareDev = {
        service_softwaredev: {
          ...softwareDev,
          [editField]: value,
        },
      };

      try {
        await axios.put(`/service_softwaredev/${softwareDev.id}`, updatedSoftwareDev);
        setSoftwareDev({ ...softwareDev, [editField]: value });
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving updated software development data:', error);
        throw error;
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>SOFTWAREDEV_RESULT</h1>
      <h2 className={styles.subtitle}>Software Development Track Record</h2>

      {softwareDev && (
        <div className={styles.mainContent}>
          <EditableField
            value={softwareDev.description}
            fieldName="Description"
            isAdmin={!!user}
            onEdit={() => Promise.resolve(handleEditClick('description', softwareDev.description))}
            className={styles.preserveWhitespace}
          />

          <EditableField
            value={softwareDev.main_dev_language_1}
            fieldName="Main Development Language 1"
            isAdmin={!!user}
            onEdit={() => handleEditClick('main_dev_language_1', softwareDev.main_dev_language_1)}
          />

          <img src={softwareDev.image_url} alt="Ruby Certification" className={styles.image} />

          <EditableField
            value={softwareDev.main_dev_language_2}
            fieldName="Main Development Language 2"
            isAdmin={!!user}
            onEdit={() => handleEditClick('main_dev_language_2', softwareDev.main_dev_language_2)}
          />

          <EditableField
            value={softwareDev.others}
            fieldName="Others"
            isAdmin={!!user}
            onEdit={() => handleEditClick('others', softwareDev.others)}
          />
        </div>
      )}

      <div className={styles.resultDetails}>
        <h3>Development Results</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>System Name</th>
              <th>Language</th>
              <th>Scope</th>
            </tr>
          </thead>
          <tbody>
            {resultDetails.map((detail) => (
              <tr key={detail.id}>
                <td>{detail.system_name}</td>
                <td>{detail.language}</td>
                <td>{detail.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <EditModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          value={editValue}
          fieldName={editField}
        />
      )}
    </div>
  );
};

export default ServiceSoftwareDevResult;
