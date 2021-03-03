import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhoneAlt,
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonIcon } from 'react-rainbow-components';
import classes from './CallControls.module.css';

export default function CallControls({
  status,
  call,
  hangup,
  mute,
}: CallControlsProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    mute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    switch (status) {
      case Status.Ready:
        setIsReady(true);
        break;
      case Status.Initiated:
      case Status.Ringing:
        break;
      case Status.InProgress:
        setIsMuted(false);
        break;
      default:
        setIsReady(false);
        setIsCalling(false);
        setIsMuted(true);
        break;
    }
  }, [status]);

  return (
    <div className={classes.container}>
      {isCalling ? (
        <ButtonIcon
          // @ts-ignore
          variant='destructive'
          size='large'
          disabled={!isReady}
          onClick={() => {
            hangup();
            setIsCalling(false);
          }}
          icon={
            <FontAwesomeIcon icon={faPhoneAlt} className={classes.hangup} />
          }
        />
      ) : (
        <ButtonIcon
          variant='success'
          size='large'
          disabled={!isReady}
          onClick={() => {
            call();
            setIsCalling(true);
          }}
          icon={<FontAwesomeIcon icon={faPhoneAlt} />}
        />
      )}
      {isMuted ? (
        <ButtonIcon
          // @ts-ignore
          variant='destructive'
          size='large'
          disabled={status !== Status.InProgress}
          onClick={() => setIsMuted(false)}
          icon={<FontAwesomeIcon icon={faMicrophoneSlash} />}
        />
      ) : (
        <ButtonIcon
          variant='border-filled'
          size='large'
          disabled={status !== Status.InProgress}
          onClick={() => setIsMuted(true)}
          icon={<FontAwesomeIcon icon={faMicrophone} />}
        />
      )}
    </div>
  );
}

export enum Status {
  Waiting = 'waiting',
  Ready = 'ready',
  Initiated = 'initiated',
  Ringing = 'ringing',
  InProgress = 'in-progress',
  Completed = 'completed',
  Closed = 'closed',
}

type CallControlsProps = {
  status: Status;
  call: () => void;
  hangup: () => void;
  mute: (shouldMute?: boolean) => void;
};
