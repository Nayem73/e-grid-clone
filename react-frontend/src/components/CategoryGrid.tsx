import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './CategoryGrid.module.css';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryTitle {
  id: number;
  title_en: string;
  title_jp: string;
}

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<CategoryTitle[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    axios
      .get('/webresult_category_titles')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridContainer}>
        {categories.map((category) => (
          <div key={category.id} className={styles.gridItem}>
            {language === 'en' ? category.title_en : category.title_jp}
          </div>
        ))}
      </div>
      <div className={styles.selectedCategory}>
        {language === 'en' ? 'Recruit' : 'リクルート'}
      </div>
    </div>
  );
};

export default CategoryGrid;