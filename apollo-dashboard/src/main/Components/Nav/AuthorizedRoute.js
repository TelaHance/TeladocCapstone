import React from "react";
import { Route } from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import useSWR from "swr";
import {fetchWithToken, fetchWithUser} from "../../Util/fetch";
import Loading from "../Loading/Loading";

const AuthorizedRoute = ({component, authorizedRoles, ...args}) => {
    const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
    const { isLoading, user } = useAuth0();
    const sub = user ? user.sub.split('|')[1] : "NULL";
    const { data: roleInfo} = useSWR(
        ["https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id", awsToken, 'POST', sub],
        fetchWithUser);
    const isAuthorized  = (roleInfo?.body) ? authorizedRoles.includes(JSON.parse(roleInfo.body).role.toLowerCase()) : null;
    if (isLoading) {
        return <Loading />;
    }
    return (
        <Route component={isAuthorized ? component : null} {...args} />
    );
};

export default AuthorizedRoute;
