import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Pill from './Pill';
import classes from './Sentiment.module.css';

const DefaultThreshold = {
  FLIRTATION: 0.75,
  THREAT: 0.75,
  PROFANITY: 0.75,
  INSULT: 0.75,
  IDENTITY_ATTACK: 0.75,
  TOXICITY: 0.75,
};

// PRIMARY FUNCTION

export default function Sentiment({
  sentiment,
  threshold = DefaultThreshold,
  showOnlyIssues,
  className,
}: SentimentProps) {
  const [displayAttributes, setDisplayAttributes] = useState<JSX.Element[]>();

  useEffect(() => {
    const elements = [];
    if (typeof sentiment === 'object') {
      const attributes = Object.entries(sentiment as SentimentData).sort(
        (a, b) => b[1] - a[1]
      );

      for (const [attribute, value] of attributes) {
        if (value >= threshold[attribute]) {
          elements.push(
            <Pill
              key={attribute}
              attribute={attribute}
              value={value}
              showTooltip
            />
          );
        }
      }
      if (elements.length > 0) setDisplayAttributes(elements);
      else setDisplayAttributes(undefined);
    }
  }, [sentiment, threshold]);

  return (
    <div className={clsx(classes.container, className)}>
      {typeof sentiment !== 'object' ? (
        <Pill attribute='UNRATED' />
      ) : (
        displayAttributes ??
        (!showOnlyIssues ? <Pill attribute='NO_ISSUES' /> : null)
      )}
    </div>
  );
}

type SentimentProps = {
  sentiment: any;
  threshold?: SentimentData;
  showOnlyIssues?: boolean;
  hideTooltip?: boolean;
  className?: string;
};

export type SentimentData = {
  [key: string]: number;
};
