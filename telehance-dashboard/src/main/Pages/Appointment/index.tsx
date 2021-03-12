import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { Device, Connection } from 'twilio-client';
import useWebSocket from 'react-use-websocket';
import { RouteComponentProps } from 'react-router-dom';
import { consultWebsocketUrl, getTwilioTokenUrl } from 'Api';
import { AppointmentData, TranscriptData, EntityData } from 'Models';
import PatientInfo from 'Components/PatientInfo/PatientInfo';
import Transcript from 'Components/Transcript';
import Assistant from 'Components/Assistant/Assistant';
import CallControls, { Status } from './CallControls';
import EndModal from './EndModal';
import classes from './Appointment.module.css';

const device = new Device();

export default function Appointment(route: RouteComponentProps) {
  const { appointment } = route.location.state as {
    appointment: Omit<AppointmentData, 'doctor'>;
  };

  const [callStatus, setCallStatus] = useState<Status>(Status.Waiting);
  const [connection, setConnection] = useState<Connection>();
  const [transcript, setTranscript] = useState<TranscriptData>([]);
  const [newEntities, setNewEntities] = useState<EntityData[]>();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { lastMessage, getWebSocket } = useWebSocket(consultWebsocketUrl);

  const hangup = useCallback(() => {
    connection?.disconnect();
    device.destroy();
    setTimeout(() => setShowModal(true), 1000);
  }, [connection]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const { idx, block, symptoms: entities, status } = JSON.parse(
        lastMessage.data
      );
      if (idx !== undefined && block) {
        setTranscript((prevTranscript) => {
          const newTranscript = [...prevTranscript];
          newTranscript[idx] = block;
          return newTranscript;
        });
      }
      if (entities && entities.length !== 0) {
        setNewEntities(entities);
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

  function mute(shouldMute?: boolean) {
    connection?.mute(shouldMute);
  }

  return (
    <>
      <div className={classes.container}>
        <div className={classes.content}>
          <section
            className={clsx(classes.main, {
              [classes.sidebarExpanded]: sidebarExpanded,
            })}
          >
            <PatientInfo
              patient={appointment.patient}
              purpose={appointment.purpose}
            >
              <CallControls
                status={callStatus}
                call={call}
                hangup={hangup}
                mute={mute}
              />
            </PatientInfo>
            <Transcript transcript={transcript} />
          </section>
          <Assistant
            consult={appointment}
            newEntities={newEntities}
            action={setSidebarExpanded}
          />
        </div>
      </div>
      <EndModal
        consultId={appointment.consult_id}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
