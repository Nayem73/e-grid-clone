import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './WebresultSection.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import EditableField from '../components/EditableField';
import { X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface WebresultCategoryDetail {
  id: number;
  locale: string;
  company_name: string;
  service_name: string;
  details: string;
  image_url: string;
  slug: string;
  webresult_category_id: number;
}

interface WebresultCategory {
  id: number;
  category_name_en: string;
  category_name_jp: string;
  position: number;
  webresult_category_details: WebresultCategoryDetail[];
}

interface EditingDetail {
  categoryId: number;
  enDetail: WebresultCategoryDetail;
  jpDetail: WebresultCategoryDetail;
  activeLocale: string;
}

const WebresultSection: React.FC = () => {
  const [categories, setCategories] = useState<WebresultCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDetail, setEditingDetail] = useState<EditingDetail | null>(null);
  const { language } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/webresult_categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Create a new array of categories
    const updatedCategories = Array.from(categories);

    // Remove the dragged item from its source
    const [removed] = updatedCategories.splice(source.index, 1);
    // Insert it at the destination
    updatedCategories.splice(destination.index, 0, removed);

    // Update positions (1-based)
    const positions = updatedCategories.map((category, index) => ({
      id: category.id,
      position: index + 1
    }));

    try {
      await axios.post('/webresult_categories/update_positions', {
        positions: positions
      });

      // Update local state with new positions
      setCategories(updatedCategories.map((category, index) => ({
        ...category,
        position: index + 1
      })));
    } catch (error) {
      console.error('Error updating positions:', error);
      fetchCategories();
    }
  };

  const handleDetailEdit = async (category: WebresultCategory, detail: WebresultCategoryDetail): Promise<void> => {
    const enDetail = category.webresult_category_details.find(d => d.locale === 'en')!;
    const jpDetail = category.webresult_category_details.find(d => d.locale === 'jp')!;

    setEditingDetail({
      categoryId: category.id,
      enDetail,
      jpDetail,
      activeLocale: language
    });
    setIsEditing(true);
  };

  const handleSave = async (values: Partial<WebresultCategoryDetail>) => {
    if (!editingDetail) return;

    const updatedCategory = {
      webresult_category: {
        webresult_category_details_attributes: [
          {
            id: editingDetail.enDetail.id,
            locale: 'en',
            company_name: language === 'en' ? values.company_name : editingDetail.enDetail.company_name,
            service_name: language === 'en' ? values.service_name : editingDetail.enDetail.service_name,
            details: language === 'en' ? values.details : editingDetail.enDetail.details,
            image_url: values.image_url,
            slug: values.slug
          },
          {
            id: editingDetail.jpDetail.id,
            locale: 'jp',
            company_name: language === 'jp' ? values.company_name : editingDetail.jpDetail.company_name,
            service_name: language === 'jp' ? values.service_name : editingDetail.jpDetail.service_name,
            details: language === 'jp' ? values.details : editingDetail.jpDetail.details,
            image_url: values.image_url,
            slug: values.slug
          }
        ]
      }
    };

    try {
      await axios.put(`/webresult_categories/${editingDetail.categoryId}`, updatedCategory);
      setIsEditing(false);
      setEditingDetail(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <section className={styles.webresults}>
      <div className={styles.container}>
        <h2 className={styles.heading}>WEB RESULT</h2>
        <div className={styles.underline}></div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {categories.length > 0 && (
            <Droppable droppableId="categories" direction="vertical">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={styles.content}>
                  {categories.map((category, index) => (
                    <Draggable
                      key={`category-${category.id}`}
                      draggableId={`category-${category.id}`}
                      index={index}
                      isDragDisabled={!user}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={styles.resultItem} // Applies grid styles
                        >
                          {/* <h3 className={styles.categoryTitle}>
                            {language === 'en' ? category.category_name_en : category.category_name_jp}
                          </h3> */}
                          <div className={styles.content}>
                            {category.webresult_category_details
                              .filter((detail) => detail.locale === language)
                              .map((detail, index) => (
                                <div
                                  key={detail.id}
                                  className={`${styles.resultItem} ${index % 2 === 0 ? styles.row : styles.rowReverse}`}
                                >
                                  <div className={styles.image}>
                                    <img src={detail.image_url} alt={detail.company_name} />
                                  </div>
                                  <div className={styles.text}>
                                    <h4 className={styles.companyName}>
                                      {detail.company_name}
                                    </h4>
                                    <EditableField
                                      value={detail.service_name}
                                      fieldName="Service Name"
                                      isAdmin={!!user}
                                      onEdit={async () => handleDetailEdit(category, detail)}
                                      className={styles.preserveWhitespace}
                                    />
                                    <div className={styles.tags}>
                                      {detail.details.split(', ').map((tag, i) => (
                                        <span key={i} className={styles.tag}>{tag}</span>
                                      ))}
                                    </div>
                                    <a href={detail.slug} className={styles.readMore}>READ MORE</a>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </DragDropContext>
      </div>

      {isEditing && editingDetail && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Web Result</h2>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingDetail(null);
                }}
                className={styles.closeButton}
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Company Name</label>
                <textarea
                  value={editingDetail.activeLocale === 'en' ?
                    editingDetail.enDetail.company_name :
                    editingDetail.jpDetail.company_name}
                  onChange={(e) => setEditingDetail({
                    ...editingDetail,
                    [editingDetail.activeLocale === 'en' ? 'enDetail' : 'jpDetail']: {
                      ...(editingDetail.activeLocale === 'en' ? editingDetail.enDetail : editingDetail.jpDetail),
                      company_name: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Service Name</label>
                <textarea
                  value={editingDetail.activeLocale === 'en' ?
                    editingDetail.enDetail.service_name :
                    editingDetail.jpDetail.service_name}
                  onChange={(e) => setEditingDetail({
                    ...editingDetail,
                    [editingDetail.activeLocale === 'en' ? 'enDetail' : 'jpDetail']: {
                      ...(editingDetail.activeLocale === 'en' ? editingDetail.enDetail : editingDetail.jpDetail),
                      service_name: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Details (comma-separated)</label>
                <textarea
                  value={editingDetail.activeLocale === 'en' ?
                    editingDetail.enDetail.details :
                    editingDetail.jpDetail.details}
                  onChange={(e) => setEditingDetail({
                    ...editingDetail,
                    [editingDetail.activeLocale === 'en' ? 'enDetail' : 'jpDetail']: {
                      ...(editingDetail.activeLocale === 'en' ? editingDetail.enDetail : editingDetail.jpDetail),
                      details: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image URL</label>
                <textarea
                  value={editingDetail.enDetail.image_url}
                  onChange={(e) => setEditingDetail({
                    ...editingDetail,
                    enDetail: { ...editingDetail.enDetail, image_url: e.target.value },
                    jpDetail: { ...editingDetail.jpDetail, image_url: e.target.value }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Slug</label>
                <textarea
                  value={editingDetail.enDetail.slug}
                  onChange={(e) => setEditingDetail({
                    ...editingDetail,
                    enDetail: { ...editingDetail.enDetail, slug: e.target.value },
                    jpDetail: { ...editingDetail.jpDetail, slug: e.target.value }
                  })}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => handleSave({
                  company_name: editingDetail.activeLocale === 'en' ?
                    editingDetail.enDetail.company_name :
                    editingDetail.jpDetail.company_name,
                  service_name: editingDetail.activeLocale === 'en' ?
                    editingDetail.enDetail.service_name :
                    editingDetail.jpDetail.service_name,
                  details: editingDetail.activeLocale === 'en' ?
                    editingDetail.enDetail.details :
                    editingDetail.jpDetail.details,
                  image_url: editingDetail.enDetail.image_url,
                  slug: editingDetail.enDetail.slug
                })}
                className={styles.saveButton}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingDetail(null);
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

export default WebresultSection;
