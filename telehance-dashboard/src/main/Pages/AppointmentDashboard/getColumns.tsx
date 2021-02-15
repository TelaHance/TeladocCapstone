import React from "react";
import {Button} from "react-rainbow-components";
import {RouteComponentProps} from "react-router-dom";
import classes from "./AppointmentDashboard.module.css";

export function purposeFormatter ( value:any ) {
    return(
        <div className="wrapped-purpose">{value.value}</div>
    )
};

export function nameFormatter ( value:any ) {
    return(
        <div>
            <img className={classes['rounded-circle']} src={value.value.picture} width="35" alt=""></img>
            <span> {value.value.given_name} {value.value.family_name} </span>
        </div>
    )
};

export function dateFormatter (value:any) {
    if (typeof value.value === 'string') value.value = parseInt(value.value);
    const start = new Date(value.value);
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

export function buttonFormatter(
    value:any,
    history: RouteComponentProps['history']
) {
    return (
        <Button variant="brand" onClick={() => history.push(`/appointments/${value.value}`)}>
            Start
        </Button>
    );
};

