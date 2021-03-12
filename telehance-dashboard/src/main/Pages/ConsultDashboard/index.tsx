import React, { useState,useEffect } from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllConsultsUrl, getUserUrl } from 'Api';
import { fetchWithToken, fetchWithUser } from 'Util/fetch';
import { withRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Spinner from 'Components/Spinner';
import BreadcrumbBar from 'Components/BreadcrumbBar/BreadcrumbBar';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import {Column, TableWithBrowserPagination} from "react-rainbow-components";
import {
  ButtonFormatter,
  sentimentFormatter,
  nameFormatter,
  dateFormatter,
} from './getColumns';
import classes from './ConsultDashboard.module.css';



const { REACT_APP_CONSULT_API_KEY, REACT_APP_MANAGEMENT_API_KEY } = process.env;

function ConsultDashboard() {
  const [displayConsults,setDisplayConsults] = useState()

  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const { data: userData } = useSWR(
    [getUserUrl, REACT_APP_MANAGEMENT_API_KEY, 'POST', user_id],
    fetchWithUser
  );
  const role = JSON.parse(userData.body).role.toUpperCase();

  const { data: consults, error } = useSWR(
    [getAllConsultsUrl({ user_id }), REACT_APP_CONSULT_API_KEY],
    fetchWithToken
  );

  useEffect(() => {
    setDisplayConsults((prevConsult)=>prevConsult ?? consults)
  }, [consults]);

  if (!consults) return <Spinner />;
  if (error)
    return <h1 style={{ textAlign: 'center' }}>Error retrieving consults.</h1>;


  return (
    <>
      <BreadcrumbBar page='Consult Dashboard' />
      <Container className='mb-5 text-center'>
        <TableWithBrowserPagination
          pageSize={5}
          data={displayConsults}
          keyField='id'
          className={classes.table}
        >
          {role !== 'DOCTOR' && (
            <Column
              header='Doctor'
              field='doctor'
              component={nameFormatter}
            />
          )}
          {role !== 'PATIENT' && (
            <Column
              header='Patient'
              field='patient'
              component={nameFormatter}
            />
          )}
          <Column
            header='Consult Date'
            field='start_time'
            component={dateFormatter}
          />
          <Column
            header='Insults'
            field='sentiment'
            component={sentimentFormatter}
          />
          <Column
            header=''
            defaultWidth={183}
            field='consult_id'
            component={ButtonFormatter}
          />
        </TableWithBrowserPagination>
      </Container>
    </>
  );
}

export default withRouter(ConsultDashboard);
