import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import classes from './CallControls.module.css';
import { Button } from 'react-bootstrap';

export default function CallControls({
  isCalling,
  call,
  hangup,
}: CallControlsProps) {
  return (
    <div className={classes.container}>
      {isCalling ? (
        <Button variant='danger' size='lg' onClick={hangup}>
          <FontAwesomeIcon icon={faPhoneAlt} className={classes.hangup} />
        </Button>
      ) : (
        <Button variant='success' size='lg' onClick={call}>
          <FontAwesomeIcon icon={faPhoneAlt} />
        </Button>
      )}
    </div>
  );
}

type CallControlsProps = {
  isCalling: boolean;
  call: () => void;
  hangup: () => void;
};
