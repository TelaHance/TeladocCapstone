import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { ReadyState } from 'react-use-websocket';
import classes from './CallControls.module.css';

export default function CallControls({
  ready,
  isCalling,
  call,
  hangup,
}: CallControlsProps) {
  let callButton;
  if (ready === ReadyState.CONNECTING) {
    callButton = (
      <Button disabled size='lg' variant='secondary'>
        <FontAwesomeIcon icon={faPhoneAlt} />
      </Button>
    );
  } else {
    callButton = isCalling ? (
      <Button variant='danger' size='lg' onClick={hangup}>
        <FontAwesomeIcon icon={faPhoneAlt} className={classes.hangup} />
      </Button>
    ) : (
      <Button variant='success' size='lg' onClick={call}>
        <FontAwesomeIcon icon={faPhoneAlt} />
      </Button>
    );
  }
  return <div className={classes.container}>{callButton}</div>;
}

type CallControlsProps = {
  ready: number;
  isCalling: boolean;
  call: () => void;
  hangup: () => void;
};
