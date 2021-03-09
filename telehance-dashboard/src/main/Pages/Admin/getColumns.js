import React from 'react';
import { Avatar, Badge } from 'react-rainbow-components';
import classes from './Admin.module.css';

export function nameFormatter({ row }) {
  const fullName = `${row.given_name} ${row.family_name}`;
  return (
    <>
      <Avatar
        src={row.picture}
        assistiveText={fullName}
        title={fullName}
        className={classes.avatar}
      />
      <span>{fullName}</span>
    </>
  );
}

export function roleBadge({ row }) {
  return <Badge label={row.role} variant='brand' />;
}
