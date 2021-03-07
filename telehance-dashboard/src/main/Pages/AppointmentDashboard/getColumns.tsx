import React from 'react';
import { Avatar, Button } from 'react-rainbow-components';
import { useHistory } from 'react-router-dom';
import { AppointmentData } from 'Models';
import classes from './AppointmentDashboard.module.css';

export function purposeFormatter({ value }: any) {
  return <p className={classes.purpose}>{value}</p>;
}

export function nameFormatter({ value }: any) {
  const fullName = `${value.given_name} ${value.family_name}`
  return (
    <>
      <Avatar src={value.picture} assistiveText={fullName} title={fullName} className={classes.avatar}/>
      {/* <img className={classes.avatar} src={value.picture} width='35' alt='' /> */}
      <span className={classes.name}>
        {fullName}
      </span>
    </>
  );
}

export function dateFormatter({ value }: any) {
  if (typeof value === 'string') value = parseInt(value);
  const start = new Date(value);
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
    <div className={classes.date}>
      <p> {date} </p>
      <p> {time} </p>
    </div>
  );
}

export function ButtonFormatter(value: any) {
  const history = useHistory();
  const appointment = value.row as AppointmentData;

  return (
    <div className={classes.start}>
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
    </div>
  );
}
