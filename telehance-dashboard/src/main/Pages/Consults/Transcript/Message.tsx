import React from 'react';
import clsx from 'clsx';
import { RenderElementProps } from 'slate-react';
import classes from '../Transcript.module.css';

type MessageProps = {
  userSpeakerLabel: string;
};

export default function Message({
  attributes,
  children,
  element,
  userSpeakerLabel,
}: RenderElementProps & MessageProps) {
  const speaker = element.speaker;
  const isSelf = userSpeakerLabel === speaker;

  return (
    <div className={classes['message-container']}>
      <div
        className={clsx(classes.message, {
          [classes.self]: isSelf,
          [classes.other]: !isSelf,
        })}
        {...attributes}
      >
        {children}
      </div>
    </div>
  );
}
