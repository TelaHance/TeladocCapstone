import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IsDoctor, IsAdmin } from "../../Util/helpers";
import { Jumbotron } from "react-bootstrap";


const Consults = () => {
    return (
        IsAdmin() ?
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
