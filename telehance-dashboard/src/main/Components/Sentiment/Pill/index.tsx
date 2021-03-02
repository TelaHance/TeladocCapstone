import React, { useRef } from 'react';
import clsx from 'clsx';
import { Badge, Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import classes from './Pill.module.css';

export function getLabel(attribute: string) {
  const lowercase = attribute.toLowerCase().split('_');
  return lowercase
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const attributeToProps: {
  [key: string]: { variant?: string; className?: string };
} = {
  FLIRTATION: { className: classes.pink },
  IDENTITY_ATTACK: { variant: 'primary', className: classes.blue },
  INSULT: { variant: 'warning', className: classes.yellow },
  PROFANITY: { className: classes.orange },
  THREAT: { variant: 'danger', className: classes.red },
  TOXICITY: { className: classes.purple },
  NO_ISSUES: { variant: 'success', className: classes.green },
  UNRATED: { variant: 'secondary' },
};

export const PillTypes = [
  'FLIRTATION',
  'THREAT',
  'PROFANITY',
  'INSULT',
  'IDENTITY_ATTACK',
  'TOXICITY',
  'NO_ISSUES',
  'UNRATED',
];

export default function Pill({
  attribute,
  value,
  showTooltip = false,
}: PillProps) {
  const props = attributeToProps[attribute];
  if (props === undefined)
    return (
      <Badge pill variant='secondary'>
        {attribute}
      </Badge>
    );

  const { variant, className } = props;
  const pill = (
    <Badge
      pill
      variant={variant ?? 'secondary'}
      className={clsx(className, classes.badge)}
    >
      {getLabel(attribute)}
    </Badge>
  );

  if (!showTooltip) return pill;

  return (
    <OverlayTrigger
      placement='top'
      overlay={
        <Tooltip id={attribute}>
          {typeof value === 'number' ? `${Math.round(value * 100)}%` : value}
        </Tooltip>
      }
    >
      {pill}
    </OverlayTrigger>
  );
}

type PillProps = {
  attribute: string;
  value?: number;
  showTooltip?: boolean;
};