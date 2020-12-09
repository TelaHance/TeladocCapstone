import React, { useState } from "react";
import { Jumbotron } from "react-bootstrap";
import {fetchWithToken} from "../../Util/fetch";
import useSWR from "swr";
import ReactJson from "react-json-view";
import {Container, Col, Row} from 'react-bootstrap';
import TranscriptEditor from "@bbc/react-transcript-editor";
import { TimedTextEditor } from "@bbc/react-transcript-editor/TimedTextEditor";
import DEMO_TRANSCRIPT from "./assets/transcript.json";
import DEMO_MEDIA from "./assets/media.m4a";
import Loading from "../../Components/Loading/Loading";

function renderConsult(consult) {
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
                />
            </Col>
            <Col>
                Sentiment: {consult.sentiment}
            </Col>
        </Row>
    )
}

function renderLoading() {
    return (
        <div>
            <Loading></Loading>
            <Jumbotron>Processing Consult</Jumbotron>
        </div>
    )
}

const Consult = (props) =>{
    // console.log(match)
    const { params: {consultId} } = props.match;
    const { data } = props.location;
    // const [consult, setConsult] = useState(data);
    // React.useEffect(() => {
    //     localStorage.setItem("consult", JSON.stringify(consult));
    // }, [consult])
    // React.useEffect(() => {
    //     const storedConsult = localStorage.getItem("consult") || null;
    //     console.log(storedConsult);
    //     if (storedConsult)
    //         setConsult(JSON.parse(storedConsult));
    // }, [])
    // let consult = null;
    // if (!data) {
    //     const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
    //     const { data: response, error, mutate: mutateConsults } = useSWR(
    //         [`https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-by-id?consult_id=${consultId}`, awsToken],
    //         fetchWithToken
    //     );
    //     if (response) {
    //         consult = JSON.parse(response.body);
    //     }
    // } else {
    //     consult = data;
    // }
    const consult = data;


    // console.log(response)
    // console.log(error)
    console.log(props)
    // let consult = null;
   
    console.log(consult);
    return (
        consult ? renderConsult(consult) : renderLoading()
    );
}

export default Consult;