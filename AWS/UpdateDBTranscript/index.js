'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const convertTranscribeToSlate = require('./convertTranscribeToSlate');
const addSentiment = require('./addSentiment.js');

var S3 = new AWS.S3({
  maxRetries: 0,
  region: 'us-west-2',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event) => {
  const records = event.Records;
  S3.getObject(
    {
      Bucket: 'consult-transcription',
      Key: records[0].s3.object.key,
    },
    async function (err, response) {
      if (err !== null) {
        return callback(err, null);
      }
      let fileData = JSON.parse(response.Body.toString());
      fileData = convertTranscribeToSlate(fileData);
      fileData = await addSentiment(fileData);

      const params = {
        TableName: 'consults-dev',
        Key: {
          consult_id: records[0].s3.object.key.split('.')[0],
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
      dynamoDb.update(params, (err, ) => {
        if (err) throw err;
      });
    }
  );
};
