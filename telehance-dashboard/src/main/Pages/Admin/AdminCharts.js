import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Dataset,
  Chart,
  MultiSelect,
  Picklist,
  Option,
  Avatar,
} from 'react-rainbow-components';
import {
  chartOptions,
  color,
  defaultUser,
  sentimentOptions,
  sentimentValues,
} from './AdminConstants';
import classes from './Admin.module.css';

function renderDataset(datasets) {
  return datasets.map(({ title, color, values }) => (
    <Dataset
      key={title}
      title={title}
      values={values}
      borderColor={color}
      backgroundColor={color}
    />
  ));
}

export default function AdminCharts({ consults }) {
  const [chosenDoc, setChosenDoc] = useState(defaultUser);

  const [avgListVal, setAvgListVal] = useState([
    sentimentValues.TOXICITY,
    sentimentValues.INSULT,
    sentimentValues.FLIRTATION,
  ]);

  const [docSentValue, setDocSentValue] = useState(sentimentValues.TOXICITY);

  const [avgDatasets, setAvgDatasets] = useState([]);
  const [docDatasets, setDocDatasets] = useState([]);
  const [docLabels, setDocLabels] = useState([]);

  const [graphToUpdate, setGraphToUpdate] = useState('ALL');

  useEffect(() => {
    const newDatasets = avgListVal.map(({ label, name }) => {
      const values = Object.values(consults?.platformAverages ?? {}).map(
        function (sentiment) {
          return Math.round(100 * sentiment[name]);
        }
      );
      return {
        title: label,
        color: color[name],
        values: values,
      };
    });
    setAvgDatasets(newDatasets);
  }, [avgListVal, consults]);

  useEffect(() => {
    const docData = Object.entries(
      consults
        ? consults.doctorAverages.filter(
            ({ user: { user_id } }) => user_id === chosenDoc.value.user_id
          )[0].averages
        : []
    ).sort((a, b) => Date.parse(a[0]) - Date.parse(b[0]));

    setDocLabels(docData.map((data) => data[0]));

    const docValues = docData.map((data) =>
      Math.round(100 * data[1][docSentValue.name])
    );

    const avgValues = Object.values(
      consults?.platformAverages ?? {}
    ).map((sentiment) => Math.round(100 * sentiment[docSentValue.name]));

    setDocDatasets([
      {
        title: 'Dr. ' + chosenDoc.value.family_name,
        color: '#24b71a',
        values: docValues,
      },
      {
        title: 'Average Doctor',
        color: color[docSentValue.name],
        values: avgValues,
      },
    ]);
  }, [chosenDoc, docSentValue, consults]);

  const avgLabels = useMemo(
    () => Object.keys(consults?.platformAverages ?? {}),
    [consults]
  );
  const docGraphTitle = `Dr. ${chosenDoc.value.family_name}'s Average ${docSentValue.label} Consult Rating`;

  return (
    <div className={classes.flexContainer}>
      <div>
        <MultiSelect
          onChange={(selectedVal) => {
            setAvgListVal(selectedVal);
            setGraphToUpdate('AVG');
          }}
          value={avgListVal}
          label='Select Sentiment Categories'
          className={classes.picklist}
          showCheckbox
          variant='chip'
        >
          <Option
            name='header'
            label='Select Sentiment Categories'
            variant='header'
          />
          {sentimentOptions}
        </MultiSelect>
        <Card
          title='Average TelaHance Consult Ratings'
          className={classes.card}
        >
          <Chart
            labels={avgLabels}
            type='line'
            options={chartOptions}
            disableAnimations={graphToUpdate === 'DOC'}
          >
            {renderDataset(avgDatasets)}
          </Chart>
        </Card>
      </div>
      <div>
        <div className={classes.docPickLists}>
          <Picklist
            placeholder={chosenDoc}
            onChange={(selectedVal) => {
              setChosenDoc((prevVal) => {
                console.log(prevVal === selectedVal);
                return prevVal === selectedVal ? selectedVal : prevVal;
              });
              setGraphToUpdate('DOC');
            }}
            value={chosenDoc}
            label='Select a Doctor'
            className={classes.docPicklist}
          >
            <Option name='header' label='Select a Doctor' variant='header' />
            {Object.values(consults?.doctorAverages ?? {}).map(({ user }) => (
              <Option
                icon={
                  <Avatar src={user.picture} className={classes.avatarGraph} />
                }
                key={user.user_id}
                label={`${user.given_name} ${user.family_name}`}
                name={user.user_id}
                value={user}
              />
            ))}
          </Picklist>
          <Picklist
            placeholder={docSentValue}
            onChange={(selectedVal) => {
              setDocSentValue(selectedVal);
              setGraphToUpdate('DOC');
            }}
            value={docSentValue}
            label='Select a Sentiment'
            className={classes.docPicklist}
          >
            <Option
              name='header'
              label='Select a Sentiment Category'
              variant='header'
            />
            {sentimentOptions}
          </Picklist>
        </div>
        <Card title={docGraphTitle} className={classes.card}>
          <Chart
            labels={docLabels}
            type='bar'
            options={chartOptions}
            disableAnimations={graphToUpdate === 'AVG'}
          >
            {renderDataset(docDatasets)}
          </Chart>
        </Card>
      </div>
    </div>
  );
}
