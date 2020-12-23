'use strict';

const awsSdk = require('aws-sdk');

const transcribeService = new awsSdk.TranscribeService();

module.exports.transcribe = (event, context, callback) => {
  const records = event.Records;
  const transcribingPromises = records.map((record) => {
    const recordUrl = [
      'https://s3.us-west-2.amazonaws.com',
      'teleconsults',
      record.s3.object.key,
    ].join('/');

    const TranscriptionJobName = record.s3.object.key.split("/")[2].split(".")[0];

    return transcribeService.startTranscriptionJob({
      LanguageCode: 'en-US',
      Media: { MediaFileUri: recordUrl },
      MediaFormat: 'mp3',
      TranscriptionJobName,
      OutputBucketName: 'consult-transcription',
      "Settings": {
        "MaxSpeakerLabels": 2,
        "ShowSpeakerLabels": true
   },
    }).promise();
  });

  Promise.all(transcribingPromises)
    .then(() => {
      callback(null, { message: 'Start transcription job successfully' });
    })
    .catch(err => callback(err, { message: 'Error start transcription job' }));
};
