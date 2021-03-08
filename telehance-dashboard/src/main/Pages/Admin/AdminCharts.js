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
import {bgColor, categories} from "Pages/Admin/AdminConstants";
export const AdminCharts = ({ consults }) => {
    const [chosenDoc, setChosenDoc] = useState('Tanay Komarlu');
    const [chosenDocVal, setChosenDocVal] = useState({
        icon: <img
            className={classes['rounded-circle']}
            src='https://lh5.googleusercontent.com/-nWGfFsvI9FU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmM4LfRfQZBBou_hOJV_eBkkPlFdQ/s96-c/photo.jpg'
            width='25'
            alt=''
        />,
        label: "Tanay Komarlu",
        name: "Tanay Komarlu",
    });
    const [avgListVal, setAvgListVal] = useState([
        { label: 'Toxicity', name: 'TOXICITY' },{ label: 'Insult', name: 'INSULT' },{ label: 'Flirtation', name: 'FLIRTATION' },
    ]);
    const [chosenDocSentVal, setChosenDocSentVal] = useState({ label: 'Toxicity', name: 'TOXICITY' });
    const [avgDatasets, setAvgDatasets] = useState([]);
    const [docDatasets, setDocDatasets] = useState([]);

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
            let values = Object.values(consults.doctorAverages.filter((doctor) =>{
                return doctor.user.given_name + ' ' + doctor.user.family_name === chosenDoc
            })[0].averages)
                .reverse()
                .map(sentiment => 100*sentiment[chosenDocSentVal.name]);
            newDatasets.push({
                title: "Dr. " + chosenDoc.split(" ")[1],
                borderColor: '#24b71a',
                values: values,
            });
            values = Object.values(consults.platformAverages)
                        .reverse()
                        .map(sentiment => 100*sentiment[chosenDocSentVal.name]);
            newDatasets.push({
                title: 'Average Doctor',
                borderColor: bgColor[chosenDocSentVal.name],
                values: values,
            });
            setDocDatasets(newDatasets);
        }
    }, [chosenDocVal, chosenDocSentVal, consults]);
    const docLabels = typeof consults !== 'undefined' ? Object.keys(consults.doctorAverages.filter((doctor) =>{
        return doctor.user.given_name + ' ' + doctor.user.family_name === chosenDoc
    })[0].averages).reverse() : [];

    const avgLabels =
        typeof consults !== 'undefined'
            ? Object.keys(consults.platformAverages).reverse()
            : [];
    const docGraphTitle = "Dr. " + chosenDoc.split(" ")[1] + '\'s Average ' + chosenDocSentVal.label + ' Consult Rating';
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: 'Sentiment  Score',
                        fontSize: 14,
                    },
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
                    label='Select Sentiment Categories'
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
                <div className={classes['docPickLists']}>
                    <Picklist
                        placeholder={chosenDocVal}
                        onChange={(selectedVal) => {
                            setChosenDoc(selectedVal.label);
                            setChosenDocVal(selectedVal);
                        }}
                        value={chosenDocVal}
                        label='Select a Doctor'
                        className={classes['docPicklist']}
                    >
                        <Option name='header' label='Select a Doctor' variant='header' />
                        {consults &&
                        Object.values(consults.doctorAverages).map((doctor) => {
                            return (
                                <Option
                                    name={doctor.user.given_name + ' ' + doctor.user.family_name}
                                    label={doctor.user.given_name + ' ' + doctor.user.family_name}
                                    icon={
                                        <img
                                            className={classes['rounded-circle']}
                                            src={doctor.user.picture}
                                            width='25'
                                            alt=''
                                        />
                                    }
                                />
                            );
                        })}
                    </Picklist>
                    <Picklist
                        placeholder={chosenDocSentVal}
                        onChange={(selectedVal) => {
                            setChosenDocSentVal(selectedVal.label);
                            setChosenDocSentVal(selectedVal);
                        }}
                        value={chosenDocSentVal}
                        label='Select a Sentiment'
                        className={classes['docPicklist']}
                    >
                        <Option
                            name='header'
                            label='Select a Sentiment Category'
                            variant='header'
                        />
                        <Option label={'Toxicity'} name={'TOXICITY'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#532197' }}/>}/>
                        <Option label={'Profanity'} name={'PROFANITY'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#e65100' }}/>}/>
                        <Option label={'Insult'} name={'INSULT'} icon={<FontAwesomeIcon icon={faCircle}style={{ color: '#d6cd00' }} />}/>
                        <Option label={'Flirtation'} name={'FLIRTATION'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#e83e8c' }}/>}/>
                        <Option label={'Threat'} name={'THREAT'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#dc3545' }}/>}/>
                        <Option label={'Identity Attack'} name={'IDENTITY_ATTACK'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#007bff' }}/>}/>

                    </Picklist>
                </div>
                <Card title={docGraphTitle} className={classes.card}>
                    <Chart labels={docLabels} type='bar' options={options}>
                        {renderDataset(docDatasets)}
                    </Chart>
                </Card>
            </div>
        </div>
    );
};
