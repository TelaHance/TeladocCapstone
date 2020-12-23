'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

var S3 = new AWS.S3({
    maxRetries: 0,
    region: 'us-west-2',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const records = event.Records;
  S3.getObject({
        Bucket: 'consult-transcription',
        Key: records[0].s3.object.key,
    }, function(err, data) {
        if (err !== null) {
            return callback(err, null);
        }
        var fileData = data.Body.toString('utf-8');
        const params = {
          TableName: "consults-dev",
          Key: {
            consult_id: records[0].s3.object.key.split('.')[0]
          },
          ExpressionAttributeNames: {
            '#transcript_text': 'transcript',
          },
          ExpressionAttributeValues: {
            ':t': fileData,
          },
          UpdateExpression: 'set #transcript_text = :t',
          ReturnValues: 'UPDATED_NEW',
        };
        dynamoDb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(null, "failure");
          return;
        }

        callback(null, "success");
        });
    });
};
