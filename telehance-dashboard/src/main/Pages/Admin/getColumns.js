import React from 'react';
import classes from '../AppointmentDashboard/AppointmentDashboard.module.css';
import { Badge } from "react-rainbow-components";


export function nameFormatter (value) {
    return(
        <div>
            <img className={classes['avatar']} src={value.row.picture} width="35" alt=""/>
            <span> {value.row.given_name} {value.row.family_name} </span>
        </div>
    )
};

export function roleBadge ( value ) {
    const badgeStyles = { color: '#1de9b6', marginLeft: '0.5rem' };
    return(
        <Badge label={value.row.role} variant="brand" />
    );
}
