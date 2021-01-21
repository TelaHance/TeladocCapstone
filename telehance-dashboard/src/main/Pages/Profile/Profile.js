import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Container, Col, Badge } from "react-bootstrap";
import ReactJson from "react-json-view";
import useSWR from "swr";
import {fetchWithUser} from "../../Util/fetch";
import BreadcrumbBar from "../../Components/BreadcrumbBar/BreadcrumbBar";
const Profile = () => {
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { user } = useAuth0();
  const { name, picture, email, sub} = user;
  const { data: roleInfo} = useSWR(
    ["https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id", awsToken, 'POST', sub.split('|')[1]],
    fetchWithUser);
  return (
    <div>
        <BreadcrumbBar page="Profile" />
    </div>
  );
};

export default Profile;
