import React from 'react';
import { Table, DropdownButton, Dropdown } from 'react-bootstrap';
import { fetchWithToken } from '../../Util/fetch';
import useSWR from 'swr';
import Container from 'react-bootstrap/Container';
import './Admin.module.css';
import BreadcrumbBar from 'src/main/Components/BreadcrumbBar/BreadcrumbBar';

const Admin = () => {
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { data: users, mutate: mutateUsers } = useSWR(
    [
      'https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-get-all',
      awsToken,
    ],
    fetchWithToken
  );

  const changeRole = async (id, role) => {
    try {
      await fetchWithToken(
        'https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id',
        awsToken,
        {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            user_id: id,
            role: role,
          }),
        }
      );
    } catch (e) {
      console.log(e);
    }
    await mutateUsers();
  };
  return (
    <>
      <BreadcrumbBar page='Admin Panel' />
      <h2 className='text-center'>All Users</h2>
      <Container className='mb-5'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.email}</td>
                    <td>{user.given_name}</td>
                    <td>{user.family_name}</td>
                    <td>{user.role}</td>
                    <td>
                      <DropdownButton
                        alignRight
                        title='Change Role'
                        id='dropdown-menu-align-right'
                        onSelect={async (e) => {
                          await changeRole(user.user_id, e);
                        }}
                      >
                        <Dropdown.Item eventKey='Admin'>Admin</Dropdown.Item>
                        <Dropdown.Item eventKey='Doctor'>Doctor</Dropdown.Item>
                        <Dropdown.Item eventKey='Patient'>
                          Patient
                        </Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Admin;
