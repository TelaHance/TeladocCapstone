import React, { useState } from "react";
import classes from './Diagnoses.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCommentAlt, faSearch, faStethoscope, faTimes } from '@fortawesome/free-solid-svg-icons';

const Diagnoses = ({
  question,
  medicalConditions,
  symptoms
}) => {
  console.log(symptoms)
  const [active, setActive] = useState(null);
  return (
    <>
    <div className={classes.infermedica}>
      {active == "questions" ? <div className={classes.question}>
        <h4>Question</h4>
        <div>{question}</div>
      </div> : null}
      {active == "conditions" ? <div className={classes.condition}>
        <h4>Medical Conditions</h4>
        {medicalConditions.map((medicalCondition) => (
          <ul>
            <li key={medicalCondition.id} className='list-group-item'>
              <strong>Common Name</strong>: {medicalCondition.common_name}
            </li>
            <li key={medicalCondition.id} className='list-group-item'>
              <strong>Name</strong>: {medicalCondition.name}
            </li>
            <li key={medicalCondition.id} className='list-group-item'>
              <strong>Probability</strong>: {medicalCondition.probability}
            </li>
          </ul>
        ))}
      </div> : null}
      {active == "symptoms" ? <div className={classes.symptom}>
        <h4>Symptoms Analysis</h4>
        {symptoms.map((symptomData) => (
          <div key={symptomData.id} className={classes.item}>
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