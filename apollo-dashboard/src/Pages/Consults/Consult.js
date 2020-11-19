import React from "react";
import { Jumbotron } from "react-bootstrap";
const Consult = ({match}) =>{
    console.log(match)
    const { params: {consultId} } = match;
    return (
        <Jumbotron>
            <h1>Individual Consult Page for {consultId}</h1>
        </Jumbotron>
    );
}

export default Consult;