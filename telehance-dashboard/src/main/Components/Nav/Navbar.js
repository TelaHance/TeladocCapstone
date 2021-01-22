import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth0 } from '@auth0/auth0-react';
import useSWR from 'swr';
import { fetchWithUser } from '../../Util/fetch';
import AuthNav from './AuthNav';
import styles from './Navbar.module.css';

// const handleOpen=()=>{
//   console.log('d');
//   // document.mainMenuWrapper.classList.toggle(styles['sidebar-open']);
//   setActive(true);
//   // console.log(active);
// }

// const handleClose=()=>{
//   console.log('d');
//   // document.mainMenuWrapper.classList.toggle(styles['sidebar-open']);
//   setActive(false);
//   // console.log(active);
// }

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
    <header className={styles.header}>
      <nav className={styles.navbar + ' ' + styles.headerNav}>
        <div className={styles.navbarHeader}>
          <a id={styles.mobile_btn} onClick={() => setActive(true)}>
            <span className={styles.barIcon}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>
          <Link to='/' className={styles.navbarBrand + ' ' + styles.logo}>
            <img src={logo} className='img-fluid' alt='Logo' />
          </Link>
        </div>
        <div
          className={
            active
              ? styles.mainMenuWrapper + ' ' + styles.sidebarOpen
              : styles.mainMenuWrapper
          }
        >
          <div className={styles.menuHeader}>
            <Link
              to='/'
              className={styles.menuLogo}
              onClick={() => setActive(false)}
            >
              <img src={logo} className='img-fluid' alt='Logo' />
            </Link>
            <a
              id='menu_close'
              className={styles.close + ' ' + styles.menuClose}
              onClick={() => setActive(false)}
            />
          </div>
          <ul className={styles.mainNav}>
            <li>
              <NavLink
                exact
                to='/'
                activeClassName={styles.active}
                onClick={() => setActive(false)}
              >
                TelaHance Dashboard
              </NavLink>
            </li>
            {isLoggedIn && (
              <li>
                <NavLink
                  to='/consults'
                  activeClassName={styles.active}
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
                  activeClassName={styles.active}
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
                  activeClassName={styles.active}
                  onClick={() => setActive(false)}
                >
                  Patients
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <ul className={styles['nav'] + ' ' + styles['header-navbar-rht']}>
          <AuthNav
            role={roleInfo?.body ? JSON.parse(roleInfo.body).role : null}
          />
        </ul>
      </nav>
    </header>
  );
};