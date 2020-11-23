import React from "react";
import { Route } from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import useSWR from "swr";
import {fetchWithToken} from "../../Util/fetch";
import Loading from "../Loading/Loading";

const AuthorizedRoute = ({component, authorizedRoles, ...args}) => {
    const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
    const { isLoading, user } = useAuth0();
    const user_id = user ? user.sub.split('|')[1] : "NULL";
    const { data: roleInfo } = useSWR(
        ["https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id", awsToken, {
            headers: {
                "content-type": "application/json"
            },
            "body": user_id
        }],
        fetchWithToken
    );
    const isAuthorized = roleInfo && authorizedRoles.includes(roleInfo.role.toLowerCase());

    if (isLoading) {
        return <Loading />;
    }
    return (
        <Route component={isAuthorized ? component : null} {...args} />
    );
}

export default AuthorizedRoute;
