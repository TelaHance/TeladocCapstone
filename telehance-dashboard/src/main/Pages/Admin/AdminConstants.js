import React from 'react';
import { Avatar, Option } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { getLabel } from 'Components/Sentiment/Pill';
import classes from './Admin.module.css';

export const categories = [
  'FLIRTATION',
  'THREAT',
  'PROFANITY',
  'INSULT',
  'IDENTITY_ATTACK',
  'TOXICITY',
];

export const color = {
  FLIRTATION: '#e83e8c',
  THREAT: '#dc3545',
  PROFANITY: '#e65100',
  INSULT: '#d6cd00',
  IDENTITY_ATTACK: '#007bff',
  TOXICITY: '#6f42c1',
};

export const chartOptions = {
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

export const defaultUser = {
  icon: (
    <Avatar
      src='https://lh3.googleusercontent.com/a-/AOh14Gh51phry0bub90ZAhNidbTjNgiWlU_gQf0p9B38=s96-c'
      className={classes.avatarGraph}
    />
  ),
  label: 'Tanay Komarlu',
  name: '117431381176261371542',
  value: {
    user_id: '117431381176261371542',
    given_name: 'Tanay',
    family_name: 'Komarlu',
    picture:
      'https://lh3.googleusercontent.com/a-/AOh14Gh51phry0bub90ZAhNidbTjNgiWlU_gQf0p9B38=s96-c',
  },
};

export const sentimentOptions = categories.map((attribute) => (
  <Option
    icon={
      <FontAwesomeIcon
        icon={faCircle}
        style={{ color: color[attribute] }}
        size='lg'
      />
    }
    key={attribute}
    label={getLabel(attribute)}
    name={attribute}
  />
));

export const sentimentValues = categories.reduce((values, attribute) => {
  values[attribute] = {
    icon: (
      <FontAwesomeIcon icon={faCircle} style={{ color: color[attribute] }} />
    ),
    label: getLabel(attribute),
    name: attribute,
  };
  return values;
}, {});
