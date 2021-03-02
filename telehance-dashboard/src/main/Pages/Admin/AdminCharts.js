import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircle
} from '@fortawesome/free-solid-svg-icons';
import {
    Card,
    Dataset,
    Chart,
    MultiSelect,
    Picklist,
    Option,
} from 'react-rainbow-components';
import classes from './Admin.module.css';
import {getLabel} from "Components/Sentiment/Pill";
export const AdminCharts = ({ consults }) => {
    const [chosenDoc, setChosenDoc] = useState('Tanay Komarlu');
    const [chosenDocVal, setChosenDocVal] = useState('Tanay Komarlu');
    const [avgListVal, setAvgListVal] = useState([
        { label: 'Toxicity', name: 'TOXICITY' },{ label: 'Insult', name: 'INSULT' },{ label: 'Flirtation', name: 'FLIRTATION' },
    ]);
    const [avgDatasets, setAvgDatasets] = useState([]);
    const [docDatasets, setDocDatasets] = useState([]);
    const categories = [
        'FLIRTATION',
        'THREAT',
        'PROFANITY',
        'INSULT',
        'IDENTITY_ATTACK',
        'TOXICITY',
    ];
    useEffect(() => {
        let newDatasets = [];
        for (let i = 0; i < avgListVal.length; i++) {
            const values =
                typeof consults !== 'undefined'
                    ? Object.values(consults.platformAverages)
                        .reverse()
                        .map(function (sentiment) {
                            return 100 * sentiment[avgListVal[i].name];
                        })
                    : [];
            const bgColor = {
                FLIRTATION: '#e83e8c',
                THREAT: '#dc3545',
                PROFANITY: '#e65100',
                INSULT: '#d6cd00',
                IDENTITY_ATTACK: '#007bff',
                TOXICITY: '#6f42c1',
            };
            newDatasets.push({
                title: avgListVal[i].label,
                borderColor: bgColor[avgListVal[i].name],
                values: values,
            });
        }
        setAvgDatasets(newDatasets);
    }, [avgListVal, consults]);
    const renderDataset = (datasets) => {
        return datasets.map(({ title, values, borderColor }) => (
            <Dataset
                key={title}
                title={title}
                values={values}
                borderColor={borderColor}
                backgroundColor={borderColor}
            />
        ));
    };
    useEffect(() => {
        let newDatasets = [];
        if(typeof consults !== 'undefined') {
            for (let i = 0; i < categories.length; i++) {
                const values = Object.values(consults.doctorAverage[chosenDoc].sentiment[categories[i]])
                    .reverse()
                    .map(function (sentiment) {
                        return 100 * sentiment;
                    });
                const bgColor = {
                    FLIRTATION: '#e83e8c',
                    THREAT: '#dc3545',
                    PROFANITY: '#e65100',
                    INSULT: '#d6cd00',
                    IDENTITY_ATTACK: '#007bff',
                    TOXICITY: '#6f42c1',
                };
                newDatasets.push({
                    title: getLabel(categories[i]),
                    borderColor: bgColor[categories[i]],
                    values: values,
                });
            }
            setDocDatasets(newDatasets);
        }
    }, [chosenDocVal, consults]);
    (typeof consults !== "undefined") ? console.log(Object.keys(consults.platformAverages).reverse()) : console.log('hell');
    const docLabels =
        typeof consults !== 'undefined'
            ? Object.keys(consults.doctorAverage[chosenDoc].sentiment['TOXICITY']).reverse()
            : [];
    const avgLabels =
        typeof consults !== 'undefined'
            ? Object.keys(consults.platformAverages).reverse()
            : [];
    const docGraphTitle = "Dr. " + chosenDoc.split(" ")[1] + '\'s Average Consult Ratings';
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                    },
                },
            ],
        },
    };
    return (
        <div className={classes['flexContainer']}>
            <div>
                <MultiSelect
                    onChange={(selectedVal) => {
                        setAvgListVal(selectedVal);
                    }}
                    value={avgListVal}
                    label='Select a Toxicity Label'
                    className={classes['picklist']}
                    showCheckbox
                    variant='chip'
                >
                    <Option
                        name='header'
                        label='Select Sentiment Categories'
                        variant='header'
                    />
                    <Option label={'Toxicity'} name={'TOXICITY'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#532197' }}/>}/>
                    <Option label={'Profanity'} name={'PROFANITY'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#e65100' }}/>}/>
                    <Option label={'Insult'} name={'INSULT'} icon={<FontAwesomeIcon icon={faCircle}style={{ color: '#d6cd00' }} />}/>
                    <Option label={'Flirtation'} name={'FLIRTATION'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#e83e8c' }}/>}/>
                    <Option label={'Threat'} name={'THREAT'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#dc3545' }}/>}/>
                    <Option label={'Identity Attack'} name={'IDENTITY_ATTACK'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#007bff' }}/>}/>
                </MultiSelect>
                <Card title='Average TelaHance Consult Ratings' className={classes.card}>
                    <Chart labels={avgLabels} type='line' options={options}>
                        {renderDataset(avgDatasets)}
                    </Chart>
                </Card>
            </div>
            <div>
                <Picklist
                    placeholder={chosenDocVal}
                    onChange={(selectedVal) => {
                        setChosenDoc(selectedVal.label);
                        setChosenDocVal(selectedVal);
                    }}
                    value={chosenDocVal}
                    label='Select a Doctor'
                    className={classes['picklist']}
                >
                    <Option name='header' label='Select a Doctor' variant='header' />
                    {consults &&
                    Object.values(consults.doctorAverage).map((doctor) => {
                        return (
                            <Option
                                name={doctor.fullName}
                                label={doctor.fullName}
                                icon={
                                    <img
                                        className={classes['rounded-circle']}
                                        src={doctor.picture}
                                        width='25'
                                        alt=''
                                    />
                                }
                            />
                        );
                    })}
                </Picklist>
                <Card title={docGraphTitle} className={classes.card}>
                    <Chart labels={docLabels} type='bar' options={options}>
                        {renderDataset(docDatasets)}
                    </Chart>
                </Card>
            </div>
        </div>
    );
};
