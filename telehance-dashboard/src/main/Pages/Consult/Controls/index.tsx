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
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
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
              <Button onClick={onCancel} variant='secondary' type='reset'>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
              <Button onClick={onSave} variant='success' type='submit'>
                <FontAwesomeIcon icon={faSave} /> Save
              </Button>
              <Button onClick={() => setShowConfirmModal(true)} variant='danger'>
                <FontAwesomeIcon icon={faTrash} /> Delete
              </Button>
            </>
        ) : (
            <Button onClick={onEdit}>
              <FontAwesomeIcon icon={faPencilAlt} /> Edit
            </Button>
        )}
        {' '}
        {hasEditedCopy ? (
            <ToggleButtonGroup type='checkbox' name='view'>
              <ToggleButton
                  value={1}
                  onClick={toggleView}
                  disabled={isEdited}
                  onFocus={(e) => e.target.blur()}
              >
                <FontAwesomeIcon icon={faNotesMedical} /> Edited
              </ToggleButton>
              <ToggleButton
                  value={2}
                  onClick={toggleView}
                  disabled={!isEdited}
                  onFocus={(e) => e.target.blur()}
              >
                <FontAwesomeIcon icon={faFile} /> Original
              </ToggleButton>
            </ToggleButtonGroup>
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
