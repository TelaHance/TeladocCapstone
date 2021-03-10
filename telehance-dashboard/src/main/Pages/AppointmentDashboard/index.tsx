import React from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import { Container } from 'react-bootstrap';
import { getApptsUrl, getUserUrl } from 'Api';
import { fetchWithToken, fetchWithUser } from 'Util/fetch';
import Spinner from 'Components/Spinner';
import BreadcrumbBar from 'Components/BreadcrumbBar/BreadcrumbBar';
import {
  ButtonFormatter,
  dateFormatter,
  nameFormatter,
  purposeFormatter,
} from './getColumns';
import ScheduleAppointment from 'Pages/AppointmentDashboard/AppointmentModal';
import { Column, TableWithBrowserPagination } from 'react-rainbow-components';
import classes from 'Pages/Admin/Admin.module.css';

const {
  REACT_APP_MANAGEMENT_API_KEY,
  REACT_APP_APPOINTMENT_API_KEY,
} = process.env;

export default function AppointmentDashboard() {
  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const { data: userData } = useSWR(
    [getUserUrl, REACT_APP_MANAGEMENT_API_KEY, 'POST', user_id],
    fetchWithUser
  );

  const role = JSON.parse(userData.body).role.toUpperCase();

  const { data: appointments, error } = useSWR(
    [getApptsUrl(role, { user_id }), REACT_APP_APPOINTMENT_API_KEY],
    fetchWithToken
  );

  if (!appointments) return <Spinner />;
  if (error)
    return (
      <h1 style={{ textAlign: 'center' }}>Error retrieving appointments.</h1>
    );

  return (
    <>
      <BreadcrumbBar page='Appointment Dashboard' />
      <Container className='mb-5 text-center'>
        {role === 'PATIENT' || role === 'DEMO' && <ScheduleAppointment />}
        <TableWithBrowserPagination
          pageSize={3}
          data={appointments}
          keyField='id'
          className={classes.table}
        >
          {role === 'PATIENT' || role === 'DEMO' && (
            <Column
              header='Doctor'
              field='doctor'
              defaultWidth={200}
              component={nameFormatter}
            />
          )}
          {role === 'DOCTOR' && (
            <Column
              header='Patient'
              field='patient'
              defaultWidth={200}
              component={nameFormatter}
            />
          )}
          <Column
            header='Appointment Date'
            field='start_time'
            defaultWidth={200}
            component={dateFormatter}
          />
          <Column
            header='Purpose'
            field='purpose'
            component={purposeFormatter}
          />
          {role === 'DOCTOR' && (
            <Column header='' defaultWidth={150} component={ButtonFormatter} />
          )}
        </TableWithBrowserPagination>
      </Container>
    </>
  );
}
