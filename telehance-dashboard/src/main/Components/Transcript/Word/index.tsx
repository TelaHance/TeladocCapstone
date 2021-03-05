import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';
import classes from './Word.module.css';

export default function Word({
  isEditing,
  isCurrent,
  startTime,
  onClick,
  attributes,
  children,
}: WordProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (isCurrent) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrent]);

  return (
    <span
      ref={ref}
      className={clsx({
        [classes.readonly]: !isEditing,
        [classes.highlight]: isCurrent,
      })}
      onMouseDown={() => {
        if (!isEditing) onClick(startTime);
      }}
      onDoubleClick={() => {
        if (isEditing) onClick(startTime);
      }}
      {...attributes}
    >
      {children}
    </span>
  );
}

export type WordProps = {
  isEditing: boolean;
  isCurrent: boolean;
  startTime: number;
  onClick: (newTime: number) => void;
  attributes: {
    'data-slate-leaf': true;
  };
  children: any;
};
