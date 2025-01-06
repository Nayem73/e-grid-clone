import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './ServiceSoftwareDevResult.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import EditableField from '../components/EditableField';
import EditModal from '../components/EditModal';
import { Edit2, X } from 'lucide-react';

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
  parent_id?: number;
}

interface ResultDetailPair {
  parent_id: number;
  en: ServiceSoftwareDevResultDetail;
  jp: ServiceSoftwareDevResultDetail;
}

interface ResultDetailEdit {
  parent_id: number;
  enDetail: ServiceSoftwareDevResultDetail;
  jpDetail: ServiceSoftwareDevResultDetail;
  activeLocale: string;
}

const ServiceSoftwareDevResult: React.FC = () => {
  const [softwareDev, setSoftwareDev] = useState<ServiceSoftwareDev | null>(null);
  const [resultDetails, setResultDetails] = useState<ServiceSoftwareDevResultDetail[]>([]);
  const [detailPairs, setDetailPairs] = useState<Map<number, ResultDetailPair>>(new Map());
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [isEditingResult, setIsEditingResult] = useState(false);
  const [editingResult, setEditingResult] = useState<ResultDetailEdit | null>(null);
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
        const pairs = new Map<number, ResultDetailPair>();

        response.data.forEach((result: { id: number, service_softwaredev_result_details: ServiceSoftwareDevResultDetail[] }) => {
          const details = result.service_softwaredev_result_details;
          const enDetail = details.find(d => d.locale === 'en');
          const jpDetail = details.find(d => d.locale === 'jp');

          if (enDetail && jpDetail) {
            pairs.set(result.id, {
              parent_id: result.id,
              en: { ...enDetail, parent_id: result.id },
              jp: { ...jpDetail, parent_id: result.id }
            });
          }
        });

        setDetailPairs(pairs);
        const currentDetails = Array.from(pairs.values())
          .map(pair => language === 'en' ? pair.en : pair.jp);
        setResultDetails(currentDetails);
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

  const handleResultEditClick = (detail: ServiceSoftwareDevResultDetail) => {
    const pair = detailPairs.get(detail.parent_id!);
    if (pair) {
      setEditingResult({
        parent_id: detail.parent_id!,
        enDetail: pair.en,
        jpDetail: pair.jp,
        activeLocale: language
      });
      setIsEditingResult(true);
    }
  };

  const handleResultSave = async (values: { system_name: string; language: string; scope: string }) => {
    if (editingResult) {
      try {
        const updatedDetail = {
          service_softwaredev_result: {
            service_softwaredev_result_details_attributes: [
              {
                id: editingResult.enDetail.id,
                locale: 'en',
                system_name: language === 'en' ? values.system_name : editingResult.enDetail.system_name,
                language: values.language,
                scope: language === 'en' ? values.scope : editingResult.enDetail.scope
              },
              {
                id: editingResult.jpDetail.id,
                locale: 'jp',
                system_name: language === 'jp' ? values.system_name : editingResult.jpDetail.system_name,
                language: values.language,
                scope: language === 'jp' ? values.scope : editingResult.jpDetail.scope
              }
            ]
          }
        };

        await axios.put(`/service_softwaredev_results/${editingResult.parent_id}`, updatedDetail);

        const updatedPair = {
          parent_id: editingResult.parent_id,
          en: {
            ...editingResult.enDetail,
            language: values.language,
            ...(language === 'en' && {
              system_name: values.system_name,
              scope: values.scope
            })
          },
          jp: {
            ...editingResult.jpDetail,
            language: values.language,
            ...(language === 'jp' && {
              system_name: values.system_name,
              scope: values.scope
            })
          }
        };

        setDetailPairs(new Map(detailPairs.set(editingResult.parent_id, updatedPair)));
        setResultDetails(Array.from(detailPairs.values())
          .map(pair => language === 'en' ? pair.en : pair.jp));

        setIsEditingResult(false);
        setEditingResult(null);

        fetchResultDetails();
      } catch (error) {
        console.error('Error saving result details:', error);
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
            onEdit={() => handleEditClick('description', softwareDev.description)}
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
              {user && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {resultDetails.map((detail) => (
              <tr
                key={detail.id}
                className={`${styles.tableRow} ${user ? styles.isAdmin : ''}`}
              >
                <td>{detail.system_name}</td>
                <td>{detail.language}</td>
                <td>{detail.scope}</td>
                {user && (
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => handleResultEditClick(detail)}
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                )}
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

      {isEditingResult && editingResult && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Development Result</h2>
              <button
                onClick={() => {
                  setIsEditingResult(false);
                  setEditingResult(null);
                }}
                className={styles.closeButton}
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>System Name</label>
                <textarea
                  value={editingResult.activeLocale === 'en' ?
                    editingResult.enDetail.system_name :
                    editingResult.jpDetail.system_name}
                  onChange={(e) => setEditingResult({
                    ...editingResult,
                    [editingResult.activeLocale === 'en' ? 'enDetail' : 'jpDetail']: {
                      ...(editingResult.activeLocale === 'en' ? editingResult.enDetail : editingResult.jpDetail),
                      system_name: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Language</label>
                <textarea
                  value={editingResult.enDetail.language}
                  onChange={(e) => setEditingResult({
                    ...editingResult,
                    enDetail: { ...editingResult.enDetail, language: e.target.value },
                    jpDetail: { ...editingResult.jpDetail, language: e.target.value }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Scope</label>
                <textarea
                  value={editingResult.activeLocale === 'en' ?
                    editingResult.enDetail.scope :
                    editingResult.jpDetail.scope}
                  onChange={(e) => setEditingResult({
                    ...editingResult,
                    [editingResult.activeLocale === 'en' ? 'enDetail' : 'jpDetail']: {
                      ...(editingResult.activeLocale === 'en' ? editingResult.enDetail : editingResult.jpDetail),
                      scope: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => handleResultSave({
                  system_name: editingResult.activeLocale === 'en' ?
                    editingResult.enDetail.system_name :
                    editingResult.jpDetail.system_name,
                  language: editingResult.enDetail.language,
                  scope: editingResult.activeLocale === 'en' ?
                    editingResult.enDetail.scope :
                    editingResult.jpDetail.scope
                })}
                className={styles.saveButton}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditingResult(false);
                  setEditingResult(null);
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

export default ServiceSoftwareDevResult;