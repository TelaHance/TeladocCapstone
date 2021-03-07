import React from 'react';
import { UserData } from 'src/main/Models';
import { Avatar } from 'react-rainbow-components';
import classes from './PatientInfo.module.css';

export default function PatientInfo({
  patient,
  purpose,
  children,
}: PatientInfoProps) {
  const { given_name, family_name, picture } = patient;
  const fullName = `${given_name} ${family_name}`;
  return (
    <div className={classes.container}>
      <div className={classes.patient}>
        <Avatar
          src={picture}
          assistiveText={fullName}
          title={fullName}
        />
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
};
