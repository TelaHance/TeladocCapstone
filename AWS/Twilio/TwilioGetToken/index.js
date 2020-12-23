const accountSid = 'FILL-IT-IN';
const authToken = 'FILL-IT-IN';


const twilio = require('twilio');
const client = new twilio.RestClient(accountSid, authToken);

exports.handler = (event, context, callback) => {
	var capability = new twilio.Capability(accountSid, authToken);
	capability.allowClientOutgoing("FILL-IT-IN");

    callback(null, JSON.stringify({token: capability.generate()}));
};
