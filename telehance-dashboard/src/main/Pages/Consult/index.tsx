import React, { useState } from 'react';
import useSWR from 'swr';
import Spinner from 'Components/Spinner';
import AudioPlayer from './AudioPlayer';
import Controls from './Controls';
import Transcript, { TranscriptData } from 'Components/Transcript';
import { SentimentData } from 'Components/Sentiment';
import Diagnoses from './Diagnoses/Diagnoses';
import { fetchWithToken, putWithToken } from 'Util/fetch';
import useFinishedTranscriptProps from 'Hooks/useFinishedTranscriptProps';
import classes from './Consult.module.css';

export default function Consult(props: any) {
  const {
    params: { consultId },
  } = props.match;

  const [infermedicaActive, setInfermedicaActive] = useState(false);
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const BASE_URL =
    'https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-by-id';

  const { data: consult, error } = useSWR<ConsultData>(
    [`${BASE_URL}?consult_id=${consultId}`, awsToken],
    fetchWithToken
  );

  function updateTranscript(transcript: TranscriptData | undefined) {
    if (!consult) return;
    const { consult_id } = consult;
    const url = `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/update-transcript-edited?consult_id=${consult_id}`;
    putWithToken(url, awsToken, transcript);
  }

  const {
    transcriptProps,
    controlsProps,
    audioPlayerProps,
  } = useFinishedTranscriptProps(
    updateTranscript,
    consult?.transcript,
    consult?.transcript_edited
  );

  if (error) {
    console.error(error);
    return <h1>Error Loading Consult</h1>;
  }
  if (!consult) return <Spinner />;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <section className={infermedicaActive ? classes.main + ' ' + classes.infermedicaActive : classes.main}>
          <Controls {...controlsProps} />
          <Transcript {...transcriptProps} />
          <AudioPlayer
            src={`https://s3.us-west-2.amazonaws.com/teleconsults/Recordings/2020/${consult.consult_id}.mp3`} // TODO: REPLACE WITH consult.call_sid and API gateway request
            {...audioPlayerProps}
          />
        </section>
        <Diagnoses
          question={consult.question}
          medicalConditions={consult.medical_conditions}
          symptoms={consult.symptoms}
          consultId={consult.consult_id}
          startTime={consult.start_time}
          isLive={false}
          action={setInfermedicaActive}
        />
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
