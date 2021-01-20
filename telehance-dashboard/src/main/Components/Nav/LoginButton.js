import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import styles from './Navbar.module.css';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return (
        <li onClick={loginWithRedirect} className={styles.login}>
            Log In
        </li>
    );
};

export default LoginButton;
