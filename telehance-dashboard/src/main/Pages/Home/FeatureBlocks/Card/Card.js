import React from 'react';
import classes from '../FeatureBlock.module.css';

export const Card = ({icon, header, subtext}) => {
    return(
        <div className={classes['first-item']}>
            <svg className={classes['first-svg']} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <radialGradient id="gradient2" gradientUnits="userSpaceOnUse"
                                cx="100" cy="100" r="100" fx="100" fy="100"
                                gradientTransform="skewX(10) translate(-32, -5)">
                    <stop offset="0%" stop-color="#4FD1C5" />
                    <stop offset="50%" stop-color="#1ec2f6" />
                    <stop offset="100%" stop-color="#7c41ff" />
                </radialGradient>
                <g fill="none" fillRule="evenodd">
                    <rect className={classes['rect']} width="64" height="64" rx="32" fill="url(#gradient2)" style={{transform: 'translateX(220px);'}}/>
                    {icon}
                </g>
            </svg>
            <h4 className={classes['card-header']}>{header}</h4>
            <p className={classes['card-text']}>{subtext}</p>
        </div>
    )
}
