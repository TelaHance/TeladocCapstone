import React, {useEffect, useState} from "react";
import { Image, Button, Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Device } from 'twilio-client';
import fetch from "isomorphic-fetch"
import {useAuth0} from "@auth0/auth0-react";
import phoneIcon from  "../../assets/phoneIcon.png";

const TwilioCall = ({match}) => {
    const { user } = useAuth0();
    const { sub } = user;
    const { params:{phoneNumber, patientId} } = match;
    useEffect(() => {
        fetch('https://59wncxd6oi.execute-api.us-west-2.amazonaws.com/dev/get-token')
            .then( r => r.json())
            .then(data => {
                Device.setup(JSON.parse(data).token,{closeProtection: true});
            }).catch(err => console.log(err));
        });
    function call() {
        const d = new Date();

        const params = {
            "callTo": phoneNumber,
            "doctor_id": sub.split('|')[1],
            "patient_id": patientId,
            "timestamp":d.getTime()
        };
        Device.connect(params);
    }

    function hangup() {
        Device.disconnectAll();
    }

    return (
        <>
            <h1>Patient Consultation</h1>
            <Container className="mb-5">
                <Row>
                    <Col>
                        <Image
                            width={200}
                            height={200}
                            src={phoneIcon}
                            alt="Profile"
                            rounded
                            fluid
                        />
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col md={{ span: 3, offset: 3 }}>
                        <Button className="call" onClick={call} size="lg" variant="success">Call</Button>
                    </Col>
                    <Col md={{ span: 3, offset: 0 }}>
                         <Button className="hangup" onClick={hangup} size="lg" variant="danger">Hangup</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default TwilioCall;
