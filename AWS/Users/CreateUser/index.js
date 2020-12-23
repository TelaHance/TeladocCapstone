'use strict';

const AWS = require('aws-sdk');
// eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (typeof data.role !== 'string' || typeof data.email !== 'string' || typeof data.given_name !== 'string' || typeof data.family_name !== 'string' || typeof data.user_id !== 'string') {
    console.log("data:" + data);
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the user. Bad input.',
    });
    return;
  }

  const params = {
    TableName: "users",
    Item: {
      user_id: data.user_id,
      given_name: data.given_name,
      family_name: data.family_name,
      role: data.role,
      email: data.email
    },
    ConditionExpression: 'attribute_not_exists(user_id)'
  };

  // write the user to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the User as it already exists.',
      });
      return;
    }
    const consultParams = {
      TableName: "user-consults",
      Item: {
        user_id: data.user_id,
        consults: []
      },
      ConditionExpression: 'attribute_not_exists(user_id)'
    };
    dynamoDb.put(consultParams, (error) => {
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create the User as it already exists.',
        });
        return;
      }
    });
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
