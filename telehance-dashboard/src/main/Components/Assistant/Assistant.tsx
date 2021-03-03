import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  faCommentAlt,
  faSearch,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { LiveConsultData, EntityData, InfermedicaData } from 'Models';
import Symptoms from './Symptoms/Symptoms';
import Conditions from './Conditions/Conditions';
import Notes from './Notes/Notes';
import Sidebar, { Tools } from './Sidebar';
import classes from './Assistant.module.css';
import { diagnoseUrl } from 'Api';
import { fetchWithToken } from 'Util/fetch';

const tools = {
  symptom: {
    icon: faSearch,
    label: 'Symptoms',
    component: Symptoms,
  },
  conditions: {
    icon: faStethoscope,
    label: 'Diagnoses',
    component: Conditions,
  },
  notes: {
    icon: faCommentAlt,
    label: 'Notes',
    component: Notes,
  },
} as Tools;

const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;

export default function Assistant({
  consult,
  newEntities,
  action,
}: AssistantProps) {
  const {
    consult_id,
    start_time,
    symptoms: entities,
    medical_conditions,
    question,
    patient,
  } = consult;

  const [currentTool, setCurrentTool] = useState<string>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [diagnoseResult, setDiagnoseResult] = useState<
    Omit<InfermedicaData, 'symptoms'>
  >();
  const [medicalTerms, setMedicalTerms] = useState(entities ?? []);

  useEffect(() => {
    if (newEntities) {
      setMedicalTerms((prevTerms) => {
        const oldTerms = prevTerms.filter((prevTerm) =>
          newEntities.every((entity) => prevTerm.id !== entity.id)
        );
        return [...oldTerms, ...newEntities];
      });
    }
  }, [newEntities]);

  function changeTool(option: string) {
    setIsExpanded(!(currentTool === option && isExpanded))
    action(!(currentTool === option && isExpanded))
    setCurrentTool((oldTool) => (oldTool !== option ? option : oldTool));
  }

  async function diagnose() {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        symptoms: medicalTerms,
        start_time,
        consult_id,
        patient_id: patient.user_id,
      }),
    };
    try {
      const response = await fetchWithToken(diagnoseUrl, awsToken, options);
      setDiagnoseResult(response);
    } catch (e) {
      alert(`Submission failed! ${e.message}`);
    }
  }

  const Tool = currentTool ? tools[currentTool].component : () => <></>;

  return (
    <>
      <div
        className={clsx(classes.infermedica, {
          [classes.infermedicaActive]: isExpanded,
        })}
      >
        <Tool
          consultId={consult_id}
          startTime={start_time}
          medicalTerms={medicalTerms}
          medicalConditions={
            // @ts-ignore
            diagnoseResult?.conditions ?? medical_conditions
          }
          question={diagnoseResult?.question ?? question}
          diagnose={diagnose}
          setMedicalTerms={setMedicalTerms}
        />
      </div>
      <Sidebar currentTool={currentTool} onClick={changeTool} tools={tools} isExpanded={isExpanded} />
    </>
  );
}

type AssistantProps = {
  consult: LiveConsultData;
  newEntities?: EntityData[];
  action: (bool: boolean) => void;
};
