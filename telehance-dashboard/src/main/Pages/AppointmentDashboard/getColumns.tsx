import classes from "Pages/AppointmentDashboard/AppointmentDashboard.module.css";
import React from "react";
import {Button} from "react-bootstrap";
import {ColumnDescription} from "react-bootstrap-table-next";
import {RouteComponentProps} from "react-router-dom";
import {ConsultData, UserData} from "Pages/Consult";



const nameFormatter = (cell: UserData, row: ConsultData) => {
    return(
        <div>
            <img className={classes['rounded-circle']} src={cell.picture} width="35" alt=""></img>
            <span> {cell.given_name} {cell.family_name} </span>
        </div>
    )
};

const dateFormatter = (cell: number, row: ConsultData) => {
    if (typeof cell === 'string') cell = parseInt(cell);
    const start = new Date(cell);
    const date = start.toLocaleString('default', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
    });
    const time = start.toLocaleString('default', {
        hour: '2-digit',
        minute:'2-digit',
        hour12: true,
    });
    return(
        <div>
            <span> {date} </span>
            <br/>
            <span> {time} </span>
        </div>
    );
};

const buttonFormatter = (
    cell: any,
    row: ConsultData,
    history: RouteComponentProps['history']
) => {
    return (
        <Button onClick={() => history.push(`/appointments/${row.consult_id}`)}>
            Start
        </Button>
    );
};

const start_date = {
    dataField: 'start_time',
    text: 'Appointment Date',
    formatter: dateFormatter,
    sort: true,
};

const purpose = {
    dataField: 'purpose',
    text: 'Purpose',
};

const doctor = [
    {
        dataField: 'doctor.given_name',
        text: 'Doctor First Name',
        hidden: true,
    },
    {
        dataField: 'doctor.family_name',
        text: 'Doctor Last Name',
        hidden: true,
    },
    {
        dataField: 'doctor',
        text: 'Doctor',
        formatter: nameFormatter,
    },
];

const patient = [
    {
        dataField: 'patient.given_name',
        text: 'Patient First Name',
        hidden: true,
    },
    {
        dataField: 'patient.family_name',
        text: 'Patient Last Name',
        hidden: true,
    },
    {
        dataField: 'patient',
        text: 'Patient',
        formatter: nameFormatter,
    },
];

function viewAppointment(history: RouteComponentProps['history']) {
    return {
        dataField: 'button',
        text: 'Actions',
        formatter: (cell: any, row: any) => buttonFormatter(cell, row, history),
    };
}

export default function getColumns(
    history: RouteComponentProps['history'],
    role: string
): ColumnDescription[] {

    let columns: ColumnDescription[] = [];
    if (role !== 'DOCTOR') {
        columns = columns.concat(doctor);
    }
    if (role !== 'PATIENT') {
        columns = columns.concat(patient);
    }
    columns = columns.concat([start_date]);
    columns = columns.concat([purpose]);
    columns.push(viewAppointment(history));

    return columns;
}
