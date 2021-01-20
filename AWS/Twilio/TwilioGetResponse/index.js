const accountSid = 'FILL-IT-IN';
const authToken = 'FILL-IT-IN';

const twilio = require('twilio');
const client = new twilio.RestClient(accountSid, authToken);

exports.handler = (event, context, callback) => {
	console.log(event);
	const params = event.reqbody.split('&');
	const callNum = "+1"+params[10].split('=')[1];
	const doctor_id = params[11].split('=')[1];
	const patient_id = params[12].split('=')[1];
	const timestamp = params[13].split('=')[1];
	console.log("----------------");
	console.log(callNum);
	console.log(doctor_id);
	console.log(patient_id);
	console.log("----------------");
	const xml = `<Response>
	<Dial callerId="+14435267847"
		  record="record-from-answer-dual"
		  recordingStatusCallbackMethod="GET"
		  recordingStatusCallbackEvent="completed"
		  recordingStatusCallback="https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/create-consult?doctor_id=${doctor_id}&amp;patient_id=${patient_id}&amp;timestamp=${timestamp}"
		  >
		${callNum}
	</Dial>
</Response>`;
	callback(null, {body: xml});
};
