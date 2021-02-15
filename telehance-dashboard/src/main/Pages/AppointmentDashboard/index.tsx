import React from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import {fetchWithToken, fetchWithUser} from 'Util/fetch';
import Spinner from 'Components/Spinner';
import BreadcrumbBar from 'Components/BreadcrumbBar/BreadcrumbBar';
import BootstrapTable from 'react-bootstrap-table-next';
import styles from "./AppointmentDashboard.module.css";
import { Container } from "react-bootstrap";
import filterFactory from "react-bootstrap-table2-filter";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import getColumns from './getColumns';
import paginationFactory from "react-bootstrap-table2-paginator";
import {RouteComponentProps} from "react-router-dom";
import ScheduleAppointment from "Pages/AppointmentDashboard/AppointmentModal";

function getRole(appointmentList: any) {
    if (appointmentList[0].patient) return 'DOCTOR';
    else return 'PATIENT';
}

const customTotal = (from: number, to: number, size: number) => (
    <span className='react-bootstrap-table-pagination-total'>
    &nbsp; Showing Appointments {from} to {to} of {size}
  </span>
);

const pagination = paginationFactory({
    firstPageText: '<<',
    prePageText: '<',
    nextPageText: '>',
    lastPageText: '>>',
    sizePerPage: 10,
    showTotal: true,
    paginationTotalRenderer: customTotal,
    alwaysShowAllBtns: true,
});

function AppointmentDashboard({ history }: RouteComponentProps) {
    const { user } = useAuth0();
    const user_id = user ? user.sub.split('|')[1] : 'NULL';
    const userToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
    const appToken = process.env.REACT_APP_APPOINTMENT_API_KEY;
    const { data: roleInfo } = useSWR(
        [
            'https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id',
            userToken,
            'POST',
            user_id,
        ],
        fetchWithUser
    );
    const role = JSON.parse(roleInfo.body).role.toLowerCase();
    const { data: appointmentList, error } = useSWR(
        [
            `https://klnb89q4vj.execute-api.us-west-2.amazonaws.com/dev/by${role}?${role}_id=${user_id}`,
            appToken,
        ],
        fetchWithToken
    );
    if (error || (appointmentList && appointmentList.length === 0))
        return <h1 style={{ textAlign: 'center' }}>No Appointments</h1>;
    if (!appointmentList) return <Spinner />;
    return (
        <>
            <BreadcrumbBar page='Appointment Dashboard' />
            <Container className={styles.container}>
                {(getRole(appointmentList) ===  'PATIENT')
                && <ScheduleAppointment/>}
                <ToolkitProvider
                    bootstrap4
                    keyField='id'
                    data={appointmentList}
                    columns={getColumns(history, getRole(appointmentList))}
                >
                    {({ baseProps }) => (
                        <>
                            <BootstrapTable
                                pagination={pagination}
                                filter={filterFactory()}
                                {...baseProps}
                            />
                        </>
                    )}
                </ToolkitProvider>
            </Container>
        </>
    );
}

export default AppointmentDashboard;
