import React, { useState } from "react";
import classes from './Diagnoses.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faArrowLeft, faArrowRight, faCheck, faCommentAlt, faMinusCircle, faPlusCircle, faSearch, faStethoscope, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ProgressBar } from 'react-bootstrap';



const Diagnoses = ({
  question,
  medicalConditions,
  symptoms
}) => {
  console.log(symptoms)
  const [active, setActive] = useState(null);
  const [symptomsState, setSymptoms] = useState(symptoms);
  const [expanded, setExpanded] = useState(false);
  console.log(symptomsState)

  function changeSymptom(symptomData) {
    let updatedSymptomData = symptomData;
    updatedSymptomData.choice_id = updatedSymptomData.choice_id === "present" ? "absent" : "present";
    let tempSymptoms = symptomsState;
    tempSymptoms[tempSymptoms.indexOf(symptomData)] = updatedSymptomData
    setSymptoms([...tempSymptoms]);
  }

  function changeVisibility(id) {
    // document.getElementById(id).style.display = document.getElementById(id).style.display === "none" ? "" : "none";
    document.getElementById(id).classList.contains(classes.inactive) ? 
      document.getElementById(id).classList.remove(classes.inactive) :
      document.getElementById(id).classList.add(classes.inactive);
  }

  function toggleExpanded() {
    if (expanded || active) {
      setExpanded(false);
      setActive(null);
    }
    else {
      setExpanded(true);
    }
  }

  return (
    <>
    <div className={active ? classes.infermedica + ' ' + classes.infermedicaActive : classes.infermedica}>
      {active === "questions" ? <div className={classes.question}>
        <h4>Question</h4>
        <div>{question}</div>
      </div> : null}
      {active === "conditions" ? <div className={classes.condition}>
      <h4>Diagnoses</h4>
      <h5>Suggested Question</h5>
      <div style={{"margin-bottom": "1rem"}}>{question}</div>
        {medicalConditions.map((condition) => (
          <>
          <button className={classes.item} key={condition.id} onClick={() => changeVisibility(condition.id)}>
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
            <FontAwesomeIcon 
              icon={faAngleDown}
              className={classes.expand}
            />
          </button>
          <div id={condition.id} className={classes.item + ' ' + classes.inactive}>
            <h1>Test</h1>
          </div>
          </>
          
        ))}
      </div> : null}
      {active === "symptoms" ? <div className={classes.symptom}>
        <h4>Symptoms Analysis</h4>
        <div className={classes.search}>
          <input placeholder="Search"></input>
          <FontAwesomeIcon 
              icon={faPlusCircle} 
              style={{ color: "green"}}
              className={classes.icon}
          />
          {/* <FontAwesomeIcon 
            icon={faMinusCircle} 
            style={{ color: "red"}}
            className={classes.icon}
          /> */}
        </div>
        <div className={classes.itemContainer}>
          {symptomsState.map((symptomData) => (
            <div className={classes.item}>
              <button title="Toggle Present"
              onClick={() => changeSymptom(symptomData)}>
                <FontAwesomeIcon 
                  icon={symptomData.choice_id === "present" ? faCheck : faTimes} 
                  style={{ color: symptomData.choice_id === "present" ? "green" : "red"}}
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
              <button className={classes.update} 
              title="Remove Symptom">
                <FontAwesomeIcon 
                  icon={faMinusCircle}
                  style={{ color: "red"}}
                />
              </button>
            </div>
          ))}
        </div>
        
      </div> : null}
    </div>
    <div className={classes.sidebar}>
      <button onClick={() => {setActive("symptoms"); setExpanded(false)}} className={active === "symptoms" ? classes.active : null}>
        <FontAwesomeIcon icon={faSearch}/>
        {expanded && <div>
          Symptoms
        </div>}
      </button>
      <button onClick={() => {setActive("conditions"); setExpanded(false)}} className={active === "conditions" ? classes.active : null}>
        <FontAwesomeIcon icon={faStethoscope}/>
        {expanded && <div>
          Diagnoses
        </div>}
      </button>
      <button onClick={() => {setActive("questions"); setExpanded(false)}} className={active === "questions" ? classes.active : null}>
        <FontAwesomeIcon icon={faCommentAlt}/>
        {expanded && <div>
          Doctor's Notes
        </div>}
      </button>
      <button onClick={() => toggleExpanded()} style={{"margin-top": "auto"}}>
        <FontAwesomeIcon icon={expanded || active ? faArrowRight : faArrowLeft}/>
      </button>
    </div>
    </>
  )
}

export default Diagnoses;