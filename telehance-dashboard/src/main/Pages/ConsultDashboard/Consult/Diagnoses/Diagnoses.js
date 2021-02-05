import React, { useContext, useState } from "react";
import classes from './Diagnoses.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowLeft, faArrowRight, faCheck, faCommentAlt, faMinusCircle, faPlusCircle, faSearch, faStethoscope, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Accordion, AccordionContext, Button, Card, ProgressBar } from 'react-bootstrap';
import { putWithToken } from '../../../../Util/fetch';



const Diagnoses = ({
  question,
  medicalConditions,
  symptoms,
  consultId,
  startTime
}) => {
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const [active, setActive] = useState(null);
  const [symptomsState, setSymptoms] = useState([...symptoms]);
  const [expandedSide, setExpandedSide] = useState(false);
  const [expandedContent, setExpandedContent] = useState(false);
  const [isSymptomsChanged, setSymptomsChanged] = useState(false);
  console.log(symptoms);

  function changeSymptom(symptomData) {
    let updatedSymptomData = {...symptomData};
    updatedSymptomData.choice_id = updatedSymptomData.choice_id === "present" ? "absent" : "present";
    let tempSymptoms = [...symptomsState];
    tempSymptoms[tempSymptoms.indexOf(symptomData)] = updatedSymptomData;
    setSymptoms([...tempSymptoms]);
    for (let i = 0; i < symptoms.length; i++) {
      if (symptoms[i].choice_id !== tempSymptoms[i].choice_id) {
        setSymptomsChanged(true);
        return;
      }
    }
    setSymptomsChanged(false);
  }

  function saveSymptoms() {
    let isChanged = false;
    for (let i = 0; i < symptoms.length; i++) {
      if (symptoms[i].choice_id !== symptomsState[i].choice_id) {
        isChanged = true;
        break;
      }
    }
    if (!isChanged) {
      return;
    }
    const url = `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/updateSymptoms?consult_id=${consultId}&start_time=${startTime}`;
    putWithToken(url, awsToken, symptomsState);
  }

  function toggleExpanded() {
    if (expandedSide || expandedContent) {
      setExpandedSide(false);
      setExpandedContent(false);
    }
    else {
      setExpandedSide(true);
    }
  }

  function ContextAwareArrow( { children, eventKey, callback }) {
    const currentEventKey = useContext(AccordionContext);

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
      <FontAwesomeIcon
        icon={isCurrentEventKey ? faAngleUp : faAngleDown}
        style={{"margin-left": "auto", "width": "3em"}}
      >
        {children}
      </FontAwesomeIcon>
    );
  }

  function renderConditions() {
    return (
      <div className={classes.condition}>
      <h4>Diagnoses</h4>
      <h5>Suggested Question</h5>
      <div style={{"margin-bottom": "1rem"}}>{question}</div>
      <Accordion className={classes.itemContainer}>
        {medicalConditions.map((condition) => (
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey={condition.id} className={classes.item + ' ' + classes['card-header']}>
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
              <ContextAwareArrow eventKey={condition.id} />
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={condition.id}>
              <Card.Body className={classes.item}>
                Test
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          
        ))}
      </Accordion>
      </div>
    );
  }

  function renderSymptoms() {
    return(
      <div className={classes.symptom}>
        <h4>Symptoms Analysis</h4>
        <div className={classes.search}>
          <input placeholder="Search"></input>
          <FontAwesomeIcon 
              icon={faPlusCircle} 
              style={{ color: "green"}}
              className={classes.icon}
          />
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
        {isSymptomsChanged && <div className={classes.actions}>
          <Button onClick={() => {
            setSymptoms([...symptoms]);
            setSymptomsChanged(false);}}>
            Cancel
          </Button>
          <Button onClick={() => saveSymptoms()}>
            Submit
          </Button>
        </div>}
          
        
      </div>
    )
  }

  function renderSidebar() {
    return (
      <div className={classes.sidebar}>
        <button onClick={() => {setActive("symptoms"); setExpandedSide(false); setExpandedContent(true)}} 
          className={expandedContent && active === "symptoms" ? classes.active : null}>
          <FontAwesomeIcon icon={faSearch}/>
          {expandedSide && <div>
            Symptoms
          </div>}
        </button>
        <button onClick={() => {setActive("conditions"); setExpandedSide(false); setExpandedContent(true)}} 
          className={expandedContent && active === "conditions" ? classes.active : null}>
          <FontAwesomeIcon icon={faStethoscope}/>
          {expandedSide && <div>
            Diagnoses
          </div>}
        </button>
        <button onClick={() => {setActive("notes"); setExpandedSide(false); setExpandedContent(true)}} 
          className={expandedContent && active === "notes" ? classes.active : null}>
          <FontAwesomeIcon icon={faCommentAlt}/>
          {expandedSide && <div>
            Doctor's Notes
          </div>}
        </button>
        <button onClick={() => toggleExpanded()} style={{"margin-top": "auto", "width": "1.5em"}}>
          <FontAwesomeIcon icon={expandedSide || expandedContent ? faArrowRight : faArrowLeft}/>
        </button>
      </div>
    )
  }

  return (
    <>
      <div className={expandedContent ? classes.infermedica + ' ' + classes.infermedicaActive : classes.infermedica}>
        {active === "notes" ? <div className={classes.question}>
          <h4>Doctor's Notes</h4>
        </div> : null}
        {active === "conditions" ? renderConditions() : null}
        {active === "symptoms" ? renderSymptoms() : null}
      </div>
      {renderSidebar()}
    </>
  )
}

export default Diagnoses;