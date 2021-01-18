import React from 'react';
import { ContentState } from 'draft-js';

type WordProps = {
  contentState: ContentState
  entityKey: string;
  children: React.ReactChildren;
}

export default function Word({contentState, entityKey, children}: WordProps) {
  const data = entityKey ? contentState.getEntity(entityKey).getData() : {};
  return (
    <span
      data-start={data.start}
      data-end={data.end}
      data-entity-key={data.key}
      className='Word'
    >
      {children}
    </span>
  );
}
