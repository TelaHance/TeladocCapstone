const AWS = require("aws-sdk");
var dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(event);
    const { consult_id } = event.queryStringParameters;

    if (!consult_id) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "text/plain" },
            body: "Must include consult_id as a query parameter.",
        };
    }

    const params = {
        TableName: "consults",
        ExpressionAttributeValues: {
            ":c": consult_id
        },
        KeyConditionExpression: 'consult_id = :c'
    };

    const consultResult = await dynamoDb.query(params).promise();
    const {patient_id, doctor_id, ...otherData} = consultResult.Items[0];

    const getUsersParams = {
        RequestItems: {
            users: {
                Keys: [{
                    user_id: patient_id,
                },
                    {
                        user_id: doctor_id,
                    }],
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

    const fullConsult = {
        ...otherData,
        patient: userData[patient_id],
        doctor: userData[doctor_id],
    };

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        body: JSON.stringify(fullConsult),
    };
};
