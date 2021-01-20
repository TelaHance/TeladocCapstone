'use strict';
const axios = require('axios');
const AWS = require('aws-sdk');
const S3UploadStream = require('s3-upload-stream');
const Twilio = require('twilio');
const ACCOUNT_SID = "FILL-IT-IN";
const AUTH_TOKEN = "FILL-IT-IN";

const S3_BUCKET = "teleconsults";
const S3_PREFIX = "Recordings";
function add_leading_zero(number) {
    let n = number.toString();
    if (n.length < 2) { n = '0' + n; }
    return n;
}
function get_download_url(recording) {
    const apiVersion = recording.apiVersion;
    const recordingSID = recording.sid;
    return `https://api.twilio.com/${apiVersion}/Accounts/${ACCOUNT_SID}/Recordings/${recordingSID}.mp3`
}
function get_upload_path(recording) {
    const recordingDate = new Date(recording.dateCreated);
    const year = recordingDate.getFullYear();
    const callSid = recording.callSid;
    return `${S3_PREFIX}/${year}/${callSid}.mp3`
}
async function transfer_recording(download_url, upload_stream) {
    const response = await axios({method: 'GET', url: download_url, responseType: 'stream'});
    response.data.pipe(upload_stream);
    return new Promise((resolve, reject) => {
        upload_stream.on('uploaded', resolve)
        upload_stream.on('error', reject)
    });
}

module.exports.handler = async function(event, context, callback) {
    const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);
    // Retrieving and deleting all recordings
    const recordings = await client.recordings.list();
    for (const recording of recordings) {
        if (recording.status !== "completed") { continue; }
        // Getting the upload and download paths
        const call = await client.calls(recording.callSid).fetch();
        const download_url = get_download_url(recording);
        const upload_path = get_upload_path(recording);
        let s3Stream = S3UploadStream(new AWS.S3());
        // Alternatively, one could download a ".wav" by using ".wav" in the in the download_url and a ContentType of "audio/x-wav"
        let upload_stream = s3Stream.upload({Bucket: S3_BUCKET, Key: upload_path, ContentType: 'audio/mpeg'});
        // Transferring to S3
        console.log(`Transferring ${recording.callSid} to ${upload_path}`);
        await transfer_recording(download_url, upload_stream);
        // Deleting recording
        await client.recordings(recording.sid).remove();
    }
    callback();
};
