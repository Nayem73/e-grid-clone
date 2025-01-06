import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import styles from './EditableField.module.css';

interface EditableFieldProps {
  value: string;
  fieldName: string;
  isAdmin: boolean;
  onEdit: (value: string) => Promise<void>;
  className?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  fieldName,
  isAdmin,
  onEdit,
  className = '',
}) => {
  const [showEditIcon, setShowEditIcon] = useState(false);

  return (
    <div
      className={`${styles.editableField} ${isAdmin ? styles.isAdmin : ''} ${className}`}
      onMouseEnter={() => isAdmin && setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
    >
      <div className={styles.content}>{value}</div>
      {isAdmin && showEditIcon && (
        <button
          className={styles.editButton}
          onClick={() => onEdit(value)}
          title={`Edit ${fieldName}`}
        >
          <Edit2 size={16} />
        </button>
      )}
    </div>
  );
};

export default EditableField;