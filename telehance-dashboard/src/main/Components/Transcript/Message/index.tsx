import React from 'react';
import clsx from 'clsx';
import { RenderElementProps } from 'slate-react';
import { SentimentData } from 'Models';
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
      {element.sentiment ? <Sentiment
        sentiment={element.sentiment as SentimentData}
        className={isSelf ? classes['badges-self'] : classes['badges-other']}
        showOnlyIssues
      /> : null}
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
