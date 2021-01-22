import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ColumnDescription } from 'react-bootstrap-table-next';
import Button from 'react-bootstrap/Button';
import { ConsultData, UserData } from './Consult';

const dateFormatter = (cell: number, row: ConsultData) => {
  if (typeof cell === 'string')
    cell = parseInt(cell);
  return new Date(cell).toLocaleString('default', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
};

const csvDateFormatter = (cell: number | string, row: ConsultData) => {
  if (typeof cell === 'string')
    cell = parseInt(cell);
  return new Date(cell).toISOString().split('T')[0]; // yyyy-mm-dd
};

const firstNameFormatter = (cell: UserData, row: ConsultData) => {
  return cell.given_name;
};

const lastNameFormatter = (cell: UserData, row: ConsultData) => {
  return cell.family_name;
};

const nameFormatter = (cell: UserData, row: ConsultData) => {
  return `${cell.family_name}, ${cell.given_name}`;
};

const sentimentFormatter = (cell?: number, row?: ConsultData) => {
  if (cell) return `${Math.round(cell * 100)}%`;
  return 'Unrated';
};

const csvSentimentFormatter = (cell?: number, row?: ConsultData) => {
  if (cell) return cell;
  return -1;
}

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

export default function getColumns(
  history: RouteComponentProps['history']
): ColumnDescription[] {
  return [
    {
      dataField: 'timestamp',
      text: 'Appointment Date',
      formatter: dateFormatter,
      csvFormatter: csvDateFormatter,
      sort: true,
    },
    {
      dataField: 'doctor',
      text: 'Doctor First Name',
      hidden: true,
      csvFormatter: firstNameFormatter,
    },
    {
      dataField: 'doctor',
      text: 'Doctor Last Name',
      hidden: true,
      csvFormatter: lastNameFormatter,
    },
    {
      dataField: 'doctor',
      text: 'Doctor Name',
      formatter: nameFormatter,
      csvExport: false,
    },
    {
      dataField: 'patient',
      text: 'Patient First Name',
      hidden: true,
      csvFormatter: firstNameFormatter,
    },
    {
      dataField: 'patient',
      text: 'Patient Last Name',
      hidden: true,
      csvFormatter: lastNameFormatter,
    },
    {
      dataField: 'patient',
      text: 'Patient Name',
      formatter: nameFormatter,
      csvExport: false,
    },
    {
      dataField: 'sentiment',
      text: 'Problematic Consult Rating',
      formatter: sentimentFormatter,
      csvFormatter: csvSentimentFormatter,
      csvType: Number,
      sort: true,
    },
    {
      dataField: 'button',
      text: 'Actions',
      formatter: (cell, row) => buttonFormatter(cell, row, history),
      csvExport: false,
    },
  ];
}
