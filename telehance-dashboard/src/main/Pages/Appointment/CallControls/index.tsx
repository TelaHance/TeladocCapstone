import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhoneAlt,
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonIcon } from 'react-rainbow-components';
import { ReadyState } from 'react-use-websocket';
import classes from './CallControls.module.css';
import { Connection } from 'twilio-client';

export default function CallControls({
  wsStatus,
  callStatus,
  call,
  hangup,
  mute,
}: CallControlsProps) {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    mute(isMuted);
  }, [isMuted]);

  return (
    <div className={classes.container}>
      {!callStatus || callStatus === Connection.State.Closed ? (
        <ButtonIcon
          variant='success'
          size='large'
          disabled={
            wsStatus === ReadyState.CONNECTING || wsStatus === ReadyState.CLOSED
          }
          onClick={call}
          icon={<FontAwesomeIcon icon={faPhoneAlt} />}
        />
      ) : (
        <ButtonIcon
          // @ts-ignore
          variant='destructive'
          size='large'
          disabled={
            wsStatus === ReadyState.CONNECTING || wsStatus === ReadyState.CLOSED
          }
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
  wsStatus: ReadyState;
  callStatus?: Connection.State;
  call: () => void;
  hangup: () => void;
  mute: (shouldMute?: boolean) => void;
};
