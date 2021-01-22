import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './Navbar.module.css';

const AuthNav = (props) => {
  const { user, logout } = useAuth0();
  if (user) {
    const { name, picture } = user;
    return (
      <>
        <li>{'Hello, ' + name}</li>
        <Dropdown
          className={
            styles['user-drop'] +
            ' ' +
            styles['nav-item'] +
            ' ' +
            styles['dropdown'] +
            ' ' +
            styles['has-arrow'] +
            ' ' +
            styles['logged-item']
          }
        >
          <Dropdown.Toggle
            variant='success'
            id='dropdown-basic'
            className={styles['dropdown-toggle']}
          >
            <img
              className='rounded-circle'
              src={picture}
              width='31'
              alt={name}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles['dropdown-menu']}>
            <div className={styles['user-header']}>
              <div className={styles['avatar'] + ' ' + styles['avatar-sm']}>
                <img
                  src={picture}
                  alt='User'
                  className='avatar-img rounded-circle'
                />
              </div>
              <div className={styles['user-text']}>
                <h6>{name}</h6>
                <p className='text-muted mb-0'>{props.role}</p>
              </div>
            </div>
            <Dropdown.Item
              href='/doctor/doctor-dashboard'
              className={styles['dropdown-item']}
            >
              Dashboard
            </Dropdown.Item>
            <Dropdown.Item href='/profile' className={styles['dropdown-item']}>
              Profile Settings
            </Dropdown.Item>
            <Dropdown.Item
              className={styles['dropdown-item']}
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  } else {
    return <LoginButton />;
  }
};

export default AuthNav;
