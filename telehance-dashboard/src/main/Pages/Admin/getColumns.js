import React from 'react';

export function nameFormatter (value) {
    console.log(value);
    return(
        <div>
            <img className={classes['rounded-circle']} src={value.value.value} width="35" alt=""/>
            <span> {value.value.value} {value.value.value} </span>
        </div>
    )
};

export function roleBadge ( value ) {
    const badgeStyles = { color: '#1de9b6', marginLeft: '0.5rem' };
    return(
        <Badge label={value.value} variant="lightest" style={badgeStyles}/>
    );
}
