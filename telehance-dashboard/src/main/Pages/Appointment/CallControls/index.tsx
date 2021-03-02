import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhoneAlt,
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonIcon } from 'react-rainbow-components';
import { Connection } from 'twilio-client';
import classes from './CallControls.module.css';

export default function CallControls({
  ready,
  callStatus,
  call,
  hangup,
  mute,
}: CallControlsProps) {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    console.log('Muted: ', isMuted);
    mute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    console.log('Call Status: ', callStatus);
    if (callStatus === Connection.State.Open) {
      setIsMuted(false);
    }
  }, [callStatus]);

  return (
    <div className={classes.container}>
      {!callStatus || callStatus === Connection.State.Closed ? (
        <ButtonIcon
          variant='success'
          size='large'
          disabled={!ready}
          onClick={call}
          icon={<FontAwesomeIcon icon={faPhoneAlt} />}
        />
      ) : (
        <ButtonIcon
          // @ts-ignore
          variant='destructive'
          size='large'
          disabled={!ready}
          onClick={hangup}
          icon={
            <FontAwesomeIcon icon={faPhoneAlt} className={classes.hangup} />
          }
        />
      )}
      {isMuted ? (
        <ButtonIcon
          // @ts-ignore
          variant='destructive'
          size='large'
          disabled={callStatus !== Connection.State.Open}
          onClick={() => setIsMuted(false)}
          icon={<FontAwesomeIcon icon={faMicrophoneSlash} />}
        />
      ) : (
        <ButtonIcon
          variant='border-filled'
          size='large'
          disabled={callStatus !== Connection.State.Open}
          onClick={() => setIsMuted(true)}
          icon={<FontAwesomeIcon icon={faMicrophone} />}
        />
      )}
    </div>
  );
}

type CallControlsProps = {
  ready: boolean;
  callStatus?: Connection.State;
  call: () => void;
  hangup: () => void;
  mute: (shouldMute?: boolean) => void;
};
