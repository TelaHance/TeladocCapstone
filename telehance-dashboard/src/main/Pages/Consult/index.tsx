import React from 'react';
import { fetchWithToken, putWithToken } from 'Util/fetch';
import useSWR from 'swr';
import Spinner from 'Components/Spinner';
import Transcript, { TranscriptData } from './Transcript';
import { SentimentData } from 'Components/Sentiment';
import Diagnoses from './Diagnoses/Diagnoses';
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
    const url = `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/update-transcript-edited?consult_id=${consult_id}`;
    putWithToken(url, awsToken, transcript);
    const newConsult = { ...consult, transcript_edited: transcript };
    setConsult(newConsult);
  }

  if (!consult) return <Spinner />;
  return (
    <div className={classes.container}>
      {/* <div>
        <h1>
          Consult Between Doctor {consult.doctor.given_name}{' '}
          {consult.doctor.family_name} and Patient {consult.patient.given_name}{' '}
          {consult.patient.family_name}
        </h1>
        <h2>
          {new Date(consult.start_time).toLocaleString('default', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          })}
        </h2>
      </div> */}
      <div className={classes.content}>
        <Transcript
          audioSrc={`https://s3.us-west-2.amazonaws.com/teleconsults/Recordings/2020/${consult.consult_id}.mp3`}  // TODO: REPLACE WITH consult.call_sid
          transcript={consult.transcript}
          transcriptEdited={consult.transcript_edited}
          updateTranscript={updateTranscript}
        />
        { consult.question && consult.medical_conditions && consult.symptoms ?
          <Diagnoses 
            question={consult.question}
            medicalConditions={consult.medical_conditions}
            symptoms={consult.symptoms}
          />
         : null }
      </div>
    </div>
  );
}

export type UserData = {
  user_id: string;
  given_name: string;
  family_name: string;
  picture?: string;
};

export type MedicalConditionData = {
  common_name: string;
  id: string;
  name: string;
  probability: number;
};

export type SymptomData = {
  choice_id: string;
  common_name: string;
  id: string;
  name: string;
  type: string;
};

export type ConsultData = {
  consult_id: string;
  doctor: UserData;
  patient: UserData;
  sentiment?: SentimentData;
  start_time: number;
  end_time: number;
  transcript: TranscriptData;
  medical_conditions: MedicalConditionData[];
  question: string;
  symptoms: SymptomData[];
  transcript_edited?: TranscriptData;
};
