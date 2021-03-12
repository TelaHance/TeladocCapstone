import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useSWR from 'swr';
import { getUserUrl, getAllUsersUrl, adminGraphUrl } from 'Api';
import { fetchWithToken, fetchWithUser } from 'Util/fetch';
import { Container } from 'react-bootstrap';
import BreadcrumbBar from 'Components/BreadcrumbBar/BreadcrumbBar';
import { nameFormatter, roleBadge } from 'Pages/Admin/getColumns';
import {
  TableWithBrowserPagination,
  Column,
  MenuItem,
} from 'react-rainbow-components';
import AdminCharts from 'Pages/Admin/AdminCharts';
import classes from './Admin.module.css';

const Admin = () => {
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { data: users, mutate: mutateUsers } = useSWR(
    [getAllUsersUrl, awsToken],
    fetchWithToken
  );
  const consultToken = process.env.REACT_APP_CONSULT_API_KEY;
  const { data: consults } = useSWR(
    [adminGraphUrl, consultToken],
    fetchWithToken
  );
  const [role, setRole] = useState();
  const { user } = useAuth0();
  const sub = user ? user.sub.split('|')[1] : 'NULL';
  const { data: userData } = useSWR(
    [getUserUrl, awsToken, 'POST', sub],
    fetchWithUser
  );

  useEffect(() => {
    if (userData?.body) {
      setRole(JSON.parse(userData.body).role.toLowerCase());
    }
  }, [userData]);
  const changeRole = async (id, role) => {
    try {
      await fetchWithToken(getUserUrl, awsToken, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id,
          role: role,
        }),
      });
    } catch (e) {
      console.log(e);
    }
    await mutateUsers();
  };
  return (
    <>
      <BreadcrumbBar page='Admin Panel' />
      <Container className='mb-5'>
        <AdminCharts consults={consults} />
        <br />
        <br />
        {role === 'admin' && <h5 className='text-left'>Manage Users</h5>}
        {role === 'admin' && <TableWithBrowserPagination
          pageSize={10}
          data={users}
          keyField='user_id'
          className={classes.table}
        >
          <Column header='Name' field='name' component={nameFormatter} />
          <Column header='email' field='email' />
          <Column
            header='Status'
            field='status'
            component={roleBadge}
            width={90}
          />
          <Column type='action' width={75}>
            <MenuItem
                label='Change Role'
                variant="header"
            />
            <MenuItem
              label='Admin'
              onClick={(event, data) => changeRole(data.user_id, 'Admin')}
            />
            <MenuItem
              label='Doctor'
              onClick={(event, data) => changeRole(data.user_id, 'Doctor')}
            />
            <MenuItem
              label='Patient'
              onClick={(event, data) => changeRole(data.user_id, 'Patient')}
            />
            <MenuItem
              label='Demo'
              onClick={(event, data) => changeRole(data.user_id, 'Demo')}
            />
          </Column>
        </TableWithBrowserPagination>}
      </Container>
    </>
  );
};

export default Admin;
