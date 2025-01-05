import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './EditModal.module.css';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => Promise<void>;
  value: string;
  fieldName: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, value, fieldName }) => {
  const [editedValue, setEditedValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave(editedValue);
      onClose();
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Edit {fieldName}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className={styles.textarea}
            rows={10}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <div className={styles.modalFooter}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={styles.saveButton}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            disabled={isSaving}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;