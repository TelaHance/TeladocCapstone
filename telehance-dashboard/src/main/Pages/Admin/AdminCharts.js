import React, {useState} from 'react';
import { Row, Col} from 'react-bootstrap';
import {
    Card,
    Dataset,
    Chart,
    Picklist,
    Option
} from "react-rainbow-components";
import classes from './Admin.module.css';

export const AdminCharts = ({consults}) => {
    const [chosenAvgLabel, setChosenAvgLabel] = useState('TOXICITY');
    const [chosenDoc, setChosenDoc] = useState("Tanay Komarlu");
    const [chosenDocVal, setChosenDocVal] = useState("Tanay Komarlu");
    const [avgListVal, setAvgListVal] = useState({'label': 'Toxicity'});
    const renderAvgDataset = () => {
        const values = (typeof consults !== 'undefined') ? Object.values(consults.platformAverages).reverse().map(function(sentiment) {return 100*sentiment[chosenAvgLabel]}) : [];
        let color = '#6f42c1';
        switch(chosenAvgLabel){
            case 'TOXICITY':
                color = '#6f42c1';
                break;
            case 'INSULT':
                color = '#8cba00';
                break;
            case 'PROFANITY':
                color = '#e65100';
                break;
            case 'IDENTITY_ATTACK':
                color = '#bbdefb';
                break;
            case 'FLIRTATION':
                color = '#e83e8c';
                break;
            case 'THREAT':
                color = '#ff1e19';
                break;
        }
        const datasets = [{
            title: 'Average Sentiment Score by ' + avgListVal.label,
            borderColor: color,
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
    (typeof consults !== 'undefined') ? console.log(consults) : console.log('hell')
    const docLabels = (typeof consults !== 'undefined') ? Object.keys(consults.doctorAverage[chosenDoc].sentiment).reverse() : [];
    const avgLabels = (typeof consults !== 'undefined') ? Object.keys(consults.platformAverages).reverse() : [];
    const docGraphTitle = "Average Consult Ratings for Dr." + chosenDoc;
    return (
        <>
            <Row>
                <Col>
                    <Picklist
                        placeholder={avgListVal}
                        onChange={(selectedVal) => {
                            setChosenAvgLabel(selectedVal.name);
                            setAvgListVal(selectedVal);
                        }}
                        value={avgListVal}
                        label='Select a Toxicity Label'
                        className={classes['picklist']}
                    >
                        <Option name='header' label='Select a Sentiment Category' variant='header' />
                        <Option label={'Toxicity'} name={'TOXICITY'}/>
                        <Option label={'Profanity'} name={'PROFANITY'}/>
                        <Option label={'Insult'} name={'INSULT'}/>
                        <Option label={'Flirtation'} name={'FLIRTATION'}/>
                        <Option label={'Threat'} name={'THREAT'}/>
                        <Option label={'Identity Attack'} name={'IDENTITY_ATTACK'}/>
                    </Picklist>
                    <br/>
                    <Card
                        title="Average Consult Ratings"
                        className={classes['lineGraph']}
                    >
                        <Chart labels={avgLabels} type="line">
                            {renderAvgDataset()}
                        </Chart>
                    </Card>
                </Col>
                <Col>
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
                    <br/>
                    <Card
                        title={docGraphTitle}
                        className={classes['lineGraph']}
                    >
                        <Chart labels={docLabels} type="bar">
                            {renderDocDataset()}
                        </Chart>
                    </Card>
                </Col>
            </Row>
        </>
    );
};
