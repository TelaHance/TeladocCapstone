import React from 'react';
import useSWR from 'swr';
import Spinner from 'Components/Spinner';
import AudioPlayer from './AudioPlayer';
import Controls from './Controls';
import Transcript from 'Components/Transcript';
import Diagnoses from 'Components/Diagnoses/Diagnoses';
import { fetchWithToken, putWithToken } from 'Util/fetch';
import useFinishedTranscriptProps from 'Hooks/useFinishedTranscriptProps';
import { ConsultData, TranscriptData } from 'Models';
import classes from './Consult.module.css';

export default function Consult(props: any) {
  const {
    params: { consultId },
  } = props.match;

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
        <section className={classes.main}>
          {/* TODO: PROFILE PREVIEW COMPONENT HERE */}
          <Controls {...controlsProps} />
          <Transcript {...transcriptProps} />
          <AudioPlayer
            src={`https://s3.us-west-2.amazonaws.com/teleconsults/Recordings/2020/${consult.call_sid}.mp3`} // TODO: REPLACE WITH consult.call_sid and API gateway request
            {...audioPlayerProps}
          />
        </section>
        {consult.question && consult.medical_conditions && consult.symptoms ? (
          <Diagnoses
            question={consult.question}
            medicalConditions={consult.medical_conditions}
            symptoms={consult.symptoms}
            consultId={consult.consult_id}
            startTime={consult.start_time}
          />
        ) : null}
      </div>
    </div>
  );
}
