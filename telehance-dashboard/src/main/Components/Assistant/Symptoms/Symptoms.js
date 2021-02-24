import React, { useEffect, useState } from 'react';
import { putWithToken } from 'Util/fetch';
import symptomsJson from 'assets/symptoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faMinusCircle,
  faPlusCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Lookup } from 'react-rainbow-components';
import classes from '../Assistant.module.css';

const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
const symptomDatabase = symptomsJson.map((symptom) => {
  return {
    id: symptom.id,
    label: symptom.name,
    description: symptom.common_name,
    choice_id: 'present',
  };
});

export default function Symptoms({ symptoms, consultId, startTime, isLive }) {
  const [hasChanges, setHasChanges] = useState(false);
  const [symptomsState, setSymptoms] = useState(symptoms ? [...symptoms] : []);
  const [searchState, setSearchState] = useState({ options: null });

  useEffect(() => {
    if (isLive) {
      setSymptoms((symptomsState) => {
        let newSymptoms = [];
        symptoms?.forEach((newSymptom) => {
          if (symptomsState.every((symptom) => symptom.id !== newSymptom.id)) {
            newSymptoms.push(newSymptom);
          }
        });
        return [...symptomsState, ...newSymptoms];
      });
    }
  }, [symptoms, isLive]);

  useEffect(() => {
    setHasChanges(true);
  }, [symptomsState]);

  function filter(query, options) {
    if (query) {
      return options.filter((item) => {
        const regex = new RegExp(query, 'i');
        return (
          regex.test(item.label) ||
          (regex.test(item.description) &&
            symptomsState.every((symptom) => symptom.id !== item.id))
        );
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
        options: filter(value, symptomDatabase),
        value,
      });
    } else {
      setSearchState({
        isLoading: false,
        value: '',
        options: null,
      });
    }
  }

  function changeSymptom(symptomData) {
    let updatedSymptomData = { ...symptomData };
    updatedSymptomData.choice_id =
      updatedSymptomData.choice_id === 'present' ? 'absent' : 'present';
    let tempSymptoms = [...symptomsState];
    tempSymptoms[tempSymptoms.indexOf(symptomData)] = updatedSymptomData;
    setSymptoms(tempSymptoms);
    saveSymptoms(tempSymptoms);
  }

  function removeSymptom(symptomData) {
    if (!symptomsState) {
      return;
    }
    let tempSymptoms = symptomsState.filter(
      (symptom) => symptom.id !== symptomData.id
    );
    setSymptoms(tempSymptoms);
    saveSymptoms(tempSymptoms);
  }

  function addSymptom() {
    let tempSymptoms = symptomsState ? [...symptomsState] : [];
    const newSymptom = {
      choice_id: 'present',
      common_name: searchState.option.description,
      id: searchState.option.id,
      name: searchState.option.label,
      type: 'symptom',
    };
    tempSymptoms.push(newSymptom);
    setSymptoms(tempSymptoms);
    saveSymptoms(tempSymptoms);
  }

  function saveSymptoms(tempSymptoms) {
    const url = `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/updateSymptoms?consult_id=${consultId}&start_time=${startTime}`;
    putWithToken(url, awsToken, tempSymptoms);
  }

  function diagnose() {
    
  }

  return (
    <div className={classes.content}>
      <h4>Symptoms Analysis</h4>
      <div className={classes.search}>
        <Button variant='brand' label='Diagnose' size='small' onClick={diagnose}/>
        <Lookup
          id='symptom-lookup'
          placeholder='Add Symptoms'
          size='small'
          options={searchState.options}
          value={searchState.option}
          onChange={(option) => setSearchState({ option })}
          debounce
          isLoading={searchState.isLoading}
          onSearch={search}
          className={classes.lookup}
        />
        <button
          title='Add Symptom'
          onClick={() => {
            addSymptom();
            setSearchState({ option: null });
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} size='2x'/>
        </button>
      </div>
      {symptomsState && (
        <div className={classes.itemContainer}>
          {symptomsState.map((symptomData) => (
            <div className={classes.item} key={symptomData.id}>
              <button
                title='Toggle Present'
                onClick={() => changeSymptom(symptomData)}
              >
                <FontAwesomeIcon
                  icon={symptomData.choice_id === 'present' ? faCheck : faTimes}
                  style={{
                    color:
                      symptomData.choice_id === 'present' ? 'green' : 'red',
                  }}
                  className={classes.icon}
                />
              </button>
              <div>
                <div className={classes.name}>{symptomData.name}</div>
                <div className={classes.commonName}>
                  {symptomData.common_name}
                </div>
              </div>
              <button
                className={classes.update}
                onClick={() => removeSymptom(symptomData)}
                title='Remove Symptom'
              >
                <FontAwesomeIcon
                  icon={faMinusCircle}
                  style={{ color: 'red' }}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
