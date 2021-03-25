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
  const role = roleResult.Item.role.toUpperCase();

  const queryParams = {
    TableName: 'consults',
    ExpressionAttributeValues: {
      // ':now': Date.now(),
      ':user_id': user_id
    },
    FilterExpression: 'attribute_exists(transcript)',
  };

  let results;

  if (role === 'ADMIN' || role === 'DEMO') {
    const scanParams = {
      TableName: 'consults',
      // ExpressionAttributeValues: { ':now': Date.now() },
      // FilterExpression: 'start_time < :now',
      FilterExpression: 'attribute_exists(transcript)',
      ProjectionExpression: 'consult_id, doctor_id, patient_id, start_time, end_time, sentiment'
    };
    results = await dynamoDb.scan(scanParams).promise();
  } else if (role === 'DOCTOR') {
    queryParams.IndexName = 'doctor-index';
    // queryParams.KeyConditionExpression = 'doctor_id = :user_id and start_time < :now';
    queryParams.KeyConditionExpression = 'doctor_id = :user_id';
    queryParams.ProjectionExpression = 'consult_id, patient_id, start_time, end_time, sentiment';
    results = await dynamoDb.query(queryParams).promise();
  } else {
    queryParams.IndexName = 'patient-index';
    // queryParams.KeyConditionExpression = 'patient_id = :user_id and start_time < :now';
    queryParams.KeyConditionExpression = 'patient_id = :user_id';
    queryParams.ProjectionExpression = 'consult_id, doctor_id, start_time, end_time';
    results = await dynamoDb.query(queryParams).promise();
  }

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
    body: JSON.stringify(fullConsults),
  };
};
