import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AuthNav from "../Nav/AuthNav";

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
                <LinkContainer to={"/admin"}>
                    <Nav.Link>Admin</Nav.Link>
                </LinkContainer>}
                <LinkContainer to={"/profile"}>
                    <Nav.Link>Profile</Nav.Link>
                </LinkContainer>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
                <AuthNav />
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNavbar;
