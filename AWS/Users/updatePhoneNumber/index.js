'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    const data = event
    console.log(data);
    if (typeof data.phone !== 'string' || typeof data.user_id !== 'string' ||
        typeof data.sex !== 'string' || typeof data.age !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the user item.',
        });
        return;
    }


    const params = {
        TableName: "users",
        Key: {
            user_id: data.user_id
        },
        ExpressionAttributeNames: {
            '#phone': 'phone',
            '#sex': 'sex',
            '#age': 'age',
        },
        ExpressionAttributeValues: {
            ':p': data.phone,
            ':s': data.sex.toLowerCase(),
            ':a': data.age,
        },
        UpdateExpression:
            'set #phone = :p, #sex = :s, #age = :a',
        ReturnValues: 'NONE',
    };

    const response = new Promise((resolve, reject) => {
        dynamoDb.update(params, (err, ) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve({
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    }
                });
            }
        });
    });

    return response;
};
