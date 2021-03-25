const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { consult_id, start_time } = event.queryStringParameters;
    let key;

    if (start_time) {
        key = { consult_id, start_time };
    } else {
        const queryParams = {
            TableName: "consults",
            ExpressionAttributeValues: {
                ":c": event.queryStringParameters.consult_id,
            },
            KeyConditionExpression: 'consult_id = :c',
            ProjectionExpression: 'consult_id, start_time',
        };

        const response = await dynamoDb.query(queryParams).promise();
        key = response.Items[0];
    }

    const updateParams = {
        TableName: "consults",
        Key: key,
        ExpressionAttributeNames: {
            '#transcript_edited': "transcript_edited",
        },
        ReturnValues: 'NONE',
    };

    // Update attribute
    if (event.body) {
        updateParams.ExpressionAttributeValues = {
            ':t': JSON.parse(event.body),
        };
        updateParams.UpdateExpression = 'set #transcript_edited = :t';
    }
    // Remove attribute
    else {
        updateParams.UpdateExpression = 'remove #transcript_edited';
    }

    await dynamoDb.update(updateParams).promise();
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        }
    };
};
