import React, { useState, useEffect } from 'react';
import { ConsultData } from 'Models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './Filter.module.css';
import { Option,ButtonIcon } from 'react-rainbow-components';
import {
  faArrowDown,
  faCircle
} from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import InternalDropdown from 'react-rainbow-components/components/InternalDropdown';

const DefaultThreshold: { [key: string]: number } = {
  FLIRTATION: 0.75,
  THREAT: 0.75,
  PROFANITY: 0.75,
  INSULT: 0.75,
  IDENTITY_ATTACK: 0.75,
  TOXICITY: 0.75,
};


function onFilter(filterVal: any, data: ConsultData[]) {
  if (!filterVal || filterVal.length === 0) return data;

  console.log(filterVal)
  return data.filter(({ sentiment }) => {
    let matchesOneFilter = false;
    filterVal.forEach(({name}:any) => {
      if (sentiment === undefined) {
        if (name === 'UNRATED') matchesOneFilter = true;
        return;
      }
      if (name === 'NO_ISSUES') {
        matchesOneFilter =
          matchesOneFilter ||
          Object.entries(sentiment).every(
            ([attribute, score]) => score < DefaultThreshold[attribute]
          );
      } else {
        matchesOneFilter =
          matchesOneFilter || sentiment[name] >= DefaultThreshold[name];
      }
    });
    return matchesOneFilter;
  });
}

export default function Filter({ setDisplayConsult, consults }: any) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState();

  useEffect(() => {
    setDisplayConsult(onFilter(value,consults));
  }, [value]);
  return (
    <div className={classes.container}>
      <div>
      <span style={{marginLeft:"57px",marginRight: "10px"}}>Issues</span>
      <ButtonIcon onClick={() => setShow((show) => !show)} onBlur={()=>setShow(false)} variant="border-filled" size="small" tooltip="Arrow down" icon={<FontAwesomeIcon icon={faArrowDown} />} />
      </div>
      {show ? (
        <InternalDropdown className={classes.dropdown} value={value} onChange={setValue} multiple>
          <Option label={'Toxicity'} name={'TOXICITY'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#532197' }} />} />
          <Option label={'Profanity'} name={'PROFANITY'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#e65100' }} />} />
          <Option label={'Insult'} name={'INSULT'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#d6cd00' }} />} />
          <Option label={'Flirtation'} name={'FLIRTATION'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#e83e8c' }} />} />
          <Option label={'Threat'} name={'THREAT'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#dc3545' }} />} />
          <Option label={'Identity Attack'} name={'IDENTITY_ATTACK'} icon={<FontAwesomeIcon icon={faCircle} style={{ color: '#007bff' }} />} />
        </InternalDropdown>
      ) : null}
    </div>
  );
}
