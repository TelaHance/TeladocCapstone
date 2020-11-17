import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AuthNav from "../Nav/AuthNav";
import { IsAdmin } from "../../Util/helpers"

function AppNavbar() {
    return (
        <Navbar bg="dark" variant="dark">
            <LinkContainer to={""}>
                <Navbar.Brand data-testid="brand">Apollo Dashboard</Navbar.Brand>
            </LinkContainer>
            <Nav>
                <LinkContainer to={"/consults"}>
                    <Nav.Link>Consults</Nav.Link>
                </LinkContainer>
                <LinkContainer to={"/profile"}>
                    <Nav.Link>Profile</Nav.Link>
                </LinkContainer>
                {IsAdmin() && <LinkContainer to={"/roles"}>
                    <Nav.Link>Roles</Nav.Link>
                </LinkContainer>}
            </Nav>
            <Navbar.Collapse className="justify-content-end">
                <AuthNav />
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNavbar;
