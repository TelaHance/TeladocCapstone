import React from 'react';
import { fetchWithToken, putWithToken } from '../../../Util/fetch';
import useSWR from 'swr';
import Spinner from '../../../Components/Spinner';
import Transcript, { TranscriptData } from './Transcript';
import classes from './Consult.module.css';

export default function Consult(props: any) {
  const {
    params: { consultId },
  } = props.match;

  // Fetch consult from AWS DynamoDB
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const { data: consult, error, mutate: setConsult } = useSWR<ConsultData>(
    [
      `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-by-id?consult_id=${consultId}`,
      awsToken,
    ],
    fetchWithToken
  );
  if (error) {
    // TODO: Add user-level error message
    console.error(error);
  }

  function updateTranscript(transcript: TranscriptData | undefined) {
    if (!consult) return;
    const { consult_id } = consult;
    const token = process.env.REACT_APP_UPDATE_TRANSCRIPT_API_KEY;
    const url = `https://c1b65tcl64.execute-api.us-west-2.amazonaws.com/default/update-edited-transcript?consult_id=${consult_id}`;
    putWithToken(url, token, transcript);
    const newConsult = { ...consult, transcript_edited: transcript };
    setConsult(newConsult);
  }

  if (!consult) return <Spinner />;

  return (
    <div className={classes.container}>
      <div>
        <h1>
          Consult Between Doctor {consult.doctor.given_name}{' '}
          {consult.doctor.family_name} and Patient {consult.patient.given_name}{' '}
          {consult.patient.family_name}
        </h1>
        <h2>
          {new Date(Number(consult.timestamp)).toLocaleString('default', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          })}
        </h2>
      </div>
      <Transcript
        audioSrc={`https://s3.us-west-2.amazonaws.com/teleconsults/Recordings/2020/${consult.consult_id}.mp3`}
        transcript={consult.transcript}
        transcriptEdited={consult.transcript_edited}
        updateTranscript={updateTranscript}
      />
    </div>
  );
}

export type UserData = {
  given_name: string;
  family_name: string;
  user_id: string;
};

export type ConsultData = {
  consult_id: string;
  doctor: UserData;
  patient: UserData;
  sentiment?: number;
  timestamp: number;
  transcript: TranscriptData;
  transcript_edited?: TranscriptData;
};
