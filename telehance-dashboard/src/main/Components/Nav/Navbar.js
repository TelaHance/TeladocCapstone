import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';
import { Link, NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserUrl } from 'Api';
import { fetchWithUser } from 'Util/fetch';
import logo from 'assets/TelaHance2.svg';
import AuthNav from './AuthNav';
import styles from './Navbar.module.css';

const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;

export default function Navbar() {
  const [active, setActive] = useState(false);
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

  const menuButton = (
    <button className={styles.hamburgerMenu} onClick={() => setActive(true)}>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );

  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        <div className={styles.navbarHeader}>
          {menuButton}
          <Link to='/' className={clsx(styles.navbarBrand, styles.logo)}>
            <img src={logo} alt='Logo' />
          </Link>
        </div>
        <div
          className={clsx(styles.mainMenuWrapper, {
            [styles.sidebarOpen]: active,
          })}
        >
          <div className={styles.menuHeader}>
            <Link
              to='/'
              className={styles.menuLogo}
              onClick={() => setActive(false)}
            >
              <img src={logo} alt='Logo' />
            </Link>
            <button
              id='menu_close'
              className={clsx(styles.close, styles.menuClose)}
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
                Home
              </NavLink>
            </li>
            {(role === 'patient' || role === 'doctor' || role === 'demo') && (
              <li>
                <NavLink
                  to='/appointments'
                  activeClassName={styles.active}
                  onClick={() => setActive(false)}
                >
                  Appointments
                </NavLink>
              </li>
            )}
            {role && (
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
            {(role === 'admin' || role === 'demo') && (
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
            
          </ul>
        </div>
        <ul className={clsx(styles.nav, styles['header-navbar-rht'])}>
          <AuthNav role={role} />
        </ul>
      </nav>
    </header>
  );
}
