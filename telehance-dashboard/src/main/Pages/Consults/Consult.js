import React from "react";
import {fetchWithToken} from "../../Util/fetch";
import useSWR from "swr";
import {Container, Col, Row, Badge} from 'react-bootstrap';
import TranscriptEditor from "@bbc/react-transcript-editor";
import Loading from "../../Components/Loading/Loading";
import Jumbotron from "react-bootstrap/Jumbotron";

function renderConsult(consult) {
    return (
        <Container>
            <h1>
                Consult Between Doctor {consult.doctor.given_name} {consult.doctor.family_name} and
                 Patient {consult.patient.given_name} {consult.patient.family_name}
            </h1>
            <h2>
                {new Date(Number(consult.timestamp)).toLocaleString('default', { month: 'long', day: '2-digit', year: 'numeric'})}
            </h2>
            {consult.transcript && Object.keys(consult.transcript).length > 0 ?
            renderTranscript(consult) : renderLoading("Processing Consult")}
        </Container>
    )
}

function renderTranscript(consult) {
    let textColor = '#00ed00'; // green text
    if (consult.sentiment > 0.7) {
        textColor = '#ff0600'; // red text
    } else if (consult.sentiment > 0.4) {
        textColor = '#d6cd00'; // yellow text
    }
    return (
        <Row>
            <Col md="10">
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
            <Col md="2">
                <h3>
                    <Badge variant="info" style={{color: textColor, backgroundColor: 'rgba(0,0,0,1)'}}>
                        Problematic Consult Rating: {consult.sentiment}
                    </Badge>
                </h3>
            </Col>
        </Row>
    )
}

function renderLoading(message) {
    return (
        <div>
            <Loading/>
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
