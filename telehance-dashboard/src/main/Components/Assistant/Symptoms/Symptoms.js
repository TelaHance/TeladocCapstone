import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faMinusCircle,
  faPlusCircle,
  faTimes,
  faHeadSideCough,
  faExclamationTriangle,
  faVirus,
} from '@fortawesome/free-solid-svg-icons';
import { Lookup } from 'react-rainbow-components';
import { updateSymptomsUrl } from 'src/main/Api';
import { putWithToken } from 'Util/fetch';
import symptomsJson from 'assets/symptoms';
import conditionsJson from 'assets/conditions';
import riskFactorsJson from 'assets/risk_factors';
import AnimatedList from '../AnimatedList';
import classes from '../Assistant.module.css';

const awsToken = process.env.REACT_APP_CONSULT_API_KEY;

const entityMap = {
  symptom: {
    title: 'Symptom',
    icon: faHeadSideCough,
    color: '#532197',
  },
  condition: {
    title: 'Condition',
    icon: faVirus,
    color: 'red',
  },
  risk_factor: {
    title: 'Risk Factor',
    icon: faExclamationTriangle,
    color: 'orange',
  },
};

const dbMap = [
  { type: 'symptom', json: symptomsJson },
  { type: 'condition', json: conditionsJson },
  { type: 'risk_factor', json: riskFactorsJson },
];

const database = dbMap.map(({ type, json }) => {
  const { title, icon, color } = entityMap[type];
  return {
    ...json.map(({ id, name, common_name }) => {
      return {
        id,
        label: name,
        description: common_name,
        icon: (
          <FontAwesomeIcon
            title={title}
            icon={icon}
            color={color}
            style={{
              height: 20,
              width: 20,
            }}
          />
        ),
      };
    }),
  };
});

export default function Symptoms({
  medicalTerms,
  consultId,
  startTime,
  diagnose,
  setMedicalTerms,
}) {
  const [searchState, setSearchState] = useState({ options: null });

  function filter(query, options) {
    if (query) {
      return options.filter((item) => {
        const regex = new RegExp(query, 'i');
        if (regex.test(item.label) || regex.test(item.description)) {
          return medicalTerms.every((term) => term.id !== item.id);
        }
      });
    }
    return [];
  }

  function search(value) {
    if (
      searchState.options &&
      searchState.value &&
      value.length > searchState.value.length
    ) {
      setSearchState({
        options: filter(value, searchState.options),
        value,
      });
    } else if (value) {
      setSearchState({
        isLoading: true,
        value,
      });
      setTimeout(
        () =>
          setSearchState({
            options: filter(value, database),
            isLoading: false,
          }),
        500
      );
    } else {
      setSearchState({
        isLoading: false,
        value: '',
        options: null,
      });
    }
  }

  function changeTerm(termData) {
    let updatedTermData = { ...termData };
    updatedTermData.choice_id =
      updatedTermData.choice_id === 'present' ? 'absent' : 'present';
    let newTerms = [...medicalTerms];
    newTerms[newTerms.indexOf(termData)] = updatedTermData;
    setMedicalTerms(newTerms);
    saveTerms(newTerms);
  }

  function removeTerm(termData) {
    if (!medicalTerms) {
      return;
    }
    let newTerms = medicalTerms.filter((term) => term.id !== termData.id);
    setMedicalTerms(newTerms);
    saveTerms(newTerms);
  }

  function addEntity() {
    const newTerms = medicalTerms ? [...medicalTerms] : [];
    const { id, label, description } = searchState.option;
    const newTerm = {
      id,
      name: label,
      common_name: description,
      type:
        id[0] === 's' ? 'symptom' : id[0] === 'c' ? 'condition' : 'risk_factor',
      choice_id: 'present',
    };
    newTerms.push(newTerm);
    setMedicalTerms(newTerms);
    saveTerms(newTerms);
  }

  function saveTerms(newTerms) {
    const url = updateSymptomsUrl({
      consult_id: consultId,
      start_time: startTime,
    });
    putWithToken(url, awsToken, newTerms);
  }

  function Symptom({ name, common_name, type, choice_id }) {
    const { title, icon, color } = entityMap[type];
    return (
      <div className={classes.item}>
        <FontAwesomeIcon
          title={title}
          icon={icon}
          color={color}
          className={classes.icon}
        />
        <div className={classes.text}>
          <div className={classes.name}>{name}</div>
          <div className={classes.commonName}>{common_name}</div>
        </div>
        <div className={classes.update}>
          <button title='Toggle Present' onClick={() => changeTerm(termData)}>
            <FontAwesomeIcon
              icon={choice_id === 'present' ? faCheck : faTimes}
              style={{
                color: choice_id === 'present' ? 'green' : 'red',
              }}
            />
          </button>
          <button onClick={() => removeTerm(termData)} title='Remove Symptom'>
            <FontAwesomeIcon icon={faMinusCircle} style={{ color: 'red' }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.content}>
      <h4>Analysis</h4>
      <div className={classes.search}>
        <Lookup
          id='lookup-3'
          placeholder='Add'
          size='medium'
          options={searchState.options}
          value={searchState.option}
          onChange={(option) => setSearchState({ option })}
          debounce
          isLoading={searchState.isLoading}
          onSearch={search}
          style={{ width: '100%' }}
          className={classes.lookup}
        />
        <button
          title='Add'
          onClick={() => {
            addEntity();
            setSearchState({ option: null });
          }}
        >
          <FontAwesomeIcon
            icon={faPlusCircle}
            style={{ color: 'green' }}
            className={classes.icon}
          />
        </button>
        <button
          title='Diagnose'
          className={classes.actions}
          onClick={() => diagnose(medicalTerms)}
        >
          Diagnose
        </button>
      </div>
      {medicalTerms && medicalTerms.length > 0 && (
        <div className={classes.itemContainer}>
          <AnimatedList items={medicalTerms} component={Symptom} />
        </div>
      )}
    </div>
  );
}
