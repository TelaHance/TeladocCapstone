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

export default function CallControls({
  callState,
  isCalling,
  call,
  hangup,
  mute,
}: CallControlsProps) {
  const [callsDisabled, setCallsDisabled] = useState(
    callState === ReadyState.CONNECTING
  );
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setCallsDisabled(callState === ReadyState.CONNECTING);
  }, [callState]);

  useEffect(() => {
    mute(isMuted);
  }, [isMuted]);

  return (
    <div className={classes.container}>
      {isCalling ? (
        <ButtonIcon
          // @ts-ignore
          variant='destructive'
          size='large'
          disabled={callsDisabled}
          onClick={hangup}
          icon={
            <FontAwesomeIcon icon={faPhoneAlt} className={classes.hangup} />
          }
        />
      ) : (
        <ButtonIcon
          variant='success'
          size='large'
          disabled={callsDisabled}
          onClick={call}
          icon={<FontAwesomeIcon icon={faPhoneAlt} />}
        />
      )}
      {isMuted ? (
        <ButtonIcon
          // @ts-ignore
          variant='destructive'
          size='large'
          disabled={callsDisabled}
          onClick={() => setIsMuted(false)}
          icon={<FontAwesomeIcon icon={faMicrophoneSlash} />}
        />
      ) : (
        <ButtonIcon
          variant='border-filled'
          size='large'
          shaded
          disabled={callsDisabled}
          onClick={() => setIsMuted(true)}
          icon={<FontAwesomeIcon icon={faMicrophone} />}
        />
      )}
    </div>
  );
}

type CallControlsProps = {
  callState: number;
  isCalling: boolean;
  call: () => void;
  hangup: () => void;
  mute: (shouldMute?: boolean) => void;
};
