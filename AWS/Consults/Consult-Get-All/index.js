const AWS = require('aws-sdk');
var dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { user_id } = event.queryStringParameters;

  const roleParams = {
    TableName: 'users',
    Key: {
      user_id: user_id,
    },
    ExpressionAttributeNames: {
      '#role': 'role'
    },
    ProjectionExpression: '#role'
  };

  const roleResult = await dynamoDb.get(roleParams).promise();
  const role = roleResult.Item.toUpperCase();
  console.log(role);
  
  const queryParams = {
    TableName: 'consults-dev',
    ExpressionAttributeNames: {
      '#timestamp': 'timestamp'
    },
    ExpressionAttributeValues = {
      'user_id': user_id
    }
  }

  let queryResults;

  if (role === 'ADMIN') {
    const scanParams = {
      TableName: 'consults-dev',
      ExpressionAttributeNames: {
        // TODO: Replace with 'start' and 'end'
        '#timestamp': 'timestamp'
      },
      ProjectionExpression: 'consult_id, doctor_id, patient_id, #timestamp, sentiment'
    }
    queryResults = await dynamoDb.scan(scanParams).promise();
  } else if (role === 'DOCTOR') {
    queryParams.IndexName = 'doctor_id-start-index';
    queryParams.KeyConditionExpression = 'doctor_id = :user_id';
    queryParams.ProjectionExpression = 'consult_id, patient_id, #timestamp';
    queryResults = await dynamoDb.query(queryParams).promise();
  } else {
    queryParams.IndexName = 'patient_id-start-index';
    queryParams.KeyConditionExpression = 'patient_id = :user_id'
    queryParams.ProjectionExpression = 'consult_id, doctor_id, #timestamp';
    queryResults = await dynamoDb.query(queryParams).promise();
  }

  const consults = queryResults.Items;
  console.log(consults);
  const userIds = consults.map(consult => [consult.doctor_id, consult.patient_id]).flat();
  const uniqueUserIds = [...new Set(userIds)].map(user_id => {return { 'user_id': user_id }});

  console.log(uniqueUserIds);

  const getUsersParams = {
    RequestItems: {
      'users': {
        Keys: uniqueUserIds,
      }
    },
    ProjectionExpression: 'user_id, given_name, family_name, picture'
  }

  const usersResult = await dynamoDb.batchGet(getUsersParams).promise();
  const { users } = usersResult.Response;

  consult.log(users);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET"
    },
    body: JSON.stringify({consults, users})
  }
};
