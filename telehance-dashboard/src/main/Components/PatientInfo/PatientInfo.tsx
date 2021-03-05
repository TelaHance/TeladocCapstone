import React from 'react';
import { UserData } from 'src/main/Models';
import classes from './PatientInfo.module.css';

export default function PatientInfo({
  patient,
  purpose,
  children,
}: PatientInfoProps) {
  const { given_name, family_name, picture } = patient;
  return (
    <div className={classes.container}>
      <div className={classes.patient}>
        <img src={picture} className='rounded-circle' width={90} />
        <section>
          <h4>{given_name + ' ' + family_name}</h4>
          {children}
        </section>
      </div>
      {purpose && (
        <div className={classes.purpose}>
          <h6>Reason For Visit</h6>
          <div>{purpose}</div>
        </div>
      )}
    </div>
  );
}

type PatientInfoProps = {
  patient: UserData;
  purpose: string;
  children?: React.ReactNode;
}