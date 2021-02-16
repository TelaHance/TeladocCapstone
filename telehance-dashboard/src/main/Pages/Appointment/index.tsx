import React, { useState, useEffect, useMemo } from 'react';
import { Device } from 'twilio-client';
import useWebSocket from 'react-use-websocket';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import Spinner from 'Components/Spinner';
import Transcript from 'Components/Transcript';
import { AppointmentData, TranscriptData } from 'Models';
// import Diagnoses from 'Components/Diagnoses/Diagnoses';
import { fetchWithToken, putWithToken } from 'Util/fetch';
import classes from './Appointment.module.css';
import CallControls from './CallControls';

export default function Appointment(route: RouteComponentProps) {
  const device = useMemo(() => new Device(), []);

  const { appointment } = route.location.state as {
    appointment: Omit<AppointmentData, 'doctor'>;
  };

  const [isCalling, setIsCalling] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptData>([]);

  const history = useHistory();
  useEffect(() => {
    fetch(
      'https://59wncxd6oi.execute-api.us-west-2.amazonaws.com/dev/get-token'
    )
      .then((r) => r.json())
      .then((data) => {
        device.setup(JSON.parse(data).token, { closeProtection: true });
      })
      .catch((err) => console.log(err));
  });

  function call() {
    const params = {
      callTo: `${appointment.patient.phone}`,
      consult_id: 'test-live-consult',
    };
    device.connect(params);
    setIsCalling(true);
  }

  function hangup() {
    setIsCalling(false);
    device.disconnectAll();
    history.push(`/consult/${appointment.consult_id}`);
  }

  const { lastMessage } = useWebSocket(
    'wss://f26oedtlj3.execute-api.us-west-2.amazonaws.com/dev/'
  );

  useEffect(() => {
    console.log(lastMessage);
  }, [lastMessage]);

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <section className={classes.main}>
          {/* TODO: PROFILE PREVIEW COMPONENT HERE */}
          {transcript ? <Transcript transcript={transcript} /> : null}
          <CallControls isCalling={isCalling} call={call} hangup={hangup} />
        </section>
        {/* {consult.question && consult.medical_conditions && consult.symptoms ? (
          <Diagnoses
            question={consult.question}
            medicalConditions={consult.medical_conditions}
            symptoms={consult.symptoms}
            consultId={consult.consult_id}
            startTime={consult.start_time}
          />
        ) : null} */}
      </div>
    </div>
  );
}

export type CallStatus = 'connect' | 'disconnect';
