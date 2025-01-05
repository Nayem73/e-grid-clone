import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './ServiceSoftwareDevResult.module.css';
import { useLanguage } from '../contexts/LanguageContext';

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

interface ServiceSoftwareDevResult {
  id: number;
  service_softwaredev_result_details: ServiceSoftwareDevResultDetail[];
}

const ServiceSoftwareDevResult: React.FC = () => {
  const [softwareDev, setSoftwareDev] = useState<ServiceSoftwareDev | null>(null);
  const [resultDetails, setResultDetails] = useState<ServiceSoftwareDevResultDetail[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    axios
      .get(`/service_softwaredev?locale=${language}`)
      .then((response) => setSoftwareDev(response.data))
      .catch((error) => console.error('Error fetching software development data:', error));
  }, [language]);

  useEffect(() => {
    axios
      .get('/service_softwaredev_results')
      .then((response) => {
        const allResults = response.data.map((result: ServiceSoftwareDevResult) => result.service_softwaredev_result_details);
        const filteredResults = allResults.flat().filter(
          (result: ServiceSoftwareDevResultDetail) => result.locale === language
        );
        setResultDetails(filteredResults);
      })
      .catch((error) => console.error('Error fetching result details:', error));
  }, [language]);

  return (
    <div className={styles.container}>
      {softwareDev && (
        <div className={styles.mainContent}>
          <h2>Software Development Service</h2>
          <p>{softwareDev.description}</p>
          <h3>Main Development Language 1</h3>
          <p>{softwareDev.main_dev_language_1}</p>
          <img src={softwareDev.image_url} alt="Ruby Certification" className={styles.image} />
          <h3>Main Development Language 2</h3>
          <p>{softwareDev.main_dev_language_2}</p>
          <h3>Other Tools</h3>
          <p>{softwareDev.others}</p>
          <a href={softwareDev.contact_form} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
            Contact Form
          </a>
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
    </div>
  );
};

export default ServiceSoftwareDevResult;
