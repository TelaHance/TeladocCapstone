import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faSave,
  faNotesMedical,
  faCopy,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import classes from './Controls.module.css';

type ControlsProps = {
  isEditing: boolean;
  toggleEdit: () => void;
  hasEditedCopy: boolean;
  isEdited: boolean;
  toggleView: () => void;
};

export default function Controls({
  isEditing,
  toggleEdit,
  hasEditedCopy,
  isEdited,
  toggleView,
}: ControlsProps) {
  return (
    <div className={classes.container}>
      {isEditing ? (
        <Button onClick={toggleEdit} variant='success'>
          <FontAwesomeIcon icon={faSave} /> Save
        </Button>
      ) : (
        <Button onClick={toggleEdit}>
          <FontAwesomeIcon icon={faPencilAlt} /> Edit
        </Button>
      )}
      {hasEditedCopy ? (
        <ToggleButtonGroup type="radio" name="view">
          <ToggleButton value={1} onClick={toggleView} disabled={isEdited} checked={false}>
            <FontAwesomeIcon icon={faNotesMedical} /> Edited
          </ToggleButton>
          <ToggleButton value={2} onClick={toggleView} disabled={!isEdited} checked={false}>
            <FontAwesomeIcon icon={faFile} /> Original
          </ToggleButton>
        </ToggleButtonGroup>
      ) : null}
    </div>
  );
}
