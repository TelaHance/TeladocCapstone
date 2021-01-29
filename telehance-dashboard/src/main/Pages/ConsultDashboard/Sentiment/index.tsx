import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import classes from './Sentiment.module.css';

function getLabel(attribute: string) {
  const lowercase = attribute.toLowerCase();
  const capitalized = lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
  return capitalized.replaceAll('_', ' ');
}

const attributeToProps: {
  [key: string]: { variant: string; className?: string };
} = {
  FLIRTATION: { variant: 'secondary', className: classes.pink },
  THREAT: { variant: 'danger' },
  PROFANITY: { variant: 'secondary', className: classes.orange },
  INSULT: { variant: 'warning' },
  IDENTITY_ATTACK: { variant: 'primary' },
  TOXICITY: { variant: 'secondary', className: classes.purple },
};

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
            <OverlayTrigger
              placement='top'
              overlay={
                <Tooltip id={attribute}>{Math.round(value * 100)}%</Tooltip>
              }
            >
              <Badge {...attributeToProps[attribute]}>
                {getLabel(attribute)}
              </Badge>
            </OverlayTrigger>
          );
        }
      }
      if (elements.length > 0) setDisplayAttributes(elements);
      else setDisplayAttributes(undefined);
    }
  }, [sentiment, threshold]);

  const noIssues = !showOnlyIssues ? (
    <Badge variant='success'>No Issues</Badge>
  ) : null;

  const unrated = !showOnlyIssues ? (
    <Badge variant='secondary'>Unrated</Badge>
  ) : null;

  return (
    <div className={clsx(classes.container, className)}>
      {typeof sentiment === 'object' ? displayAttributes ?? noIssues : unrated}
    </div>
  );
}

type SentimentProps = {
  sentiment: any;
  threshold?: SentimentData;
  showOnlyIssues?: boolean;
  className?: string;
};

export type SentimentData = {
  [key: string]: number;
};
