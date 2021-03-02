import React from 'react';
import { useHistory } from 'react-router-dom';
import Sentiment from '../../Components/Sentiment';
import classes from './ConsultDashboard.module.css';
import { Button } from 'react-rainbow-components';

// FORMATTERS

export function dateFormatter(value: any) {
  if (typeof value.value === 'string') value.value = parseInt(value.value);
  const start = new Date(value.value);
  const date = start.toLocaleString('default', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
  const time = start.toLocaleString('default', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return (
    <div className={classes['date']}>
      <p> {date} </p>
      <p> {time} </p>
    </div>
  );
}

export function nameFormatter(cell: any) {
  return (
    <>
      <img
        className={classes.avatar}
        src={cell.value.picture}
        width='31'
        alt=''
      ></img>
      <span>
        {' '}
        {cell.value.given_name} {cell.value.family_name}{' '}
      </span>
    </>
  );
}

export function sentimentFormatter(cell: any) {
  if (cell.value === 'number')
    return (
      <div>
        {' '}
        <span>`${Math.round(cell.value * 100)}%`</span>
      </div>
    );
  return <Sentiment sentiment={cell.value} />;
}

export function ButtonFormatter(cell: any) {
  const history = useHistory();
  return (
    <div className={classes['view-container']}>
      <Button onClick={() => history.push(`/consults/${cell.value}`)}>
        View
      </Button>
    </div>
  );
}
