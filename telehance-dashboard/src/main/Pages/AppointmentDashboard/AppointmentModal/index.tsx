import React, { useState } from 'react';
import { Button } from 'react-rainbow-components';
import AppointmentModal from 'Pages/AppointmentDashboard/AppointmentModal/AppointmentModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcaseMedical } from '@fortawesome/free-solid-svg-icons';
import { addApptUrl } from 'Api';
import { putWithToken } from 'Util/fetch';
import { useAuth0 } from '@auth0/auth0-react';
import classes from './AppointmentModal.module.css';

export default function ScheduleAppointment() {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const awsToken = process.env.REACT_APP_APPOINTMENT_API_KEY;
  const { user } = useAuth0();
  const sub = user ? user.sub.split('|')[1] : 'NULL';
  const onBook = (date: Date, chosenDoc: any, purpose: string) => {
    try {
      putWithToken(addApptUrl, awsToken, {
        start_time: date.valueOf(),
        end_time: date.valueOf() + 3600000,
        purpose: purpose,
        doctor_id: chosenDoc.user_id,
        patient_id: sub,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={classes.container}>
      <Button
        className='buttonStyle'
        onClick={() => setShowAppointmentModal(true)}
      >
        <FontAwesomeIcon icon={faBriefcaseMedical} />
        &nbsp;&nbsp;Schedule Appointment
      </Button>
      <AppointmentModal
        show={showAppointmentModal}
        onConfirm={(date: Date, chosenDoc: any, purpose: string) => {
          onBook(date, chosenDoc, purpose);
          setShowAppointmentModal(false);
        }}
        onClose={() => {
          setShowAppointmentModal(false);
        }}
      />
    </div>
  );
}
