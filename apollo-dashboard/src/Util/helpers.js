import { useAuth0 } from "@auth0/auth0-react";

export function IsAdmin() {
    const { user } = useAuth0();
    if (user) {
        console.log(user);
        const metadata = user[process.env.REACT_APP_AUTH0_MANAGEMENT_METADATA];
        const role = metadata.roles[0];
        return (role === 'Admin' ? true : false);
    }
    return false;
}

export function IsDoctor() {
    const { user } = useAuth0();
    if (user) {
        console.log(user);
        const metadata = user[process.env.REACT_APP_AUTH0_MANAGEMENT_METADATA];
        const role = metadata.roles[0];
        return (role === 'Doctor' ? true : false);
    }
    return false;
}