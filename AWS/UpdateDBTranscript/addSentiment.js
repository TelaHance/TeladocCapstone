/**
 * Adds sentiment to each message / block
 */
const { google } = require('googleapis');

module.exports = async function addSentiment(transcript) {
  const API_KEY = 'AIzaSyCEhb6rkEaOfqs3SIR7c1lj_Fa8LDPbqrk';
  const DISCOVERY_URL =
    'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';
  const promises = [];
  const client = await google.discoverAPI(DISCOVERY_URL);
  transcript.forEach((message) => {
    promises.push(
      new Promise(function (resolve, reject) {
        const analyzeRequest = {
          comment: { text: message.fullText },
          requestedAttributes: { TOXICITY: {} },
          languages: ['en'],
          doNotStore: true,
        };

        client.comments.analyze(
          {
            key: API_KEY,
            resource: analyzeRequest,
          },
          (err, response) => {
            if (err) {
              reject(err);
              return;
            }
            message.sentiment =
              response.data.attributeScores.TOXICITY.summaryScore.value;
            resolve();
          }
        );
      })
    );
  });

  await Promise.all(promises);
  console.log(transcript);
  return transcript;
};
