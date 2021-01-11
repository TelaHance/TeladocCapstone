import React from 'react';
import { fetchWithToken } from '../../Util/fetch';
import useSWR from 'swr';
import Loading from '../../Components/Loading/Loading';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Transcript from './Transcript/Transcript';
import classes from './Consult.module.css';

function renderLoading(message: string) {
  return (
    <div>
      <Loading />
      <Jumbotron>{message}</Jumbotron>
    </div>
  );
}

export default function Consult(props: any) {
  const {
    params: { consultId },
  } = props.match;

  // Fetch consult from AWS DynamoDB
  let consult = null;
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const { data: response, error, mutate: mutateConsults } = useSWR(
    [
      `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-by-id?consult_id=${consultId}`,
      awsToken,
    ],
    fetchWithToken
  );
  if (response) {
    consult = JSON.parse(response.body) as Consult;
  } else if (error) {
    // TODO: Add user-level error message.
    console.error(error);
  }

  return consult ? (
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
      {consult.transcript && Object.keys(consult.transcript).length > 0 ? (
        <Transcript
          transcript={consult.transcript}
          audioSrc={`https://s3.us-west-2.amazonaws.com/teleconsults/Recordings/2020/${consult.consult_id}.mp3`}
        />
      ) : (
        renderLoading('Rendering Consult')
      )}
    </div>
  ) : (
    renderLoading('Fetching Consult')
  );
}
