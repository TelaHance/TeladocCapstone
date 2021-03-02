import React from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
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
import styles from './AppointmentDashboard.module.css';
import classes from "Pages/Admin/Admin.module.css";

function getRole(appointmentList: any) {
  if (appointmentList[0].patient) return 'DOCTOR';
  else return 'PATIENT';
}

function AppointmentDashboard() {
  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const userToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const appToken = process.env.REACT_APP_APPOINTMENT_API_KEY;
  const { data: roleInfo } = useSWR(
    [getUserUrl, userToken, 'POST', user_id],
    fetchWithUser
  );
  const role = JSON.parse(roleInfo.body).role.toLowerCase();
  const { data: appointmentList, error } = useSWR(
    [getApptsUrl(role, { user_id }), appToken],
    fetchWithToken
  );
  if (error || (appointmentList && appointmentList.length === 0))
    return <h1 style={{ textAlign: 'center' }}>No Appointments</h1>;
  if (!appointmentList) return <Spinner />;
  return (
    <>
      <BreadcrumbBar page='Appointment Dashboard' />
      <div className={styles.container}>
        {getRole(appointmentList) === 'PATIENT' && <ScheduleAppointment />}
        <TableWithBrowserPagination
          pageSize={3}
          data={appointmentList}
          keyField='id'
          className={classes['table']}
        >
          {getRole(appointmentList) === 'PATIENT' && (
            <Column
              header='Doctor'
              field='doctor'
              width={200}
              component={nameFormatter}
            />
          )}
          {getRole(appointmentList) === 'DOCTOR' && (
            <Column
              header='Patient'
              field='patient'
              width={200}
              component={nameFormatter}
            />
          )}
          <Column
            header='Appointment Date'
            field='start_time'
            defaultWidth={170}
            component={dateFormatter}
          />
          <Column
            header='Purpose'
            field='purpose'
            component={purposeFormatter}
          />
          {getRole(appointmentList) === 'DOCTOR' && (
            <Column
              header=''
              field='user_id'
              width={105}
              component={ButtonFormatter}
            />
          )}
        </TableWithBrowserPagination>
      </div>
    </>
  );
}

export default AppointmentDashboard;
