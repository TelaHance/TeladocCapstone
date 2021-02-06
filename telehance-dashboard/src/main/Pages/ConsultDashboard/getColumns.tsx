import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ColumnDescription } from 'react-bootstrap-table-next';
import { textFilter } from 'react-bootstrap-table2-filter';
import Button from 'react-bootstrap/Button';
import { ConsultData, UserData } from '../Consult';
import Sentiment from '../../Components/Sentiment';
import SentimentFilter, { filter } from '../../Components/Sentiment/Filter';
import classes from './ConsultDashboard.module.css';

// FORMATTERS

const dateFormatter = (cell: number, row: ConsultData) => {
  if (typeof cell === 'string') cell = parseInt(cell);
  return new Date(cell).toLocaleString('default', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
};

const csvDateFormatter = (cell: number | string, row: ConsultData) => {
  if (typeof cell === 'string') cell = parseInt(cell);
  return new Date(cell).toISOString().split('T')[0]; // yyyy-mm-dd
};

const nameFormatter = (cell: UserData, row: ConsultData) => {
  return(
    <div>
      <img className={classes['rounded-circle']} src={cell.picture} width="31" alt=""></img>
      <span> {cell.given_name} {cell.family_name} </span>
    </div>
  )
};

const sentimentFormatter = (cell?: any, row?: ConsultData) => {
  if (typeof cell === 'number') return `${Math.round(cell * 100)}%`;
  return <Sentiment sentiment={cell} />;
};

const csvSentimentFormatter = (cell?: number, row?: ConsultData) => {
  if (cell) return cell;
  return -1;
};

const buttonFormatter = (
  cell: any,
  row: ConsultData,
  history: RouteComponentProps['history']
) => {
  return (
    <Button onClick={() => history.push(`/consults/${row.consult_id}`)}>
      View
    </Button>
  );
};

// COLUMN DESCRIPTIONS

const start_date = {
  dataField: 'start_time',
  text: 'Appointment Date',
  formatter: dateFormatter,
  csvFormatter: csvDateFormatter,
  sort: true,
};

const doctor = [
  {
    dataField: 'doctor.given_name',
    text: 'Doctor First Name',
    hidden: true,
  },
  {
    dataField: 'doctor.family_name',
    text: 'Doctor Last Name',
    hidden: true,
  },
  {
    dataField: 'doctor',
    text: 'Doctor',
    formatter: nameFormatter,
    csvExport: false,
  },
];

const patient: ColumnDescription[] = [
  {
    dataField: 'patient.given_name',
    text: 'Patient First Name',
    hidden: true,
  },
  {
    dataField: 'patient.family_name',
    text: 'Patient Last Name',
    hidden: true,
  },
  {
    dataField: 'patient',
    text: 'Patient',
    formatter: nameFormatter,
    csvExport: false,
  },
];

const sentiment = {
  dataField: 'sentiment',
  text: 'Issues',
  formatter: sentimentFormatter,
  csvFormatter: csvSentimentFormatter,
  csvType: Number,
  headerClasses: classes.issues,
  filter: textFilter({
    // @ts-ignore
    onFilter: filter
  }),
  filterRenderer: (onFilter: any, column: any) => (
    <SentimentFilter onFilter={onFilter} column={column} />
  ),
};

function viewConsult(history: RouteComponentProps['history']) {
  return {
    dataField: 'button',
    text: 'Actions',
    formatter: (cell: any, row: any) => buttonFormatter(cell, row, history),
    csvExport: false,
  };
}

// PRIMARY FUNCTION

export default function getColumns(
  history: RouteComponentProps['history'],
  role: string
): ColumnDescription[] {

  let columns: ColumnDescription[] = [start_date];
  if (role !== 'DOCTOR') {
    columns = columns.concat(doctor);
  }
  if (role !== 'PATIENT') {
    columns = columns.concat(patient);
  }
  if (role === 'ADMIN') {
    columns = columns.concat(sentiment);
  }
  columns.push(viewConsult(history));

  return columns;
}
