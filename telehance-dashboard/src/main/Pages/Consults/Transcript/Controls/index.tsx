import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faSave,
  faNotesMedical,
  faFile,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import classes from './Controls.module.css';

export default function Controls({
  isEditing,
  onEdit,
  onSave,
  hasEditedCopy,
  isEdited,
  toggleView,
  onDelete,
}: ControlsProps) {
  return (
    <div className={classes.container}>
      {isEditing ? (
        <>
          <Button onClick={onSave} variant='success'>
            <FontAwesomeIcon icon={faSave} /> Save
          </Button>
          <Button onClick={onDelete} variant='danger'>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
        </>
      ) : (
        <Button onClick={onEdit}>
          <FontAwesomeIcon icon={faPencilAlt} /> Edit
        </Button>
      )}
      {hasEditedCopy ? (
        <ToggleButtonGroup type='checkbox' name='view'>
          <ToggleButton
            value={1}
            onClick={toggleView}
            disabled={isEdited}
            checked={false}
          >
            <FontAwesomeIcon icon={faNotesMedical} /> Edited
          </ToggleButton>
          <ToggleButton
            value={2}
            onClick={toggleView}
            disabled={!isEdited}
            checked={false}
          >
            <FontAwesomeIcon icon={faFile} /> Original
          </ToggleButton>
        </ToggleButtonGroup>
      ) : null}
    </div>
  );
}

type ControlsProps = {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  hasEditedCopy: boolean;
  isEdited: boolean;
  toggleView: () => void;
  onDelete: () => void;
};
