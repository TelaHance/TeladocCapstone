import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Jumbotron } from "react-bootstrap";

function isAdmin(role) {
    return (role === 'admin' ? true : false);
}

const Consults = () => {
    const { user } = useAuth0();
    const role = user["https://apollo-dashboard/role"]
    console.log(process.env.REACT_APP_AUTH0_ROLE)
    console.log(user);
    console.log(role);
    return (
        isAdmin(role) ?
        <Jumbotron>
            <h1>I am admin</h1>
        </Jumbotron> 
        : 
        <Jumbotron>
            <h1>I am not admin</h1>
        </Jumbotron>
    );
};

export default Consults;
