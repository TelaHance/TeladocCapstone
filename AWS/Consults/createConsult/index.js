'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log('-----------------------');
  console.log(event);
  console.log('-----------------------');

  const data = event;

  const doctor_params = {
    TableName: "users",
    Key: {
        user_id: data.doctor_id
    }
  };

  const patient_params = {
    TableName: "users",
    Key: {
        user_id: data.patient_id
    }
  };

  dynamoDb.get(doctor_params, (error, result) => {
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
    const doctor = {
      user_id: data.doctor_id,
      given_name: result.Item.given_name,
      family_name: result.Item.family_name
    }
    console.log("doctor information:");
    console.log(doctor);
    console.log('-----------------------');

    dynamoDb.get(patient_params, (error, result) => {
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
      const patient = {
        user_id: data.patient_id,
        given_name: result.Item.given_name,
        family_name: result.Item.family_name
      }
      console.log("patient information:");
      console.log(patient);
      console.log('-----------------------');

      const consultParams = {
        TableName: "consults-dev",
        Item: {
          consult_id: data.CallSid,
          doctor: doctor,
          patient: patient,
          timestamp: parseInt(data.timestamp)
        },
        ConditionExpression: 'attribute_not_exists(consult_id)'
      };
      dynamoDb.put(consultParams, (error) => {
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the Consult as it already exists.',
          });
          return;
        }
        const response = {
          statusCode: 200,
          body: JSON.stringify(consultParams.Item),
        };
      });
      const doctorConsultParams = {
        TableName: "user-consults",
        Key: {
          user_id: data.doctor_id
        },
        UpdateExpression: 'SET consults = list_append(consults, :i)',
        ExpressionAttributeValues: {
          ':i': [data.CallSid],
        },
        ReturnValues: 'UPDATED_NEW',
      };
      dynamoDb.update(doctorConsultParams, (error, result) => {
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "text/plain" },
            body: 'Couldn\'t create the user item.',
          });
          return;
        }
        console.log(result.Attributes);
        console.log('-----------------------');
        const patientConsultParams = {
          TableName: "user-consults",
          Key: {
            user_id: data.patient_id
          },
          UpdateExpression: 'SET consults = list_append(consults, :i)',
          ExpressionAttributeValues: {
            ':i': [data.CallSid],
          },
          ReturnValues: 'UPDATED_NEW',
        };
        dynamoDb.update(patientConsultParams, (error, result) => {
            if (error) {
              console.error(error);
              callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                      "Access-Control-Allow-Origin": "*",
                      "Content-Type": "text/plain" },
                body: 'Couldn\'t create the user item.',
              });
              return;
            }
            console.log(result.Attributes);
            console.log('-----------------------');
        });
      });
    });
    callback(null, "Done");
    });
};
