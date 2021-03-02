import React from 'react';
import classes from './FeatureBlock.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBriefcaseMedical,
    faStethoscope,
    faNotesMedical
} from '@fortawesome/free-solid-svg-icons';
import {Card} from "./Card/Card";
const FeaturesBlocks = () => {
    return (
        <section className={classes['relative']}>

            <div className={classes['section']} aria-hidden="true"/>
            <div className={classes['background']}/>

            <div className={classes["section-bg"]}>
                <div className="">

                    {/* Section header */}
                    <div className={classes['sectionHeader']}>
                        <h2>How TelaHance works</h2>
                        <p>Teladoc Health is on a mission to address the full spectrum of health and well-being—not only when people are sick but also throughout their lifelong journeys to achieve better health.</p>
                    </div>

                    {/* Items */}
                    <div className={classes['items']}>

                        {/* 1st item */}
                        <Card
                            icon={<FontAwesomeIcon icon={faBriefcaseMedical} transform="shrink-7 up-0.5" className={classes['briefcase']}/>}
                            header="Problematic Consult Identification"
                            subtext="State of the art sentiment analysis to identify hostile and problematic consultations and provide auditors with a visualization of the frequency of these appointments."
                        />
                        <Card
                            icon={<FontAwesomeIcon icon={faNotesMedical} transform="shrink-7 up-0.5" className={classes['briefcase']}/>}
                            header="Automated Medical Scribe"
                            subtext="Doctors are provided a transcript of the consultation and a list of symptoms, risk factors and pre-existing conditions identified during the consultation."
                        />
                        <Card
                            icon={<FontAwesomeIcon icon={faStethoscope} transform="shrink-7" className={classes['briefcase']}/>}
                            header="Intelligent Diagnostic Assistant"
                            subtext="Diagnostic virtual assistant that provides probably patient conditions and guiding questions to further the diagnostic process."
                        />

                    </div>

                </div>
            </div>
        </section>
    );
}

export default FeaturesBlocks;
