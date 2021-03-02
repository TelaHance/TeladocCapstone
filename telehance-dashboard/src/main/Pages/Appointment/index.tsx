import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Device, Connection } from 'twilio-client';
import useWebSocket from 'react-use-websocket';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { consultWebsocketUrl, getTwilioTokenUrl } from 'Api';
import Transcript from 'Components/Transcript';
import Assistant from 'Components/Assistant/Assistant';
import { AppointmentData, TranscriptData, SymptomData } from 'Models';
// import Diagnoses from 'Components/Diagnoses/Diagnoses';
import classes from './Appointment.module.css';
import CallControls, { Status } from './CallControls';

const device = new Device();

export default function Appointment(route: RouteComponentProps) {
  const { appointment } = route.location.state as {
    appointment: Omit<AppointmentData, 'doctor'>;
  };

  const [callStatus, setCallStatus] = useState<Status>(Status.Waiting);
  const [connection, setConnection] = useState<Connection>();
  const [transcript, setTranscript] = useState<TranscriptData>([]);
  const [newSymptoms, setNewSymptoms] = useState<SymptomData[]>();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const { lastMessage, getWebSocket } = useWebSocket(consultWebsocketUrl);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const data = await (await fetch(getTwilioTokenUrl)).json();
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
      const { idx, block, symptoms, status } = JSON.parse(lastMessage.data);
      if (idx !== undefined && block) {
        setTranscript((prevTranscript) => {
          const newTranscript = [...prevTranscript];
          newTranscript[idx] = block;
          return newTranscript;
        });
      }
      if (symptoms && symptoms.length !== 0) {
        setNewSymptoms(symptoms);
      }
      if (status) {
        setCallStatus(status);
      }
    }
  }, [lastMessage]);

  function call() {
    const conn = device.connect({
      callTo: `${appointment.patient.phone}`,
      consult_id: appointment.consult_id,
    });
    conn.mute(true);
    setConnection(conn);
  }

  function hangup() {
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
        <section
          className={clsx(classes.main, {
            [classes.sidebarExpanded]: sidebarExpanded,
          })}
        >
          {/* TODO: PROFILE PREVIEW COMPONENT HERE */}
          <Transcript transcript={transcript} />
          <CallControls
            status={callStatus}
            call={call}
            hangup={hangup}
            mute={mute}
          />
        </section>
        <Assistant
          consult={{ symptoms: newSymptoms, ...appointment }}
          action={setSidebarExpanded}
          isLive
        />
      </div>
    </div>
  );
}
