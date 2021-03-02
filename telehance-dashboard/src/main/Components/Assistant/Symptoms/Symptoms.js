import React, { useEffect, useState } from "react";
import { putWithToken } from 'Util/fetch';
import symptomsJson from 'assets/symptoms';
import conditionsJson from 'assets/conditions';
import riskFactorsJson from 'assets/risk_factors';
import classes from '../Assistant.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinusCircle, faPlusCircle, faTimes, faHeadSideCough, faExclamationTriangle, faVirus } from '@fortawesome/free-solid-svg-icons';
import { Lookup } from 'react-rainbow-components';

const Symptoms = ({
  medicalTerms,
  consultId,
  startTime,
  isLive
}) => {
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const [medicalTermsState, setMedicalTerms] = useState(medicalTerms ? [...medicalTerms] : []);
  const [searchState, setSearchState] = useState({ options: null });

  useEffect(() => {
    if (isLive) {
      setMedicalTerms(medicalTermsState => {
        let newTerms = [];
        medicalTerms.forEach(newTerm => {
          if (medicalTermsState.every(term => term.id !== newTerm.id)) {
            newTerms.push(newTerm);
          }
        });
        return [...medicalTermsState, ...newTerms]
      })
    }
  }, [medicalTerms, isLive]);

  const containerStyles = {
    width: '100%',
  };

  const database =
    symptomsJson.map(symptom => {
      return ({
        id: symptom.id,
        label: symptom.name,
        description: symptom.common_name,
      })
    })

  database.push(...
    conditionsJson.map(condition => {
      return ({
        id: condition.id,
        label: condition.name,
        description: condition.common_name,
      })
    })
  )
  database.push(...
    riskFactorsJson.map(riskFactors => {
      return ({
        id: riskFactors.id,
        label: riskFactors.name,
        description: riskFactors.common_name,
      })
    })
  )
  console.log(database)

  function filter(query, options) {
    if (query) {
      return options.filter(item => {
        const regex = new RegExp(query, 'i');
        if (regex.test(item.label) || regex.test(item.description)) {
          return medicalTermsState.every(term => term.id !== item.id);
        }
      });
    }
    return [];
  }

  function search(value) {
    if (searchState.options && searchState.value && value.length > searchState.value.length) {
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
        500,
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
    updatedTermData.choice_id = updatedTermData.choice_id === "present" ? "absent" : "present";
    let newTerms = [...medicalTermsState];
    newTerms[newTerms.indexOf(termData)] = updatedTermData;
    setMedicalTerms(newTerms);
    saveTerms(newTerms);
  }

  function removeTerm(termData) {
    if (!medicalTermsState) {
      return;
    }
    let newTerms = medicalTermsState.filter(term => term.id !== termData.id);
    setMedicalTerms(newTerms);
    saveTerms(newTerms);
  }

  // function removeCondition(conditionData) {
  //   if(!conditionsState) {
  //     return;
  //   }
  //   let tempConditions = conditionsState.filter(condition => condition.id !== conditionData.id);
  //   setConditions(tempConditions);
  // }

  function addEntity() {
    let newTerms = medicalTermsState ? [...medicalTermsState] : [];
    const newTerm = {
      choice_id: "present",
      common_name: searchState.option.description,
      id: searchState.option.id,
      name: searchState.option.label,
      type: searchState.option.id[0] === 's' ? "symptom" :
        searchState.option.id[0] === 'c' ? "condition" : "risk_factor"
    }
    newTerms.push(newTerm);
    setMedicalTerms(newTerms);
    saveTerms(newTerms);
  }

  function saveTerms(newTerms) {
    const url = `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/updateSymptoms?consult_id=${consultId}&start_time=${startTime}`;
    putWithToken(url, awsToken, newTerms);
  }

  return (
    <div className={classes.content}>
      <h4>Analysis</h4>
      <div className={classes.search}>
        <Lookup
          id="lookup-3"
          placeholder="Add"
          size="medium"
          options={searchState.options}
          value={searchState.option}
          onChange={option => setSearchState({ option })}
          debounce
          isLoading={searchState.isLoading}
          onSearch={search}
          style={containerStyles}
          className={classes.lookup}
        />
        <button title="Add"
          onClick={() => {
            addEntity();
            setSearchState({ option: null })
          }}>
          <FontAwesomeIcon
            icon={faPlusCircle}
            style={{ color: "green" }}
            className={classes.icon}
          />
        </button>
        <button title="Diagnose" className={classes.actions}>
          Diagnose
        </button>
      </div>
      {medicalTermsState && medicalTermsState.length > 0 &&
        <div className={classes.itemContainer}>

          {medicalTermsState.map((termData) => (
            <div className={classes.item} key={termData.id}>

              <FontAwesomeIcon
                title={termData.type}
                icon={termData.type === "symptom" ? faHeadSideCough : termData.type === 'condition' ? faVirus : faExclamationTriangle}
                style={{ color: '#532197' }}
                className={classes.icon}
              />
              <div>
                <div className={classes.name}>
                  {termData.name}
                </div>
                <div className={classes.commonName}>
                  {termData.common_name}
                </div>
              </div>
              <div className={classes.update}>
                <button title="Toggle Present"
                  onClick={() => changeTerm(termData)}>
                  <FontAwesomeIcon
                    icon={termData.choice_id === "present" ? faCheck : faTimes}
                    style={{ color: termData.choice_id === "present" ? "green" : "red" }}
                  />
                </button>
                <button onClick={() => removeTerm(termData)}
                  title="Remove Symptom">
                  <FontAwesomeIcon
                    icon={faMinusCircle}
                    style={{ color: "red" }}
                  />
                </button>
              </div>

            </div>
          ))}
        </div>}
        
    </div>
  )
}

export default Symptoms;