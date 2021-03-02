import React from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllConsultsUrl } from 'Api';
import { fetchWithToken } from 'Util/fetch';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Spinner from 'Components/Spinner';
import BreadcrumbBar from 'Components/BreadcrumbBar/BreadcrumbBar';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { Column, TableWithBrowserPagination} from "react-rainbow-components";
import {ButtonFormatter, sentimentFormatter, nameFormatter, dateFormatter} from './getColumns';

function getRole(consultList: any) {
  if (consultList[0].doctor && consultList[0].patient) return 'ADMIN';
  else if (consultList[0].patient) return 'DOCTOR';
  else return 'PATIENT';
}

function ConsultDashboard({ history }: RouteComponentProps) {
  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;

  const { data: consultList, error } = useSWR(
    [getAllConsultsUrl({ user_id }), awsToken],
    fetchWithToken
  );

  if (error || (consultList && consultList.length === 0))
    return <h1 style={{ textAlign: 'center' }}>No Consults</h1>;
  if (!consultList) return <Spinner />;

  return (
    <>
      <BreadcrumbBar page='Consult Dashboard' />
      <Container className='mb-5 text-center'>
        <TableWithBrowserPagination pageSize={5} data={consultList} keyField="id">
                    {(getRole(consultList) !== 'DOCTOR') &&
                    <Column header="Doctor" defaultWidth={180} field="doctor" component={nameFormatter}/>
                    }
                    {(getRole(consultList) !== 'PATIENT') &&
                    <Column header="Patient" defaultWidth={180} field="patient" component={nameFormatter} />
                    }
                    <Column header="Consult Date" defaultWidth={180} field="start_time" component={dateFormatter}/>
                    <Column header="Problematic Rating" defaultWidth={190} field="sentiment" component={sentimentFormatter}/>
                    <Column header="" defaultWidth={200} field="consult_id" component={ButtonFormatter}/>
            </TableWithBrowserPagination>
      </Container>
    </>
  );
}

export default withRouter(ConsultDashboard);
