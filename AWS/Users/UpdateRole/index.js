'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const data = event
  if (typeof data.role !== 'string' || typeof data.user_id !== 'string') {
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
      '#role_text': 'role',
    },
    ExpressionAttributeValues: {
      ':r': data.role,
    },
    UpdateExpression: 'set #role_text = :r',
    ReturnValues: 'UPDATED_NEW',
  };

  // write the todo to the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "text/plain" },
        body: 'Couldn\'t create the user item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,PATCH"
      },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
