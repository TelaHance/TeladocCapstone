import React from 'react';
import classes from './FeatureBlock.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBriefcaseMedical
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
                            icon={<FontAwesomeIcon icon={faBriefcaseMedical} transform="shrink-8 up-1" className={classes['briefcase']}/>}
                            header="Condition Identification"
                            subtext="Telahance assists doctors by identifying potential patient conditions."
                        />

                    </div>

                </div>
            </div>
        </section>
    );
}

export default FeaturesBlocks;
