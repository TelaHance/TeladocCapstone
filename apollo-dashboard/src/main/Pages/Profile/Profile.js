import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Container, Col, Badge } from "react-bootstrap";
import ReactJson from "react-json-view";
import useSWR from "swr";
import {fetchWithUser} from "../../Util/fetch";
const Profile = () => {
    const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
    const { user } = useAuth0();
    const { name, picture, email, sub} = user;
    const { data: roleInfo} = useSWR(
        ["https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id", awsToken, 'POST', sub.split('|')[1]],
        fetchWithUser);
    return (
        <Container className="mb-5">
            <Row className="align-items-center profile-header mb-5 text-center text-md-left">
                <Col md={2}>
                    <img
                        src={picture}
                        alt="Profile"
                        className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                    />
                </Col>
                <Col md>
                    <h2>{name}</h2>
                    <p className="lead text-muted">{email}</p>
                    { roleInfo ?
                        <Badge variant="info">{JSON.parse(roleInfo.body).role}</Badge>:
                        <span>Loading role...</span>
                    }
                </Col>
            </Row>
            <Row className="text-left">
                <ReactJson src={user} />
            </Row>
        </Container>
    );
};

export default Profile;
