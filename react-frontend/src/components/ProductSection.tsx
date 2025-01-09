import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './ProductSection.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import EditableField from '../components/EditableField';
import { X } from 'lucide-react';

interface ProductTranslation {
  id: number;
  product_id: number;
  locale: string;
  title: string;
  description: string;
  image_url: string;
}

interface Product {
  id: number;
  slug: string;
  product_translations: ProductTranslation[];
}

interface ProductEdit {
  product_id: number;
  slug: string;
  enTranslation: ProductTranslation;
  jpTranslation: ProductTranslation;
  activeLocale: string;
}

const ProductSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductEdit | null>(null);
  const { language } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [language]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductEdit = async (product: Product): Promise<void> => {
    const enTranslation = product.product_translations.find(t => t.locale === 'en')!;
    const jpTranslation = product.product_translations.find(t => t.locale === 'jp')!;

    setEditingProduct({
      product_id: product.id,
      slug: product.slug,
      enTranslation,
      jpTranslation,
      activeLocale: language
    });
    setIsEditing(true);
  };

  const handleSave = async (values: { title: string; description: string; image_url: string; slug: string }) => {
    if (!editingProduct) return;

    const updatedProduct = {
      product: {
        slug: values.slug,
        product_translations_attributes: [
          {
            id: editingProduct.enTranslation.id,
            locale: 'en',
            title: language === 'en' ? values.title : editingProduct.enTranslation.title,
            description: language === 'en' ? values.description : editingProduct.enTranslation.description,
            image_url: values.image_url
          },
          {
            id: editingProduct.jpTranslation.id,
            locale: 'jp',
            title: language === 'jp' ? values.title : editingProduct.jpTranslation.title,
            description: language === 'jp' ? values.description : editingProduct.jpTranslation.description,
            image_url: values.image_url
          }
        ]
      }
    };

    try {
      await axios.put(`/products/${editingProduct.product_id}`, updatedProduct);
      setIsEditing(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  return (
    <section className={styles.products}>
      <div className={styles.container}>
        <h2 className={styles.heading}>PRODUCTS</h2>
        <div className={styles.underline}></div>
        <h3 className={styles.subheading}>
          {language === 'en' ? 'Products' : language === 'jp' ? '製品' : 'Products'}
        </h3>
        <div className={styles.content}>
          {products.map((product) => {
            const translation = product.product_translations.find(t => t.locale === language);
            if (!translation) return null;

            return (
              <div key={product.id} className={`${styles.productCard} ${user ? styles.isAdmin : ''}`}>
                <div className={styles.imageContainer}>
                  <img src={translation.image_url} alt={translation.title} className={styles.productImage} />
                </div>
                <div className={styles.textContent}>
                  <h4 className={styles.title}>{translation.title}</h4>
                  <EditableField
                    value={translation.description}
                    fieldName="Description"
                    isAdmin={!!user}
                    onEdit={() => handleProductEdit(product)}
                    className={styles.preserveWhitespace}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isEditing && editingProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Product</h2>
              <button onClick={() => {
                setIsEditing(false);
                setEditingProduct(null);
              }} className={styles.closeButton}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <textarea
                  value={editingProduct.activeLocale === 'en' ?
                    editingProduct.enTranslation.title :
                    editingProduct.jpTranslation.title}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    [editingProduct.activeLocale === 'en' ? 'enTranslation' : 'jpTranslation']: {
                      ...(editingProduct.activeLocale === 'en' ? editingProduct.enTranslation : editingProduct.jpTranslation),
                      title: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={editingProduct.activeLocale === 'en' ?
                    editingProduct.enTranslation.description :
                    editingProduct.jpTranslation.description}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    [editingProduct.activeLocale === 'en' ? 'enTranslation' : 'jpTranslation']: {
                      ...(editingProduct.activeLocale === 'en' ? editingProduct.enTranslation : editingProduct.jpTranslation),
                      description: e.target.value
                    }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image URL</label>
                <textarea
                  value={editingProduct.enTranslation.image_url}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    enTranslation: { ...editingProduct.enTranslation, image_url: e.target.value },
                    jpTranslation: { ...editingProduct.jpTranslation, image_url: e.target.value }
                  })}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Slug</label>
                <textarea
                  value={editingProduct.slug}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    slug: e.target.value
                  })}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={() => handleSave({
                  title: editingProduct.activeLocale === 'en' ?
                    editingProduct.enTranslation.title :
                    editingProduct.jpTranslation.title,
                  description: editingProduct.activeLocale === 'en' ?
                    editingProduct.enTranslation.description :
                    editingProduct.jpTranslation.description,
                  image_url: editingProduct.enTranslation.image_url,
                  slug: editingProduct.slug
                })}
                className={styles.saveButton}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingProduct(null);
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

export default ProductSection;