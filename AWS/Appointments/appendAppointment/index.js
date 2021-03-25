const https = require('https');
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const { APP_ID, APP_KEY } = process.env;

// POST request w/o having to import node_modules like node-fetch or axios.
const post = (payload) => new Promise((resolve, reject) => {
    const options = {
        hostname: 'api.infermedica.com',
        port: 443,
        path: '/v3/parse',
        method: 'POST',
        headers: {
            'App-Id': APP_ID,
            'App-Key': APP_KEY,
            'Content-Type': 'application/json',
        },
    };
    const req = https.request(options, res => {
        let buffer = "";
        res.on('data', chunk => buffer += chunk);
        res.on('end', () => resolve(JSON.parse(buffer)));
    });
    req.on('error', e => reject(e.message));
    req.write(payload);
    req.end();
});

async function parse(text, patient_id) {
    let patient;
    try {
        const data = await dynamoDb.get({
            TableName: 'users',
            Key: {
                user_id: patient_id,
            }
        }).promise();
        patient = data.Item;
    }
    catch (err) {
        console.error(err);
    }

    const sex = (patient.sex || 'male').toLowerCase();
    const age = {
        value: Number(patient.age || 30),
    };


    const reqBody = JSON.stringify({ age, sex, text, concept_types: ['condition', 'risk_factor', 'symptom']});
    console.log('[ Infermedica ] Request: ', reqBody);
    const response = await post(reqBody);

    console.log('[ Infermedica ] Response: ', JSON.stringify(response));
    return response.mentions;
}

exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);
    const { start_time, end_time, doctor_id, patient_id, purpose } = data;

    // Ensure valid start and end times
    // if (end_time < start_time || start_time < Date.now()) {
    //   return {
    //     statusCode: 400,
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //     }
    //   };
    // }

    const checkDoctorConflictParams = {
        TableName: 'consults',
        ExpressionAttributeValues: {
            ':d': doctor_id,
            ':from': start_time,
            ':to': end_time,
        },
        KeyConditionExpression: 'doctor_id = :d and start_time < :to',
        FilterExpression: 'end_time > :from',
        IndexName: 'doctor-index',
    };

    const checkPatientConflictParams = {
        TableName: 'consults',
        ExpressionAttributeValues: {
            ':p': patient_id,
            ':from': start_time,
            ':to': end_time,
        },
        KeyConditionExpression: 'patient_id = :p and start_time < :to',
        FilterExpression: 'end_time > :from',
        IndexName: 'patient-index',
    };

    // const [doctorConflicts, patientConflicts] = await Promise.all([
    //   dynamoDb.query(checkDoctorConflictParams).promise(),
    //   dynamoDb.query(checkPatientConflictParams).promise()
    // ]);
    // console.log(doctorConflicts);
    // console.log('___________________________-');
    // console.log(patientConflicts);
    // if (doctorConflicts.Count > 0 || patientConflicts.Count > 0) {
    //   return {
    //     statusCode: 400,
    //     headers: {
    //       "Access-Control-Allow-Headers": "Content-Type",
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Methods": "*"
    //     }
    //   };
    // }

    const symptoms = await parse(purpose, patient_id);

    const putAppointmentParams = {
        TableName: "consults",
        Item: {
            consult_id: uuidv4(),
            symptoms,
            ...data,
        },
        ReturnValues: 'NONE',
    };


    return dynamoDb.put(putAppointmentParams).promise();
};
