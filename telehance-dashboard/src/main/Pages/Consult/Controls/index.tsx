import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faSave,
  faNotesMedical,
  faFile,
  faTrash,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonIcon } from 'react-rainbow-components';
import ConfirmModal from './ConfirmModal';
import classes from './Controls.module.css';

export default function Controls({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  hasEditedCopy,
  isEdited,
  toggleView,
}: ControlsProps) {
  // Delete Confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <div className={classes.container}>
      {isEditing ? (
        <>
          <ButtonIcon
            onClick={onCancel}
            variant='border'
            tooltip='Cancel'
            shaded
            icon={<FontAwesomeIcon icon={faTimes} />}
          />
          <ButtonIcon
            onClick={onSave}
            variant='success'
            tooltip='Save'
            shaded
            icon={<FontAwesomeIcon icon={faSave} />}
          />
          <ButtonIcon
            onClick={() => setShowConfirmModal(true)}
            // @ts-ignore
            variant='destructive'
            tooltip='Delete'
            shaded
            icon={<FontAwesomeIcon icon={faTrash} />}
          />
        </>
      ) : (
        <ButtonIcon
          onClick={onEdit}
          variant='brand'
          tooltip='Edit'
          shaded
          icon={<FontAwesomeIcon icon={faPencilAlt} />}
        />
      )}
      {hasEditedCopy ? (
        isEdited ? (
          <ButtonIcon
            onClick={toggleView}
            disabled={!isEdited}
            variant='border'
            tooltip='Viewing Edited'
            shaded
            icon={<FontAwesomeIcon icon={faNotesMedical} />}
            onFocus={(e) => e.target.blur()}
          />
        ) : (
          <ButtonIcon
            onClick={toggleView}
            disabled={isEdited}
            variant='border'
            tooltip='Viewing Original'
            shaded
            icon={<FontAwesomeIcon icon={faFile} />}
            onFocus={(e) => e.target.blur()}
          />
        )
      ) : null}
      <ConfirmModal
        show={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={() => {
          onDelete();
          setShowConfirmModal(false);
        }}
      />
    </div>
  );
}

export type ControlsProps = {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  hasEditedCopy: boolean;
  isEdited: boolean;
  toggleView: () => void;
};
