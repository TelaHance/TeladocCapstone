const AWS = require("aws-sdk");
var dynamoDb = new AWS.DynamoDB.DocumentClient();
'use strict';

exports.handler = function(event, context, callback) {
    console.log('Received event:', event);
    const params = {
        TableName: "users",
        Key: {
            "user_id": event.queryStringParameters.user_id
        }
    };

    dynamoDb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "text/plain" },
                body: "Could not fetch user",
            });
            return;
        }


        // create a response
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};
