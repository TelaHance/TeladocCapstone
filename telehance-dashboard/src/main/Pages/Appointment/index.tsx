import React, { useState, useEffect } from 'react';
import { Device, Connection } from 'twilio-client';
import useWebSocket from 'react-use-websocket';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import Spinner from 'Components/Spinner';
import Transcript from 'Components/Transcript';
import { AppointmentData, TranscriptData, SymptomData } from 'Models';
// import Diagnoses from 'Components/Diagnoses/Diagnoses';
import classes from './Appointment.module.css';
import CallControls from './CallControls';

const device = new Device();
const tokenURL =
  'https://59wncxd6oi.execute-api.us-west-2.amazonaws.com/dev/get-token';
const socketURL = 'wss://f26oedtlj3.execute-api.us-west-2.amazonaws.com/dev/';

export default function Appointment(route: RouteComponentProps) {
  const { appointment } = route.location.state as {
    appointment: Omit<AppointmentData, 'doctor'>;
  };

  const [connection, setConnection] = useState<Connection>();
  const [isCalling, setIsCalling] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptData>([]);
  const [newSymptoms, setNewSymptoms] = useState<SymptomData[]>();

  const { lastMessage, readyState, getWebSocket } = useWebSocket(socketURL);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const data = await (await fetch(tokenURL)).json();
      const { token } = JSON.parse(data);
      device.setup(token, { closeProtection: true });
    })();
    device.on('disconnect', hangup);
    return () => {
      getWebSocket()?.close();
    };
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const { idx, block, symptoms } = JSON.parse(lastMessage.data);
      setTranscript((prevTranscript) => {
        const newTranscript = [...prevTranscript];
        newTranscript[idx] = block;
        return newTranscript;
      });
      if (symptoms.length !== 0) {
        setNewSymptoms(symptoms);
      }
    }
    console.log(lastMessage);
  }, [lastMessage]);

  function call() {
    setConnection(
      device.connect({
        callTo: `${appointment.patient.phone}`,
        consult_id: appointment.consult_id,
      })
    );
    setIsCalling(true);
  }

  function hangup() {
    setIsCalling(false);
    connection?.disconnect();
    device.destroy();
    // history.push(`/consult/${appointment.consult_id}`);
  }

  function mute(shouldMute?: boolean) {
    connection?.mute(shouldMute);
  }

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <section className={classes.main}>
          {/* TODO: PROFILE PREVIEW COMPONENT HERE */}
          {transcript ? <Transcript transcript={transcript} /> : null}
          <CallControls
            callState={readyState}
            isCalling={isCalling}
            call={call}
            hangup={hangup}
            mute={mute}
          />
        </section>
        <Assistant
          consult={consult}
          isLive
          action={setInfermedicaActive}
        />
      </div>
    </div>
  );
}
