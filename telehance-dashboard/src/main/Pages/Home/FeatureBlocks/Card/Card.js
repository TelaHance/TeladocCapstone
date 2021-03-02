import React from 'react';
import classes from '../FeatureBlock.module.css';

export const Card = ({icon, header, subtext}) => {
    return(
        <div className={classes['first-item']}>
            <svg className={classes['first-svg']} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                    <rect className={classes['rect']} width="64" height="64" rx="32" />
                    {icon}
                </g>
            </svg>
            <h4 className={classes['card-header']}>{header}</h4>
            <p className={classes['card-text']}>{subtext}</p>
        </div>
    )
}
