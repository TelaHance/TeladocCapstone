const AWS = require("aws-sdk");
var dynamoDb = new AWS.DynamoDB.DocumentClient();
'use strict';

exports.handler = async function(event, context) {

    const params = {
        TableName: "users",
        ExpressionAttributeValues: {
            ':r': 'Doctor'
        },
        ExpressionAttributeNames: {
            "#org_role": "role"
        },
        FilterExpression: '#org_role = :r',
        ProjectionExpression: 'user_id, given_name, family_name, picture'
    };
    try{
        const results = await dynamoDb.scan(params).promise();
        return{
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify(results.Items),
        }
    }catch(error){
        return{
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: "Error",
        }
    }

};
