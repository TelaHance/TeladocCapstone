import React, { useState } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';
import Spinner from 'Components/Spinner';
import AudioPlayer from './AudioPlayer';
import Controls from './Controls';
import Transcript from 'Components/Transcript';
import Assistant from 'Components/Assistant/Assistant';
import Profile from 'Components/PatientInfo/PatientInfo';
import { getConsultUrl, updateTranscriptUrl } from 'Api';
import { fetchWithToken, putWithToken } from 'Util/fetch';
import useFinishedTranscriptProps from 'Hooks/useFinishedTranscriptProps';
import { ConsultData, TranscriptData } from 'Models';
import classes from './Consult.module.css';

export default function Consult(props: any) {
  const {
    params: { consultId },
  } = props.match;

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;

  const { data: consult, error } = useSWR<ConsultData>(
    [getConsultUrl({ consult_id: consultId }), awsToken],
    fetchWithToken
  );

  function updateTranscript(transcript: TranscriptData | undefined) {
    if (!consult) return;
    const { consult_id } = consult;
    putWithToken(updateTranscriptUrl({ consult_id }), awsToken, transcript);
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
        
        <section
          className={clsx(classes.main, {
            [classes.sidebarExpanded]: sidebarExpanded,
          })}
        >
          <Profile 
            name={consult.patient.given_name + " " + consult.patient.family_name}
            picture={consult.patient.picture}
            purpose={consult.purpose}
          />
          <Controls {...controlsProps} />
          <Transcript {...transcriptProps} />
          <AudioPlayer
            src={`https://s3.us-west-2.amazonaws.com/teleconsults/Recordings/${new Date(
              consult.start_time
            ).getFullYear()}/${consult.call_sid}.mp3`}
            {...audioPlayerProps}
          />
        </section>
        <Assistant consult={consult} action={setSidebarExpanded} />
      </div>
    </div>
  );
}
