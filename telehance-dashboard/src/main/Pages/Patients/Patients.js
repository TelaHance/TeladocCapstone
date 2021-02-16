import React from 'react';
import { fetchWithToken } from '../../Util/fetch';
import useSWR from 'swr';
import Container from 'react-bootstrap/Container';
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom';
const Patient = () => {
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { data: patientList } = useSWR(
    [
      'https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/patient-get-all',
      awsToken,
    ],
    fetchWithToken
  );
  const buttonFormatter = (cell, row) => {
    return (
      <Link
        className='btn btn-primary'
        to={{
          pathname: `/appointments/${row.phone}`,
        }}
      >
        Call Patient
      </Link>
    );
  };
  const columns = [
    {
      dataField: 'user_id',
      text: 'Id',
    },
    {
      dataField: 'given_name',
      text: 'First Name',
    },
    {
      dataField: 'family_name',
      text: 'Last Name',
    },
    {
      dataField: 'button',
      text: 'Actions',
      formatter: buttonFormatter,
    },
  ];
  const patients = patientList ? JSON.parse(patientList.body) : [];
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Initiate Consultation</h1>
      <h2
        style={{ textAlign: 'center' }}
      >
        All Patients
      </h2>
      <Container className='mb-5'>
        <BootstrapTable keyField='user_id' data={patients} columns={columns} />
      </Container>
    </>
  );
};

export default Patient;
