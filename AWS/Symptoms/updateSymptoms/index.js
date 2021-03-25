const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("event: ");
    console.log(event);
    console.log("----------------")
    console.log("Consult_id");
    console.log(event.queryStringParameters.consult_id)
    console.log("----------------")
    const params = {
        TableName: "consults",
        Key: {
            consult_id: event.queryStringParameters.consult_id,
            start_time: Number(event.queryStringParameters.start_time)
        },
        ExpressionAttributeNames: {
            '#symptoms': "symptoms",
        },
        ReturnValues: 'NONE',
    };

    // Update attribute
    if (event.body) {
        params.ExpressionAttributeValues = {
            ':s': JSON.parse(event.body),
        };
        params.UpdateExpression = 'SET #symptoms = :s';
    }
    // Remove attribute
//   else {
//     params.UpdateExpression = 'remove #symptoms';
//   }

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
