import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { ColumnDescription } from 'react-bootstrap-table-next';
import { ConsultData, UserData } from 'Models';
import Sentiment from '../../Components/Sentiment';
import SentimentFilter, { filter } from '../../Components/Sentiment/Filter';
import classes from './ConsultDashboard.module.css';
import {Button} from "react-rainbow-components";

// FORMATTERS

export function dateFormatter (value:any) {
  if (typeof value.value === 'string') value.value = parseInt(value.value);
  const start = new Date(value.value);
  const date = start.toLocaleString('default', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
  });
  const time = start.toLocaleString('default', {
      hour: '2-digit',
      minute:'2-digit',
      hour12: true,
  });
  return(
      <div className={classes['date']}>
          <span> {date} </span>
          <br/>
          <span> {time} </span>
      </div>
  );
}

// const dateFormatter = (cell: number, row: ConsultData) => {
//   if (typeof cell === 'string') cell = parseInt(cell);
//   return new Date(cell).toLocaleString('default', {
//     month: 'long',
//     day: '2-digit',
//     year: 'numeric',
//   });
// };

// const csvDateFormatter = (cell: number | string, row: ConsultData) => {
//   if (typeof cell === 'string') cell = parseInt(cell);
//   return new Date(cell).toISOString().split('T')[0]; // yyyy-mm-dd
// };

// const firstNameFormatter = (cell: UserData, row: ConsultData) => {
//   return cell.given_name;
// };

// const lastNameFormatter = (cell: UserData, row: ConsultData) => {
//   return cell.family_name;
// };

export function nameFormatter(cell:any){
  return(
    <div>
      <img className="rounded-circle" src={cell.value.picture} width="31" alt=""></img>
      <span> {cell.value.given_name} {cell.value.family_name} </span>
    </div>
  )
}

export function sentimentFormatter(cell:any){
  if (cell.value === 'number') return (<div> <span>`${Math.round(cell.value * 100)}%`</span></div>);
  return <Sentiment sentiment={cell.value} />;
}

// const csvSentimentFormatter = (cell?: number, row?: ConsultData) => {
//   if (cell) return cell;
//   return -1;
// };

export function ButtonFormatter(
  cell: any
){
  const history = useHistory()
  return (
    <div className={classes['view-container']}>
      <Button onClick={() => history.push(`/consults/${cell.value}`)}>
        View
      </Button>
    </div>
  );
}

// COLUMN DESCRIPTIONS

// const start_date = {
//   dataField: 'start_time',
//   text: 'Consult Date',
//   formatter: dateFormatter,
//   csvFormatter: csvDateFormatter,
//   sort: true,
// };

// const doctor: ColumnDescription[] = [
//   {
//     dataField: 'doctor.given_name',
//     text: 'Doctor First Name',
//     hidden: true,
//   },
//   {
//     dataField: 'doctor.family_name',
//     text: 'Doctor Last Name',
//     hidden: true,
//   },
//   {
//     dataField: 'doctor',
//     text: 'Doctor',
//     formatter: nameFormatter,
//     csvExport: false,
//   },
// ];

// const patient: ColumnDescription[] = [
//   {
//     dataField: 'patient.given_name',
//     text: 'Patient First Name',
//     hidden: true,
//   },
//   {
//     dataField: 'patient.family_name',
//     text: 'Patient Last Name',
//     hidden: true,
//   },
//   {
//     dataField: 'patient',
//     text: 'Patient',
//     formatter: nameFormatter,
//     csvExport: false,
//   },
// ];

// const sentiment = {
//   dataField: 'sentiment',
//   text: 'Issues',
//   formatter: sentimentFormatter,
//   csvType: Number,
//   headerClasses: classes.issues,
//   // filter: textFilter({
//   //   // @ts-ignore
//   //   onFilter: filter
//   // }),
//   filterRenderer: (onFilter: any, column: any) => (
//     <SentimentFilter onFilter={onFilter} column={column} />
//   ),
// };

// export function viewConsult(history: RouteComponentProps['history']) {
//   return {
//     field: 'button',
//     header: 'Actions',
//     formatter: (cell: any, row: any) => buttonFormatter(cell, row, history),
//     csvExport: false,
//   };
// }

// PRIMARY FUNCTION

// export default function getColumns(
//   history: RouteComponentProps['history'],
//   role: string
// ): ColumnDescription[] {

//   let columns: ColumnDescription[] = [start_date];
//   if (role !== 'DOCTOR') {
//     columns = columns.concat(doctor);
//   }
//   if (role !== 'PATIENT') {
//     columns = columns.concat(patient);
//   }
//   if (role === 'ADMIN') {
//     columns = columns.concat(sentiment);
//   }
//   columns.push(viewConsult(history));

//   return columns;
// }
