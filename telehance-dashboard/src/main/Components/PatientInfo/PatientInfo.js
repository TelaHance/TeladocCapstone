import React from 'react';
import classes from './PatientInfo.module.css';

export default function PatientInfo({ patient, purpose }) {
  const { given_name, family_name, picture } = patient;
  return (
    <div className={classes.container}>
      <div className={classes.patient}>
        <img src={picture} className='rounded-circle' width={90} />
        <div>
          <h5>{given_name + ' ' + family_name}</h5>
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
