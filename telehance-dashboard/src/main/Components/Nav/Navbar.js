import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth0 } from '@auth0/auth0-react';
import useSWR from 'swr';
import { fetchWithUser } from '../../Util/fetch';
import AuthNav from './AuthNav';
import classes from './Navbar.module.css';

export default function Navbar() {
  const [active, setActive] = useState(false);
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { user } = useAuth0();
  const sub = user ? user.sub.split('|')[1] : 'NULL';
  const { data: roleInfo } = useSWR(
    [
      'https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id',
      awsToken,
      'POST',
      sub,
    ],
    fetchWithUser
  );
  const isLoggedIn = roleInfo?.body
    ? JSON.parse(roleInfo.body).role.toLowerCase()
    : null;
  const isAdmin = roleInfo?.body
    ? 'admin' === JSON.parse(roleInfo.body).role.toLowerCase()
    : null;
  const isDoctor = roleInfo?.body
    ? 'doctor' === JSON.parse(roleInfo.body).role.toLowerCase()
    : null;
  return (
    <header className={classes.header}>
      <nav className={classes.navbar + ' ' + classes.headerNav}>
        <div className={classes.navbarHeader}>
          <a id={classes.mobile_btn} onClick={() => setActive(true)}>
            <span className={classes.barIcon}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>
          <Link to='/' className={classes.navbarBrand + ' ' + classes.logo}>
            <img src={logo} className='img-fluid' alt='Logo' />
          </Link>
        </div>
        <div
          className={
            active
              ? classes.mainMenuWrapper + ' ' + classes.sidebarOpen
              : classes.mainMenuWrapper
          }
        >
          <div className={classes.menuHeader}>
            <Link
              to='/'
              className={classes.menuLogo}
              onClick={() => setActive(false)}
            >
              <img src={logo} className='img-fluid' alt='Logo' />
            </Link>
            <a
              id='menu_close'
              className={classes.close + ' ' + classes.menuClose}
              onClick={() => setActive(false)}
            />
          </div>
          <ul className={classes.mainNav}>
            <li>
              <NavLink
                exact
                to='/'
                activeClassName={classes.active}
                onClick={() => setActive(false)}
              >
                TelaHance Dashboard
              </NavLink>
            </li>
            {isLoggedIn && (
              <li>
                <NavLink
                  to='/consults'
                  activeClassName={classes.active}
                  onClick={() => setActive(false)}
                >
                  Consults
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink
                  to='/admin'
                  activeClassName={classes.active}
                  onClick={() => setActive(false)}
                >
                  Admin
                </NavLink>
              </li>
            )}
            {isDoctor && (
              <li>
                <NavLink
                  to='/patients'
                  activeClassName={classes.active}
                  onClick={() => setActive(false)}
                >
                  Patients
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <ul className={classes['nav'] + ' ' + classes['header-navbar-rht']}>
          <AuthNav
            role={roleInfo?.body ? JSON.parse(roleInfo.body).role : null}
          />
        </ul>
      </nav>
    </header>
  );
}
