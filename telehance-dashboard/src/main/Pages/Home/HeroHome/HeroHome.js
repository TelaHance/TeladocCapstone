import React, { useState } from 'react';
import classes from './HeroHome.module.css'
import styles from "Components/Nav/Navbar.module.css";
import {useAuth0} from "@auth0/auth0-react";
const HeroHome = () => {
    const { user, loginWithRedirect } = useAuth0();

    return (
        <section className={classes["relative"]}>

            {/* Illustration behind hero content */}
            <div className={classes["illustration"]} aria-hidden="true">
                <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
                            <stop stopColor="#FFF" offset="0%" />
                            <stop stopColor="#EAEAEA" offset="77.402%" />
                            <stop stopColor="#DFDFDF" offset="100%" />
                        </linearGradient>
                    </defs>
                    <g fill="url(#illustration-01)" fillRule="evenodd">
                        <circle cx="1232" cy="128" r="128" />
                        <circle cx="155" cy="443" r="64" />
                    </g>
                </svg>
            </div>
            <div className={classes["hero"]}>
                {/* Hero content */}
                <div>
                    {/* Section header */}
                    <div className={classes["section-header"]}>
                        <h1 data-aos="zoom-y-out">Tela
                            <span className={classes["blue-header"]}>Hance&nbsp;</span></h1>
                        <div>
                            <p className={classes["subsection"]} data-aos="zoom-y-out" data-aos-delay="150">Changing Telemedicine</p>
                            <div className={classes['btn-container']}>
                                { !user &&
                                    <div className={classes["login-button"]} data-aos="zoom-y-out" data-aos-delay="300">
                                        <div>
                                            <a onClick={loginWithRedirect} className={styles.login}>
                                                Log In
                                            </a>
                                        </div>
                                    </div>
                                }
                                <div className={classes["learn-button"]} data-aos="zoom-y-out" data-aos-delay="300">
                                    <div>
                                        <a onClick={loginWithRedirect} className={styles.login}>
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero image */}
                    <div>
                        <div className={classes["heroImageDiv"]} data-aos="zoom-y-out" data-aos-delay="450">
                            <div>
                                <img className={classes["imageStyles"]} src={require('assets/online-doctor-flat-design.jpg')} width="500"  alt="Hero" />
                                <svg className={classes["blueCircle"]} width="768" height="432" viewBox="0 0 768 432" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <defs>
                                        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="hero-ill-a">
                                            <stop stopColor="#FFF" offset="0%" />
                                            <stop stopColor="#EAEAEA" offset="77.402%" />
                                            <stop stopColor="#DFDFDF" offset="100%" />
                                        </linearGradient>
                                        <linearGradient x1="50%" y1="0%" x2="50%" y2="99.24%" id="hero-ill-b">
                                            <stop stopColor="#FFF" offset="0%" />
                                            <stop stopColor="#EAEAEA" offset="48.57%" />
                                            <stop stopColor="#DFDFDF" stopOpacity="0" offset="100%" />
                                        </linearGradient>
                                        <radialGradient cx="21.152%" cy="86.063%" fx="21.152%" fy="86.063%" r="79.941%" id="hero-ill-e">
                                            <stop stopColor="#4FD1C5" offset="0%" />
                                            <stop stopColor="#81E6D9" offset="25.871%" />
                                            <stop stopColor="#338CF5" offset="100%" />
                                        </radialGradient>
                                        <circle id="hero-ill-d" cx="384" cy="216" r="64" />
                                    </defs>
                                    <g fill="none" fillRule="evenodd">
                                        <circle fillOpacity=".04" fill="url(#hero-ill-a)" cx="384" cy="216" r="128" />
                                        <circle fillOpacity=".16" fill="url(#hero-ill-b)" cx="384" cy="216" r="96" />
                                        <g fillRule="nonzero">
                                            <use fill="#000" xlinkHref="#hero-ill-d" />
                                            <use fill="url(#hero-ill-e)" xlinkHref="#hero-ill-d" />
                                        </g>
                                    </g>
                                </svg>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

export default HeroHome;
