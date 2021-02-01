import React, { useState } from "react";
import classes from './Diagnoses.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCheck, faCommentAlt, faSearch, faStethoscope, faTimes } from '@fortawesome/free-solid-svg-icons';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";



const Diagnoses = ({
  question,
  medicalConditions,
  symptoms
}) => {
  console.log(symptoms)
  const [active, setActive] = useState(null);
  const [symptomsState, setSymptoms] = useState(symptoms);
  console.log(symptomsState)

  function changeSymptom(symptomData) {
    let updatedSymptomData = symptomData;
    updatedSymptomData.choice_id = updatedSymptomData.choice_id == "present" ? "absent" : "present";
    let tempSymptoms = symptomsState;
    tempSymptoms[tempSymptoms.indexOf(symptomData)] = updatedSymptomData
    setSymptoms([...tempSymptoms]);
  }

  return (
    <>
    <div className={active ? classes.infermedica + ' ' + classes.infermedicaActive : classes.infermedica}>
      {active == "questions" ? <div className={classes.question}>
        <h4>Question</h4>
        <div>{question}</div>
      </div> : null}
      {active == "conditions" ? <div className={classes.condition}>
      <h4>Diagnoses</h4>
      <h5>Suggested Question</h5>
      <div>{question}</div>
        {medicalConditions.map((condition) => (
          <Dropdown className={classes.item} key={condition.id}>
            <Dropdown.Toggle variant="success" className={classes.dropdownToggle}>
              <div>
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
              <button className={classes.expand}>
                <FontAwesomeIcon 
                  icon={faAngleDown}
                />
              </button>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <h1>Test</h1>
              </Dropdown.Item>
            </Dropdown.Menu>
            
          </Dropdown>
          
        ))}
      </div> : null}
      {active == "symptoms" ? <div className={classes.symptom}>
        <h4>Symptoms Analysis</h4>
        {symptomsState.map((symptomData) => (
          <div className={classes.item}>
            <FontAwesomeIcon 
              icon={symptomData.choice_id == "present" ? faCheck : faTimes} 
              style={{ color: symptomData.choice_id == "present" ? "green" : "red"}}
              className={classes.icon}
            />
            <div>
              <div className={classes.name}>
                {symptomData.name}
              </div>
              <div className={classes.commonName}>
                {symptomData.common_name}
              </div>
            </div>
            <button className={classes.update} 
            title={symptomData.choice_id == "present" ? "Remove Symptom" : "Add Symptom"}
            onClick={() => changeSymptom(symptomData)}>
              <FontAwesomeIcon 
                icon={symptomData.choice_id == "present" ? faTimes : faCheck} 
                style={{ color: symptomData.choice_id == "present" ? "red" : "green"}}
              />
            </button>
          </div>
        ))}
      </div> : null}
    </div>
    <div className={classes.sidebar}>
      <button onClick={() => setActive("symptoms")} className={active == "symptoms" ? classes.active : null}>
        <FontAwesomeIcon icon={faSearch}/>
      </button>
      <button onClick={() => setActive("conditions")} className={active == "conditions" ? classes.active : null}>
        <FontAwesomeIcon icon={faStethoscope}/>
      </button>
      <button onClick={() => setActive("questions")} className={active == "questions" ? classes.active : null}>
        <FontAwesomeIcon icon={faCommentAlt}/>
      </button>
    </div>
    </>
  )
}

export default Diagnoses;