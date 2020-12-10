import React from "react";
import {fetchWithToken} from "../../Util/fetch";
import useSWR from "swr";
import {Container, Col, Row, Badge} from 'react-bootstrap';
import TranscriptEditor from "@bbc/react-transcript-editor";
import DEMO_TRANSCRIPT from "./assets/transcript.json";
import DEMO_MEDIA from "./assets/media.m4a";
import Loading from "../../Components/Loading/Loading";

function renderConsult(consult) {
    return (
        <Container>
            <h1>
                Consult Between Doctor {consult.doctor.given_name} {consult.doctor.family_name} and
                 Patient {consult.patient.given_name} {consult.patient.family_name}
            </h1>
            <h2>
                {new Date(consult.timestamp).toLocaleString('default', { month: 'long', day: '2-digit', year: 'numeric'})}
            </h2>
            {consult.transcript && Object.keys(consult.transcript).length > 0 ? 
            renderTranscript(consult) : renderLoading("Processing Consult")}
        </Container>
    )
}

function renderTranscript(consult) {
    let textColor = '#FF0000'; // red text
    if (consult.sentiment > 0.7) {
        textColor = '#00FF00'; // green text
    } else if (consult.sentiment > 0.4) {
        textColor = '#ffff00'; // yellow text
    }
    return (
        <Row>
            <Col md={9}>
                <TranscriptEditor
                    transcriptData={JSON.parse(consult.transcript)}
                    mediaUrl={`https://s3.us-west-2.amazonaws.com/teleconsults/Recordings/2020/${consult.consult_id}.mp3`}
                    isEditable={true}
                    spellCheck={false}
                    sttJsonType={"amazontranscribe"}
                    mediaType={"audio"}
                    title={consult.consult_id}
                />
            </Col>
            <Col>
                <Badge variant="info" style={{color: textColor, backgroundColor: '#C0C0C0'}}>
                    Sentiment: {consult.sentiment}
                </Badge>
            </Col>
        </Row>
    )
}

function renderLoading(message) {
    return (
        <div>
            <Loading></Loading>
            <Jumbotron>{message}</Jumbotron>
        </div>
    )
}

const Consult = (props) =>{
    const { params: {consultId} } = props.match;
    let consult = null;
    const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
    const { data: response, error, mutate: mutateConsults } = useSWR(
        [`https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-by-id?consult_id=${consultId}`, awsToken],
        fetchWithToken
    );
    if (response) {
        consult = JSON.parse(response.body);
    } else if (error) {
        console.error(error);
    }
    return (
        consult ? renderConsult(consult) : renderLoading("Loading Consult")
    );
}

export default Consult;