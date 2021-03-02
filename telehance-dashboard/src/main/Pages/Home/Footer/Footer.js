import React from 'react';
import classes from './Footer.module.css';
const Footer = () =>{
    return(
        <>
        {/* Section header */}
            <div className={classes['section-header']}>
                <h2>Intelligent Diagnosis</h2>
                <p data-aos="zoom-y-out">Real-time symptom and condition recognition improves the accuracy of telemedicine diagnoses
                </p>
                <br/> <br/> <br/>
                <h2>Intelligent Consultations</h2>
                <p data-aos="zoom-y-out">Problematic consult identification improves the quality of telehealth interactions, for both patients and doctors.
                </p>
            </div>
            <div className={classes['footer']}>
                <div className={classes['credText']}>
                    Made by&nbsp;
                    <a className={classes['credLink']} href="https://capstone.cs.ucsb.edu/teams.html">
                        Team SALT
                    </a>
                </div>
            </div>
        </>
    );
};
export default Footer;
