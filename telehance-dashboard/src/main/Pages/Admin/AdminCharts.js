import React, {useEffect, useState} from 'react';
import { Row, Col} from 'react-bootstrap';
import {
    Card,
    Dataset,
    Chart,
    MultiSelect,
    Picklist,
    Option,
} from "react-rainbow-components";
import classes from './Admin.module.css';

export const AdminCharts = ({consults}) => {
    const [chosenDoc, setChosenDoc] = useState("Tanay Komarlu");
    const [chosenDocVal, setChosenDocVal] = useState("Tanay Komarlu");
    const [avgListVal, setAvgListVal] = useState([
        {label:'Toxicity', name:'TOXICITY'},]);
    const [avgDatasets, setAvgDatasets] = useState([]);
    useEffect(()=>{
        let newDatasets = [];
        for(let i = 0; i<avgListVal.length; i++) {
            const values = (typeof consults !== 'undefined') ? Object.values(consults.platformAverages).reverse().map(function (sentiment) {
                return 100 * sentiment[avgListVal[i].name]
            }) : [];
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
    const renderAvgDataset = (datasets) => {
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
    const renderDocDataset = () => {
        const values = (typeof consults !== 'undefined') ? Object.values(consults.doctorAverage[chosenDoc].sentiment).reverse().map(
            function(x) { return parseInt(x * 100); }) : [];
        const datasets = [{
            title: 'Average Sentiment Score for Dr.' + chosenDoc,
            borderColor: '#6f42c1',
            values: values,
        }];
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
    (typeof consults !== 'undefined') ? console.log(avgListVal) : console.log('hell')
    const docLabels = (typeof consults !== 'undefined') ? Object.keys(consults.doctorAverage[chosenDoc].sentiment).reverse() : [];
    const avgLabels = (typeof consults !== 'undefined') ? Object.keys(consults.platformAverages).reverse() : [];
    const docGraphTitle = "Average Consult Ratings for Dr." + chosenDoc;
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
                    variant="chip"
                >
                    <Option name='header' label='Select Sentiment Categories' variant='header' />
                    <Option label={'Toxicity'} name={'TOXICITY'}/>
                    <Option label={'Profanity'} name={'PROFANITY'}/>
                    <Option label={'Insult'} name={'INSULT'}/>
                    <Option label={'Flirtation'} name={'FLIRTATION'}/>
                    <Option label={'Threat'} name={'THREAT'}/>
                    <Option label={'Identity Attack'} name={'IDENTITY_ATTACK'}/>
                </MultiSelect>
                <Card
                    title="Average Consult Ratings"
                    className={classes['lineGraph']}
                >
                    <Chart labels={avgLabels} type="line">
                        {renderAvgDataset(avgDatasets)}
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
                <Card
                    title={docGraphTitle}
                    className={classes['lineGraph']}
                >
                    <Chart labels={docLabels} type="bar">
                        {renderDocDataset()}
                    </Chart>
                </Card>
            </div>
        </div>
    );
};
