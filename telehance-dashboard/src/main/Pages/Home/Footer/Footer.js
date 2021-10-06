import React from 'react';
import classes from './Footer.module.css';
import TeladocLogo from '../../../assets/Teladoc.svg';
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
                    <a className={classes['credLink']} href="https://capstone.cs.ucsb.edu/past21.html#team4">
                        Team SALT
                    </a>
                </div>
                <div className={classes['collab']}>
                    Made in collaboration with
                    <img className={classes['logo']} src={TeladocLogo} alt="React Logo" />
                </div>
                <ul className={classes['socials']}>
                    <li>
                        <a href="https://github.com/TelaHance/TeladocCapstone" className={classes['github']} aria-label="Github">
                            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
};
export default Footer;
