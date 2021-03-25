const https = require('https');
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const { APP_ID, APP_KEY } = process.env;

// POST request w/o having to import node_modules like node-fetch or axios.
const post = (payload) => new Promise((resolve, reject) => {
    const options = {
        hostname: 'api.infermedica.com',
        port: 443,
        path: '/v3/diagnosis',
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
    req.write(JSON.stringify(payload));
    req.end();
});

exports.handler = async(event) => {
    const { consult_id, start_time, patient_id, symptoms } = JSON.parse(event.body);
    console.log(event.body);

    const getUserInfoParams = {
        TableName: "users",
        Key: {
            user_id: patient_id,
        },
    };

    let patient;
    try {
        const data = await dynamoDb.get(getUserInfoParams).promise();
        patient = data.Item;
    }
    catch (err) {
        console.error(err);
    }

    const sex = (patient.sex || 'male').toLowerCase();
    const age = {
        value: Number(patient.age || 30),
    };

    console.log('Sex: ', sex);
    console.log('Age: ', age);

    const evidence = symptoms.map(({ id, choice_id }) => {return { id, choice_id }});

    console.log(evidence);

    const response = await post({ sex, age, evidence });
    console.log(response);
    const { conditions, question } = response;
    console.log(conditions, question);

    const updateConditionsParams = {
        TableName: "consults",
        Key: {
            consult_id,
            start_time,
        },
        ExpressionAttributeValues: {
            ':c': conditions,
            ':q': question.text,
        },
        UpdateExpression: 'SET medical_conditions = :c, question = :q',
        ReturnValues: 'NONE',
    };

    try {
        await dynamoDb.update(updateConditionsParams).promise();
    }
    catch (err) {
        console.error(err);
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({conditions, question: question.text}),
    };
};
