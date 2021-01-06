import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AuthNav from "./AuthNav";
import {useAuth0} from "@auth0/auth0-react";
import useSWR from "swr";
import {fetchWithUser} from "../../Util/fetch";

function AppNavbar() {
    const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
    const { user } = useAuth0();
    const sub = user ? user.sub.split('|')[1] : "NULL";
    const { data: roleInfo} = useSWR(
        ["https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id", awsToken, 'POST', sub],
        fetchWithUser);
    const isLoggedIn = (roleInfo?.body) ? JSON.parse(roleInfo.body).role.toLowerCase() : null;
    const isAdmin = (roleInfo?.body) ? "admin" === JSON.parse(roleInfo.body).role.toLowerCase() : null;
    const isDoctor = (roleInfo?.body) ? "doctor" === JSON.parse(roleInfo.body).role.toLowerCase() : null;
    return (
        <Navbar bg="dark" variant="dark">
            <LinkContainer to={""}>
                <Navbar.Brand data-testid="brand">TelaHance Dashboard</Navbar.Brand>
            </LinkContainer>
            <Nav>
                { isLoggedIn &&
                    (<LinkContainer to={"/consults"}>
                        <Nav.Link>Consults</Nav.Link>
                    </LinkContainer>)
                }
                { isAdmin &&
                    (<LinkContainer to={"/admin"}>
                        <Nav.Link>Admin</Nav.Link>
                    </LinkContainer>)
                }
                {isDoctor &&
                (<LinkContainer to={"/patients"}>
                    <Nav.Link>Patients</Nav.Link>
                </LinkContainer>)
                }
                {isLoggedIn &&
                    (<LinkContainer to={"/profile"}>
                        <Nav.Link>Profile</Nav.Link>
                    </LinkContainer>)
                }
            </Nav>
            <Navbar.Collapse className="justify-content-end">
                <AuthNav />
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AppNavbar;
