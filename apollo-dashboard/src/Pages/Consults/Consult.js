import React from "react";
import {fetchWithToken} from "../../Util/fetch";
import useSWR from "swr";
import {Col, Row} from 'react-bootstrap';
import TranscriptEditor from "@bbc/react-transcript-editor";
import DEMO_TRANSCRIPT from "./assets/transcript.json";
import DEMO_MEDIA from "./assets/media.m4a";



const Consult = ({match}) =>{
    const { params: {consultId} } = match;
    const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
    const { data: response, error, mutate: mutateConsults } = useSWR(
        [`https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-by-id?consult_id=${consultId}`, awsToken],
        fetchWithToken
    );
    let consult = null;
    if (response) {
        consult = JSON.parse(response.body);
    }
    var binaryData = [];
    binaryData.push(DEMO_MEDIA);
    return (
        <Row>
            <Col md={9}>
                <TranscriptEditor
                    transcriptData={DEMO_TRANSCRIPT}
                    mediaUrl={DEMO_MEDIA}
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