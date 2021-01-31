import React from 'react';
import clsx from 'clsx';
import { RenderElementProps } from 'slate-react';
import { WordData } from '../Word';
import Sentiment from 'Components/Sentiment';
import classes from './Message.module.css';

export default function Message({
  attributes,
  children,
  element,
  userSpeakerLabel,
}: RenderElementProps & MessageProps) {
  const speaker = element.speaker;
  const isSelf = userSpeakerLabel === speaker;

  return (
    <div className={classes.container}>
      <Sentiment
        sentiment={element.sentiment}
        className={isSelf ? classes['badges-self'] : classes['badges-other']}
        showOnlyIssues
      />
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

export type MessageProps = {
  userSpeakerLabel: string;
};

export type MessageData = {
  type: 'message';
  children: WordData[];
  start: number;
  speaker: string;
  sentiment: number;
  fullText: string;
};
