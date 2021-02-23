import React, { useState } from "react";
import classes from './Assistant.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCommentAlt, faSearch, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import Symptoms from "./Symptoms/Symptoms";
import Conditions from "./Conditions/Conditions";
import Notes from "./Notes/Notes";
import PatientInfo from "./PatientInfo/PatientInfo";


const Assistant = ({
  consult,
  isLive,
  action
}) => {
  const [active, setActive] = useState(null);
  const [expandedSide, setExpandedSide] = useState(false);
  const [expandedContent, setExpandedContent] = useState(false);

  console.log(consult);

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

  function renderSidebar() {
    return (
      <div className={classes.sidebar}>
        <button onClick={() => { setActive("patient"); setExpandedSide(false); setExpandedContent(true); action(true) }}
          className={expandedContent && active === "patient" ? classes.active : null}>
          <img src={consult?.patient.picture} className="rounded-circle" width="31" />
          {expandedSide && <div>
            Patient Info
          </div>}
        </button>
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
        {active == "patient" ?
          <PatientInfo
            name={consult.patient.given_name + " " + consult.patient.family_name}
            picture={consult.patient.picture}
            purpose={consult.purpose}
          /> : null}
        {active === "notes" ?
          <Notes /> : null}
        {active === "conditions" ?
          <Conditions
            medicalConditions={consult.medical_conditions}
            question={consult.question}
          /> : null}
        {active === "symptoms" ?
          <Symptoms
            symptoms={consult.symptoms}
            consultId={consult.consult_id}
            startTime={consult.start_time}
            isLive={isLive}
          /> : null}
      </div>
      {renderSidebar()}
    </>
  )
}

export default Assistant;