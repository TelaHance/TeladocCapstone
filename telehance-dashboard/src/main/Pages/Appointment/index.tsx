import React, { useState, useEffect } from 'react';
import { Device } from 'twilio-client';
import useWebSocket from 'react-use-websocket';
import { useHistory } from 'react-router-dom';
import Spinner from 'Components/Spinner';
import Transcript, { TranscriptData } from 'Components/Transcript';
import { SentimentData } from 'Components/Sentiment';
// import Diagnoses from 'Components/Diagnoses/Diagnoses';
import { fetchWithToken, putWithToken } from 'Util/fetch';
import classes from './Appointment.module.css';
import CallControls from './CallControls';

const device = new Device();

export default function Appointment(props: any) {
  const {
    // params: { consultId, patientId },
    params: { phoneNumber }, // TODO: Replace with above after testing
  } = props.match;

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
      callTo: phoneNumber,
      consult_id: 'test-live-consult',
    };
    device.connect(params);
    setIsCalling(true);
  }

  function hangup() {
    setIsCalling(false);
    device.disconnectAll();
    history.push('/consults');
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
          <CallControls isCalling={isCalling} call={call} hangup={hangup}/>
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
