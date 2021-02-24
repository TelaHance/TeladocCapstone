import React, { useState } from 'react';
import {
  Lookup,
  Modal,
  Button,
  Textarea,
  DateTimePicker,
  Picklist,
  Option,
} from 'react-rainbow-components';
import useSWR from 'swr';
import { getAllDoctorsUrl } from 'Api';
import { fetchWithToken } from 'Util/fetch';
import classes from './AppointmentModal.module.css';

const AppointmentModal = ({
  show,
  onConfirm,
  onClose,
}: AppointmentModalProps) => {
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [chosenDoc, setChosenDoc] = useState(undefined);
  const [pickListVal, setPickListVal] = useState(undefined);
  const [purpose, setPurpose] = useState('');
  const userToken = process.env.REACT_APP_USER_API_KEY;
  const { data: doctorList } = useSWR<doctor_info[]>(
    [getAllDoctorsUrl, userToken],
    fetchWithToken
  );

  return (
    <Modal
      title='Schedule an Appointment'
      isOpen={show}
      onRequestClose={onClose}
      footer={
        <div className='rainbow-flex rainbow-justify_end'>
          <Button
            form='redux-form-id'
            className='rainbow-m-right_large'
            label='Cancel'
            variant='neutral'
            onClick={onClose}
          />
          &nbsp;&nbsp;&nbsp;
          <Button
            form='redux-form-id'
            label='Schedule'
            variant='brand'
            onClick={() => {
              onConfirm(appointmentDate, chosenDoc, purpose);
            }}
          />
        </div>
      }
    >
      <form
        id='appointment'
        noValidate
        onSubmit={() => {
          onConfirm(appointmentDate, chosenDoc, purpose);
        }}
      >
        <div className='rainbow-flex rainbow-justify_spread'>
          <Picklist
            placeholder='Choose a Doctor'
            onChange={(selectedVal) => {
              const selectedDoc = doctorList?.filter((doc) => {
                return doc.user_id === selectedVal.name;
              });
              // @ts-ignore
              setChosenDoc(selectedDoc[0]);
              // @ts-ignore
              setPickListVal(selectedVal);
            }}
            value={pickListVal}
            label='Select a Doctor'
          >
            <Option name='header' label='Select a Doctor' variant='header' />
            {doctorList &&
              doctorList.map((doctor) => {
                const full =
                  'Dr. ' + doctor.given_name + ' ' + doctor.family_name;
                return (
                  <Option
                    name={doctor.user_id}
                    label={full}
                    icon={
                      <img
                        className={classes['rounded-circle']}
                        src={doctor.picture}
                        width='25'
                        alt=''
                      />
                    }
                  />
                );
              })}
          </Picklist>
          <br />
          <br />
          <DateTimePicker
            label='Select a Date and Time'
            value={appointmentDate}
            onChange={(value) => setAppointmentDate(value)}
            minDate={new Date()}
            maxDate={new Date(2021, 12, 31)}
            formatStyle='large'
          />
        </div>
        <br />
        <Textarea
          label='Reason for Appointment'
          rows={4}
          onChange={(event) => setPurpose(event.target.value)}
          placeholder='Reason'
          bottomHelpText='Please provide your current symptoms and general reason for the Appointment'
          className='rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto'
        />
      </form>
    </Modal>
  );
};
export type AppointmentModalProps = {
  show: boolean;
  onConfirm: (date: Date, stateValue: any, purpose: string) => void;
  onClose: () => void;
};

export type doctor_info = {
  user_id: string;
  family_name: string;
  given_name: string;
  picture: string;
};

export default AppointmentModal;
