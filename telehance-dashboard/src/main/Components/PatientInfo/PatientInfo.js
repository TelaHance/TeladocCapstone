import React from 'react';
import classes from './PatientInfo.module.css';

export default function PatientInfo({ name, picture, purpose }) {
  return (
    <div className={classes.container}>
      <div className={classes.patient}>
        <img src={picture} className='rounded-circle' width={90} />
        <div>
          <h5>{name}</h5>
        </div>
      </div>
      {purpose && (
        <div className={classes.purpose}>
          <h7>Reason For Visit</h7>
          <div>{purpose}</div>
        </div>
      )}
    </div>
  );
}
