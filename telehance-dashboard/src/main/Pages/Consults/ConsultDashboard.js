import React from 'react';
import { Container } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithToken } from '../../Util/fetch';
import { Link } from 'react-router-dom';
import example_consultList from './assets/example_consult_list.json';

const ConsultDashboard = (props) => {
  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const consultList = example_consultList;
//   const { data: consultList, error, mutate: mutateConsults } = useSWR(
//     [
//       `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-all?user_id=${user_id}`,
//       awsToken,
//     ],
//     fetchWithToken
//   );
  const dateFormatter = (cell, row) => {
    const date = new Date(Number(cell));
    return date.toLocaleString('default', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
  };
  const nameFormatter = (cell, row) => {
    return `${cell.family_name}, ${cell.given_name}`;
  };
  const buttonFormatter = (cell, row) => {
    return (
      <Link
        to={{
          pathname: `/consults/${row.consult_id}`,
          data: row,
        }}
      >
        View
      </Link>
    );
  };
  const columns = [
    {
      dataField: 'consult_id',
      text: 'Consult ID',
    },
    {
      dataField: 'timestamp',
      text: 'Appointment Date',
      formatter: dateFormatter,
    },
    {
      dataField: 'doctor',
      text: 'Doctor Name',
      formatter: nameFormatter,
    },
    {
      dataField: 'patient',
      text: 'Patient Name',
      formatter: nameFormatter,
    },
    {
      dataField: 'sentiment',
      text: 'Toxicity Rating',
    },
    {
      dataField: 'button',
      text: 'Actions',
      formatter: buttonFormatter,
    },
  ];
  return (
    <Container className='mb-5'>
      <h1>Consult Dashboard</h1>
      {consultList ? (
        <BootstrapTable
          keyField='id'
          data={consultList || []}
          columns={columns}
        />
      ) : (
        <h2>No Consults</h2>
      )}
    </Container>
  );
};

export default ConsultDashboard;
