const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

function compileMaxSentiment(blocks) {
    return blocks
        .map(({ sentiment }) => sentiment)
        .reduce((acc, cur) => {
            Object.entries(cur).forEach(([attribute, score]) => {
                acc[attribute] = Math.max(acc[attribute] || 0, score);
            });
            return acc;
        }, {});
}

exports.handler = async (event) => {
    const scanParams = {
        TableName: 'consults',
        FilterExpression: 'attribute_exists(transcript)',
        ProjectionExpression: 'consult_id, start_time, transcript',
    };
    const scanResult = await dynamoDb.scan(scanParams).promise();
    const consults = scanResult.Items;

    await Promise.all(
        consults.map(async ({ consult_id, start_time, transcript }) => {
            const doctor_sentiment = compileMaxSentiment(
                transcript.filter(({ speaker }) => speaker === 'DOCTOR')
            );
            const sentiment = compileMaxSentiment(transcript);

            console.log(
                `[ ${consult_id} ] Combined Sentiment: `,
                JSON.stringify(sentiment)
            );
            console.log(
                `[ ${consult_id} ] Doctor Sentiment: `,
                JSON.stringify(doctor_sentiment)
            );

            const updateParams = {
                TableName: 'consults',
                Key: { consult_id, start_time },
                ExpressionAttributeValues: {
                    ':s': sentiment,
                    ':ds': doctor_sentiment,
                },
                UpdateExpression: 'SET sentiment = :s, doctor_sentiment = :ds',
                ReturnValues: 'NONE',
            };

            return dynamoDb.update(updateParams).promise();
        })
    );
    return {
        statusCode: 200,
    };
};

