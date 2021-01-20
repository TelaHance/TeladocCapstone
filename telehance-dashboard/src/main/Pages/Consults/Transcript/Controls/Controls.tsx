import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import classes from './Controls.module.css';

type ControlsProps = {
  isEditing: boolean;
  toggleEdit: () => void;
};

export default function Controls({ isEditing, toggleEdit }: ControlsProps) {
  return (
    <div className={classes.container}>
      {isEditing ? (
        <button className={classes.save} onClick={toggleEdit}>
          <FontAwesomeIcon icon={faSave} /> Save
        </button>
      ) : (
        <button className={classes.edit} onClick={toggleEdit}>
          <FontAwesomeIcon icon={faPencilAlt} /> Edit
        </button>
      )}
    </div>
  );
}
