import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { PillTypes, getLabel } from '../Pill';
import { ConsultData } from '../../Consult';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import classes from './Filter.module.css';

export const DefaultThreshold: { [key: string]: number } = {
  FLIRTATION: 0.75,
  THREAT: 0.75,
  PROFANITY: 0.75,
  INSULT: 0.75,
  IDENTITY_ATTACK: 0.75,
  TOXICITY: 0.75,
};

export function filter(filterVal: Set<string>, data: ConsultData[]) {
  if (!filterVal || filterVal.size === 0) return data;

  return data.filter(({ sentiment }) => {
    let matchesOneFilter = false;
    filterVal.forEach((filter) => {
      if (sentiment === undefined) {
        if (filter === 'UNRATED') matchesOneFilter = true;
        return;
      }
      if (filter === 'NO_ISSUES') {
        matchesOneFilter =
          matchesOneFilter ||
          Object.entries(sentiment).every(
            ([attribute, score]) => score < DefaultThreshold[attribute]
          );
      } else {
        matchesOneFilter =
          matchesOneFilter || sentiment[filter] >= DefaultThreshold[filter];
      }
    });
    return matchesOneFilter;
  });
}

const bgColor: { [key: string]: string } = {
  FLIRTATION: '#e83e8c',
  THREAT: '#dc3545',
  PROFANITY: '#e65100',
  INSULT: '#ffee58',
  IDENTITY_ATTACK: '#007bff',
  TOXICITY: '#6f42c1',
  NO_ISSUES: '#28a745',
  UNRATED: '#6c757d',
};

function FilterItem({ attribute, active }: FilterItemProps) {
  return (
    <div className={classes['filter-item__container']}>
      <div
        className={classes['filter-item__box']}
        style={{ backgroundColor: bgColor[attribute] }}
      />
      <p>{getLabel(attribute)}</p>
      <FontAwesomeIcon icon={faCheck} color={active ? '#969696' : 'white'} />
    </div>
  );
}

type FilterItemProps = { attribute: string; active?: boolean };

export default function Filter({ onFilter }: any) {
  const [filterAttributes, setFilterAttributes] = useState(new Set<string>());
  const [open, setOpen] = useState(false);

  function onToggle(
    isOpen: boolean,
    event: React.SyntheticEvent<Dropdown>,
    metadata: {
      source: 'select' | 'click' | 'rootClose' | 'keydown';
    }
  ) {
    if (metadata.source === 'select') return setOpen(true);
    setOpen(isOpen);
  }

  function onChange(type: string) {
    const newFilterAttributes = new Set(filterAttributes);
    if (filterAttributes.has(type)) {
      newFilterAttributes.delete(type);
    } else newFilterAttributes.add(type);
    setFilterAttributes(newFilterAttributes);
  }

  useEffect(() => {
    onFilter(filterAttributes);
  }, [onFilter, filterAttributes]);

  return (
    <DropdownButton
      id='dropdown'
      title=''
      size='sm'
      menuAlign='right'
      show={open}
      onToggle={onToggle}
    >
      {PillTypes.map((type) => (
        <Dropdown.Item
          key={type}
          onClick={() => onChange(type)}
        >
          <FilterItem attribute={type} active={filterAttributes.has(type)} />
        </Dropdown.Item>
      ))}
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => setFilterAttributes(new Set<string>())}>
        Clear
      </Dropdown.Item>
    </DropdownButton>
  );
}
