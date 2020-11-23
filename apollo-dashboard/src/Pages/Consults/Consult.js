import React from "react";
import { Jumbotron } from "react-bootstrap";
import {fetchWithToken} from "../../Util/fetch";
import useSWR from "swr";
import ReactJson from "react-json-view";
import {Container, Col, Row} from 'react-bootstrap';
import TranscriptEditor from "@bbc/react-transcript-editor";
import { TimedTextEditor } from "@bbc/react-transcript-editor/TimedTextEditor";
import DEMO_TRANSCRIPT from "./assets/bbc.json";
import media from "./assets/audio.mp3";



const Consult = ({match}) =>{
    console.log(match)
    const { params: {consultId} } = match;
    const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
    const { data: response, error, mutate: mutateConsults } = useSWR(
        [`https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-by-id?consult_id=${consultId}`, awsToken],
        fetchWithToken
    );
    console.log(response)
    console.log(error)
    let consult = null;
    if (response) {
        consult = JSON.parse(response.body);
    }
    console.log(consult);
    const transcript = require('./assets/transcript.json');
    // const media = require('./assets/audio.mp3');
    var binaryData = [];
    binaryData.push(media);
    console.log(media);
    // const fileURL = window.URL.createObjectURL(new Blob(binaryData, {type: "audio/mp3"}))
    // const fileURL = URL.createObjectURL(media);
    return (
        // <Container className="mb-5">
        //     <Row className="text-left">
        //         <ReactJson src={consult} />
        //     </Row>
        // </Container>
        <Row>
            <Col md={9}>
                <TranscriptEditor
                    transcriptData={transcript}
                    mediaUrl={media}
                    isEditable={true}
                    spellCheck={false}
                    sttJsonType={"amazontranscribe"}
                    mediaType={"audio"}
                />
            </Col>
            <Col>
                Sentiment: {consult ? consult.sentiment : null}
            </Col>
        </Row>
    );
}

export default Consult;