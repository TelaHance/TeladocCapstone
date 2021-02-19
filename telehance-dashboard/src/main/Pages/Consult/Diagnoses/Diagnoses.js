import React, { useEffect, useState } from "react";
import classes from './Diagnoses.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCheck, faCommentAlt, faMinusCircle, faPlusCircle, faSearch, faStethoscope, faTimes, faHospital } from '@fortawesome/free-solid-svg-icons';
import { Lookup } from 'react-rainbow-components';
import { ProgressBar } from 'react-bootstrap';
import { putWithToken } from 'Util/fetch';
import symptomsJson from 'assets/symptoms';



const Diagnoses = ({
  question,
  medicalConditions,
  symptoms,
  consultId,
  startTime,
  isLive,
  action
}) => {
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const [active, setActive] = useState(null);
  const [symptomsState, setSymptoms] = useState(symptoms ? [...symptoms] : null);
  const [expandedSide, setExpandedSide] = useState(false);
  const [expandedContent, setExpandedContent] = useState(false);
  const [state, setState] = useState({ options: null });

  useEffect(() => {
    if (isLive) {
      setSymptoms(symptomsState => {
        let newSymptoms = [];
        symptoms.forEach(newSymptom => {
          if (symptomsState.every(symptom => symptom.id !== newSymptom.id)) {
            newSymptoms.push(newSymptom);
          }
        });
        return [...symptomsState, ...newSymptoms]
      })
    }
  }, [symptoms, isLive]);


  const containerStyles = {
    width: '70%',
  };
  // const IconStyles = {
  //   height: 30,
  //   width: 30,
  //   backgroundColor: '#01b6f5',
  //   borderRadius: 40,
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   color: 'white',
  // };

  const symptomDatabase =
    symptomsJson.map(symptom => {
      return ({
        id: symptom.id,
        label: symptom.name,
        description: symptom.common_name,
        choice_id: 'present',
        // icon: (
        //   <span style={IconStyles}>
        //     {' '}
        //     <FontAwesomeIcon icon={faHospital} />{' '}
        //   </span>
        // ),
      })
    })
  console.log(symptomDatabase);

  function filter(query, options) {
    if (query) {
      return options.filter(item => {
        const regex = new RegExp(query, 'i');
        return regex.test(item.label) || regex.test(item.description) && symptomsState.every(symptom => symptom.id !== item.id);
      });
    }
    return [];
  }

  function search(value) {
    if (state.options && state.value && value.length > state.value.length) {
      setState({
        options: filter(value, state.options),
        value,
      });
    } else if (value) {
      setState({
        isLoading: true,
        value,
      });
      setTimeout(
        () =>
          setState({
            options: filter(value, symptomDatabase),
            isLoading: false,
          }),
        500,
      );
    } else {
      setState({
        isLoading: false,
        value: '',
        options: null,
      });
    }
  }


  function changeSymptom(symptomData) {
    let updatedSymptomData = { ...symptomData };
    updatedSymptomData.choice_id = updatedSymptomData.choice_id === "present" ? "absent" : "present";
    let tempSymptoms = [...symptomsState];
    tempSymptoms[tempSymptoms.indexOf(symptomData)] = updatedSymptomData;
    setSymptoms(tempSymptoms);
    saveSymptoms(tempSymptoms);
  }

  function removeSymptom(symptomData) {
    if (!symptomsState) {
      return;
    }
    let tempSymptoms = symptomsState.filter(symptom => symptom.id !== symptomData.id);
    setSymptoms(tempSymptoms);
    saveSymptoms(tempSymptoms);
  }

  function addSymptom() {
    let tempSymptoms = symptomsState ? [...symptomsState] : [];
    const newSymptom = {
      choice_id: "present",
      common_name: state.option.description,
      id: state.option.id,
      name: state.option.label,
      type: "symptom"
    }
    tempSymptoms.push(newSymptom);
    setSymptoms(tempSymptoms);
    saveSymptoms(tempSymptoms);
  }

  function saveSymptoms(tempSymptoms) {
    const url = `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/updateSymptoms?consult_id=${consultId}&start_time=${startTime}`;
    putWithToken(url, awsToken, tempSymptoms);
  }

  function toggleExpanded() {
    if (expandedSide || expandedContent) {
      setExpandedSide(false);
      setExpandedContent(false);
      action(false);
    }
    else {
      setExpandedSide(true);
    }
  }

  function renderNotes() {
    return (
      <div className={classes.content}>
        <h4>Doctor's Notes</h4>
      </div>
    );
  }

  function renderConditions() {
    return (
      <div className={classes.content}>
        <h4>Intelligent Diagnostic Assistant</h4>
        <h5>Suggested Question</h5>
        {question && <div style={{ "marginBottom": "1rem" }}>{question}</div>}
        {medicalConditions && <div className={classes.itemContainer}>
          {medicalConditions.map((condition) => (
            <div className={classes.item} key={condition.id}>
              <div>
                <ProgressBar
                  now={Math.round(condition.probability * 100)}
                  variant={Math.round(condition.probability * 100) > 66 ? "success" :
                    (Math.round(condition.probability * 100) > 33 ? "warning" : "danger")}
                  className={classes.progressBar}
                />
                {Math.round(condition.probability * 100) + '%'}
              </div>
              <div>
                <div className={classes.name}>
                  {condition.name}
                </div>
                <div className={classes.commonName}>
                  {condition.common_name}
                </div>
              </div>
            </div>

          ))}
        </div>}
      </div>
    );
  }

  function renderSymptoms() {
    return (
      <div className={classes.content}>
        <h4>Symptoms Analysis</h4>
        <div className={classes.search}>
          <Lookup
            id="lookup-3"
            placeholder="Add Symptoms"
            size="small"
            options={state.options}
            value={state.option}
            onChange={option => setState({ option })}
            debounce
            isLoading={state.isLoading}
            onSearch={search}
            style={containerStyles}
            className={classes.lookup}
          />
          <button title="Add Symptom"
            onClick={() => {
              addSymptom();
              setState({ option: null })
            }}>
            <FontAwesomeIcon
              icon={faPlusCircle}
              style={{ color: "green" }}
              className={classes.icon}
            />
          </button>
        </div>
        {symptomsState && <div className={classes.itemContainer}>
          {symptomsState.map((symptomData) => (
            <div className={classes.item} key={symptomData.id}>
              <button title="Toggle Present"
                onClick={() => changeSymptom(symptomData)}>
                <FontAwesomeIcon
                  icon={symptomData.choice_id === "present" ? faCheck : faTimes}
                  style={{ color: symptomData.choice_id === "present" ? "green" : "red" }}
                  className={classes.icon}
                />
              </button>
              <div>
                <div className={classes.name}>
                  {symptomData.name}
                </div>
                <div className={classes.commonName}>
                  {symptomData.common_name}
                </div>
              </div>
              <button className={classes.update} onClick={() => removeSymptom(symptomData)}
                title="Remove Symptom">
                <FontAwesomeIcon
                  icon={faMinusCircle}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          ))}
        </div>}
      </div>
    )
  }

  function renderSidebar() {
    return (
      <div className={classes.sidebar}>
        <button onClick={() => { setActive("symptoms"); setExpandedSide(false); setExpandedContent(true); action(true) }}
          className={expandedContent && active === "symptoms" ? classes.active : null}>
          <FontAwesomeIcon icon={faSearch} />
          {expandedSide && <div>
            Symptoms
          </div>}
        </button>
        <button onClick={() => { setActive("conditions"); setExpandedSide(false); setExpandedContent(true); action(true) }}
          className={expandedContent && active === "conditions" ? classes.active : null}>
          <FontAwesomeIcon icon={faStethoscope} />
          {expandedSide && <div>
            Diagnoses
          </div>}
        </button>
        <button onClick={() => { setActive("notes"); setExpandedSide(false); setExpandedContent(true); action(true) }}
          className={expandedContent && active === "notes" ? classes.active : null}>
          <FontAwesomeIcon icon={faCommentAlt} />
          {expandedSide && <div>
            Doctor's Notes
          </div>}
        </button>
        <button onClick={() => toggleExpanded()} style={{ "marginTop": "auto", "width": "1.5em" }}>
          <FontAwesomeIcon icon={expandedSide || expandedContent ? faArrowRight : faArrowLeft} />
        </button>
      </div>
    )
  }

  return (
    <>
      <div className={expandedContent ? classes.infermedica + ' ' + classes.infermedicaActive : classes.infermedica}>
        {active === "notes" ? renderNotes() : null}
        {active === "conditions" ? renderConditions() : null}
        {active === "symptoms" ? renderSymptoms() : null}
      </div>
      {renderSidebar()}
    </>
  )
}

export default Diagnoses;