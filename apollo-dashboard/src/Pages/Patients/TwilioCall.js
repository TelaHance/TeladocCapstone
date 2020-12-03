import React from "react";
import { Table, DropdownButton, Dropdown} from "react-bootstrap";
import {fetchWithToken} from "../../Util/fetch";
import useSWR from "swr";
import Container from "react-bootstrap/Container";
import { Device } from 'twilio-client';
const TwilioCall = () => {
    //
    //
    // $.getJSON('https://59wncxd6oi.execute-api.us-west-2.amazonaws.com/dev/get-token').done(function(data) {
    //     Device.setup(data.token);
    // }).fail(function(err) {
    //     console.log(err);
    //     self.setState({log: 'Could not fetch token, see console.log'});
    // });
    //
    // // Configure event handlers for Twilio Device
    // Device.disconnect(function() {
    //     self.setState({
    //         onPhone: false,
    //         log: 'Call ended.'
    //     });
    // });
    //
    // Device.ready(function() {
    //     self.log = 'Connected';
    // });

    return (
        <h1>Hello</h1>
    );
};

export default TwilioCall;
