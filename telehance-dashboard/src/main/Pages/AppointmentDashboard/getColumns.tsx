import React from 'react';
import { Button } from 'react-rainbow-components';
import { useHistory } from 'react-router-dom';
import { AppointmentData } from 'Models';
import classes from './AppointmentDashboard.module.css';

export function purposeFormatter(value: any) {
  return <div className={classes['wrapped-purpose']}>{value.value}</div>;
}

export function nameFormatter(value: any) {
  return (
    <div>
      <img
        className={classes['rounded-circle']}
        src={value.value.picture}
        width='35'
        alt=''
      />
      <span>
        {' '}
        {value.value.given_name} {value.value.family_name}{' '}
      </span>
    </div>
  );
}

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
      <span> {date} </span>
      <br />
      <span> {time} </span>
    </div>
  );
}

export function ButtonFormatter(value: any) {
  const history = useHistory();
  const appointment = value.row as AppointmentData;

  return (
    <Button
      label='Start'
      variant='brand'
      onClick={() =>
        history.push({
          pathname: `/appointment/${appointment.consult_id}`,
          state: {
            appointment,
          },
        })
      }
    />
  );
}
