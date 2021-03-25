const AWS = require('aws-sdk');
var dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {user_id} = event.queryStringParameters;

    const params = {
        TableName: "consults",
        ExpressionAttributeValues: {
            ':d': user_id,
        },
        KeyConditionExpression: 'doctor_id = :d',
        // ProjectionExpression: 'consult_id, start_time, end_time, patient_id, purpose',
        FilterExpression: 'attribute_not_exists(transcript)',
        IndexName: 'doctor-index',
    };

    const results = await dynamoDb.query(params).promise();

    // Return early if no consults matched the scan or query.
    if (results.Count === 0) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify([]),
        };
    }

    const consults = results.Items;
    consults.sort((a, b) => b.start_time - a.start_time);

    const userIds = consults.map(consult => [consult.doctor_id, consult.patient_id]).flat();
    const uniqueUserIds = [...new Set(userIds)].map(user_id => {
        if (user_id) return { 'user_id': user_id };
    });

    const getUsersParams = {
        RequestItems: {
            'users': {
                Keys: uniqueUserIds,
            }
        },
        ProjectionExpression: 'user_id, given_name, family_name, picture'
    };

    const usersResult = await dynamoDb.batchGet(getUsersParams).promise();
    const { users } = usersResult.Responses;

    const userData = {};
    users.forEach(user => {
        const { user_id } = user;
        userData[user_id] = user;
    });

    const fullConsults = [];
    consults.forEach(consult => {
        const { patient_id, doctor_id, ...otherData } = consult;
        fullConsults.push({
            ...otherData,
            patient: userData[patient_id],
            doctor: userData[doctor_id],
        });
    });

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        body: JSON.stringify(fullConsults.reverse()),
    };
};
