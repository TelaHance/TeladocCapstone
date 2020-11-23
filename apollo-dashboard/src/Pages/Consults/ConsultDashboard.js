import React from "react";
import {Col, Container, Jumbotron, Row} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import BootstrapButton from 'react-bootstrap/Button';
import useSWR from "swr";
import ReactJson from "react-json-view";
import {fetchWithToken} from "../../Util/fetch";
import { Link } from 'react-router-dom'

const ConsultDashboard = (props) => {
    const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
    const { data: consultList, error, mutate: mutateConsults } = useSWR(
        ['https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-all', awsToken],
        fetchWithToken
    );
    const dateFormatter = (cell, row) =>{
        const date = new Date(cell * 1000);
        return (
            date.toLocaleString('default', { month: 'long', day: '2-digit', year: 'numeric'})
        );
    };
    const nameFormatter = (cell, row) =>{
        return (
            `${cell.Last_Name}, ${cell.Given_Name}`
        );
    };
    const buttonFormatter = (cell, row) => {
        return <Link to={`/consults/${row.id}`}>View</Link>;
    }
    console.log(consultList)
    console.log(mutateConsults)
    const columns = [{
        dataField: 'id',
        text: 'Consult ID'
    }, {
        dataField: 'created',
        text: 'Appointment Date',
        formatter: dateFormatter
    },{
        dataField: 'Doctor_Full_Name',
        text: 'Doctor Name',
        formatter: nameFormatter
    },{
        dataField: 'Patient_Full_Name',
        text: 'Patient Name',
        formatter: nameFormatter
    },{
        dataField: 'sentiment',
        text: 'Sentiment'
    },{
        dataField: 'button',
        text: 'Actions',
        formatter: buttonFormatter
    }];
    return (
        <Container className="mb-5">
            <h1>Consult Dashboard</h1>
            <BootstrapTable keyField='id' data={ consultList || []} columns={ columns } />
        </Container>
    );
};

export default ConsultDashboard;
