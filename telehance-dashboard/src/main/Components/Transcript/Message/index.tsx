import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';
import { RenderElementProps } from 'slate-react';
import { SentimentData } from 'Models';
import Sentiment from 'Components/Sentiment';
import classes from './Message.module.css';

const doctorLabels = ['CH_0', 'DOCTOR'];

export default function Message({
  attributes,
  children,
  element,
}: RenderElementProps) {
  const speaker = element.speaker as string;
  const isDoctor = doctorLabels.includes(speaker.toUpperCase());

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Indicates that this is a live message.
    if (element.start === undefined) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [element])

  return (
    <div className={classes.container} ref={ref}>
      {element.sentiment ? (
        <Sentiment
          sentiment={element.sentiment as SentimentData}
          className={isDoctor ? classes['badges-self'] : classes['badges-other']}
          showOnlyIssues
        />
      ) : null}
      <div
        className={clsx(classes.message, {
          [classes.self]: isDoctor,
          [classes.other]: !isDoctor,
        })}
        {...attributes}
      >
        {children}
      </div>
    </div>
  );
}
