const accountSid = 'FILL-IT-IN';
const authToken = 'FILL-IT-IN';


const twilio = require('twilio');
const client = new twilio.RestClient(accountSid, authToken);

exports.handler = (event, context, callback) => {
	var capability = new twilio.Capability(accountSid, authToken);
	capability.allowClientOutgoing("AP355c3961b103c04674dc652d97514ebf");

    callback(null, JSON.stringify({token: capability.generate()}));
};
