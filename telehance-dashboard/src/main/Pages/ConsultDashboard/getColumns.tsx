import React from 'react';
import { useHistory } from 'react-router-dom';
import Sentiment from '../../Components/Sentiment';
import { Avatar, Button } from 'react-rainbow-components';
import classes from './ConsultDashboard.module.css';

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

export function nameFormatter({ value }: any) {
  const fullName = `${value.given_name} ${value.family_name}`
  return (
    <>
      <Avatar
        src={value.picture}
        assistiveText={fullName}
        title={fullName}
        className={classes.avatar}
      />
      <span>
        {fullName}
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
