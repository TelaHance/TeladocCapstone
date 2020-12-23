const AWS = require("aws-sdk");
var dynamoDb = new AWS.DynamoDB.DocumentClient();
var lambda = new AWS.Lambda({
  region: 'us-west-2'
});
'use strict';

exports.handler = function(event, context, callback) {

    // lambda.invoke({
    //   FunctionName: 'getRole',
    //   Payload: JSON.stringify(event, null, 2) // pass params
    // }, function(error, data) {
    //   if (error) {
    //     console.error(error);
    //     callback(null, {
    //       statusCode: error.statusCode || 501,
    //       headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Content-Type": "text/plain" },
    //       body: "Couldn\'t fetch the User",
    //     });
    //     return;
    //   }
    //   if(data.Payload){
    //     context.succeed(data.Payload)
    //   }
    // });
    console.log(event)
    const role_params = {
        TableName: "users",
        Key: {
            "user_id": event.queryStringParameters.user_id
        }
    };

    dynamoDb.get(role_params, (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "text/plain" },
            body: "Couldn\'t fetch the User",
          });
          return;
        }
        const role = result.Item.role;
        console.log(role);

        if (role == 'Admin') {
          const params = {
            TableName: "consults-dev"
          };

          dynamoDb.scan(params, (error, result) => {
            // handle potential errors
            if (error) {
              console.error(error);
              callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "text/plain" },
                body: 'Couldn\'t fetch the consults.',
              });
              return;
            }

            // create a response
            const response = {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
              },
              body: JSON.stringify(result.Items),
            };
            callback(null, response);
          });
        } else {
          const user_params = {
            TableName: "user-consults",
            Key: {
              "user_id": event.queryStringParameters.user_id
            }
          }
          dynamoDb.get(user_params, (error, result) => {
            // handle potential errors
            if (error) {
              console.error(error);
              callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "text/plain" },
                body: 'Couldn\'t fetch the consult list.',
              });
              return;
            }
            console.log(result);
            const consult_list = result.Item.consults;
            const consult_map = consult_list.map(item => {
              return {"consult_id": item}
            })

            console.log(consult_map);
            const consult_params = {
              "RequestItems": {
                "consults-dev": {
                  Keys: consult_map
                }
              }
            }
            console.log(consult_params);

            dynamoDb.batchGet(consult_params, (error, result) => {
              // handle potential errors
              if (error) {
                console.error(error);
                callback(null, {
                  statusCode: error.statusCode || 501,
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "text/plain" },
                  body: 'Couldn\'t fetch the consults.',
                });
                return;
              }
              console.log(result.Responses['consults-dev'])

              // create a response
              const response = {
                statusCode: 200,
                headers: {
                  "Access-Control-Allow-Headers": "Content-Type",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "OPTIONS,GET"
                },
                body: JSON.stringify(result.Responses["consults-dev"]),
              };
              callback(null, response);
            });
          });

        }
    });




};
