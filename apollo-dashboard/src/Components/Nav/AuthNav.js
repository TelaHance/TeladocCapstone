import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { Navbar } from "react-bootstrap";

const AuthNav = () => {
    const { user } = useAuth0();
    if(user) {
        const { name, picture } = user;
        return <>
            <Navbar.Text style={{marginRight: 15}}>{"Hello, " + name}</Navbar.Text>
            <img
                src={picture}
                alt="Profile"
                className="rounded-circle"
                width="36"
                style={{marginRight: 15}}
            />
            <LogoutButton />
        </>
    } else {
        return <LoginButton/>
    }
};

export default AuthNav;
