const AWS = require('aws-sdk');
var dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const scanParams = {
        TableName: 'consults',
        // ExpressionAttributeValues: { ':now': Date.now() },
        // FilterExpression: 'start_time < :now',
        FilterExpression: 'attribute_exists(transcript)',
        ProjectionExpression: 'consult_id, doctor_id, patient_id, start_time, sentiment'
    };


    let results;
    results = await dynamoDb.scan(scanParams).promise();

    // Return early if no consults matched the scan or query.
    if (results.Count === 0) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify([]),
        };
    }

    const consults = results.Items;
    consults.sort((a, b) => b.start_time - a.start_time);

    const userIds = consults.map(consult => [consult.doctor_id, consult.patient_id]).flat();
    const uniqueUserIds = [...new Set(userIds)].map(user_id => {
        if (user_id) return { 'user_id': user_id };
    });

    const getUsersParams = {
        RequestItems: {
            'users': {
                Keys: uniqueUserIds,
            }
        },
        ProjectionExpression: 'user_id, given_name, family_name, picture'
    };

    const usersResult = await dynamoDb.batchGet(getUsersParams).promise();
    const { users } = usersResult.Responses;

    const userData = {};
    users.forEach(user => {
        const { user_id } = user;
        userData[user_id] = user;
    });

    const fullConsults = [];
    consults.forEach(consult => {
        const { patient_id, doctor_id, ...otherData } = consult;
        fullConsults.push({
            ...otherData,
            patient: userData[patient_id],
            doctor: userData[doctor_id],
        });
    });
    let avgs = {};
    avgs.count = {};
    avgs.sentiment = {};
    let avgsByDoctor = {};

    for (let i = 0; i < fullConsults.length; i++) {
        if(fullConsults[i].sentiment === undefined){
            continue;
        }
        const currMonth = new Date(fullConsults[i].start_time).toLocaleString('default', { month: 'short' , year: 'numeric'});
        if (currMonth in avgs){
            avgs.count[currMonth] += 1;
            avgs.sentiment[currMonth] = {
                "TOXICITY": avgCalculator(avgs.sentiment[currMonth]['TOXICITY'], fullConsults[i].sentiment['TOXICITY'], avgs.count[currMonth]),
                "PROFANITY": avgCalculator(avgs.sentiment[currMonth]['PROFANITY'], fullConsults[i].sentiment['PROFANITY'], avgs.count[currMonth]),
                "INSULT": avgCalculator(avgs.sentiment[currMonth]['INSULT'], fullConsults[i].sentiment['INSULT'], avgs.count[currMonth]),
                "FLIRTATION": avgCalculator(avgs.sentiment[currMonth]['FLIRTATION'], fullConsults[i].sentiment['FLIRTATION'], avgs.count[currMonth]),
                "THREAT": avgCalculator(avgs.sentiment[currMonth]['THREAT'], fullConsults[i].sentiment['THREAT'], avgs.count[currMonth]),
                "IDENTITY_ATTACK": avgCalculator(avgs.sentiment[currMonth]['IDENTITY_ATTACK'], fullConsults[i].sentiment['IDENTITY_ATTACK'], avgs.count[currMonth]),
            };
        }else{
            avgs.count[currMonth] = 1;
            avgs.sentiment[currMonth] = fullConsults[i].sentiment;
        }
        const docName = fullConsults[i].doctor.given_name + ' ' +  fullConsults[i].doctor.family_name;
        if (docName in avgsByDoctor){
            if (currMonth in avgsByDoctor[docName].sentiment["TOXICITY"]){
                avgsByDoctor[docName].count[currMonth] += 1;
                avgsByDoctor[docName].sentiment["TOXICITY"][currMonth] = avgCalculator(avgsByDoctor[docName].sentiment["TOXICITY"][currMonth],fullConsults[i].sentiment["TOXICITY"],avgs.count[currMonth]);
                avgsByDoctor[docName].sentiment["PROFANITY"][currMonth] = avgCalculator(avgsByDoctor[docName].sentiment["PROFANITY"][currMonth],fullConsults[i].sentiment["PROFANITY"],avgs.count[currMonth]);
                avgsByDoctor[docName].sentiment["INSULT"][currMonth] = avgCalculator(avgsByDoctor[docName].sentiment["INSULT"][currMonth],fullConsults[i].sentiment["INSULT"],avgs.count[currMonth]);
                avgsByDoctor[docName].sentiment["FLIRTATION"][currMonth] = avgCalculator(avgsByDoctor[docName].sentiment["FLIRTATION"][currMonth],fullConsults[i].sentiment["FLIRTATION"],avgs.count[currMonth]);
                avgsByDoctor[docName].sentiment["THREAT"][currMonth] = avgCalculator(avgsByDoctor[docName].sentiment["THREAT"][currMonth],fullConsults[i].sentiment["THREAT"],avgs.count[currMonth]);
                avgsByDoctor[docName].sentiment["IDENTITY_ATTACK"][currMonth] = avgCalculator(avgsByDoctor[docName].sentiment["IDENTITY_ATTACK"][currMonth],fullConsults[i].sentiment["IDENTITY_ATTACK"],avgs.count[currMonth]);
            }else{
                avgsByDoctor[docName].sentiment["TOXICITY"][currMonth] = fullConsults[i].sentiment["TOXICITY"];
                avgsByDoctor[docName].sentiment["PROFANITY"][currMonth] = fullConsults[i].sentiment["PROFANITY"];
                avgsByDoctor[docName].sentiment["INSULT"][currMonth] = fullConsults[i].sentiment["INSULT"];
                avgsByDoctor[docName].sentiment["FLIRTATION"][currMonth] = fullConsults[i].sentiment["FLIRTATION"];
                avgsByDoctor[docName].sentiment["THREAT"][currMonth] = fullConsults[i].sentiment["THREAT"];
                avgsByDoctor[docName].sentiment["IDENTITY_ATTACK"][currMonth] = fullConsults[i].sentiment["IDENTITY_ATTACK"];
                avgsByDoctor[docName].count[currMonth] = 1;
            }
        }else{
            avgsByDoctor[docName] = {};
            avgsByDoctor[docName].count = {};
            avgsByDoctor[docName].sentiment = {
                "TOXICITY":{},
                "PROFANITY":{},
                "INSULT":{},
                "FLIRTATION":{},
                "THREAT":{},
                "IDENTITY_ATTACK":{},
            };
            avgsByDoctor[docName].sentiment["TOXICITY"][currMonth] = fullConsults[i].sentiment["TOXICITY"];
            avgsByDoctor[docName].sentiment["PROFANITY"][currMonth] = fullConsults[i].sentiment["PROFANITY"];
            avgsByDoctor[docName].sentiment["INSULT"][currMonth] = fullConsults[i].sentiment["INSULT"];
            avgsByDoctor[docName].sentiment["FLIRTATION"][currMonth] = fullConsults[i].sentiment["FLIRTATION"];
            avgsByDoctor[docName].sentiment["THREAT"][currMonth] = fullConsults[i].sentiment["THREAT"];
            avgsByDoctor[docName].sentiment["IDENTITY_ATTACK"][currMonth] = fullConsults[i].sentiment["IDENTITY_ATTACK"];
            avgsByDoctor[docName].picture = fullConsults[i].doctor.picture;
            avgsByDoctor[docName].fullName = docName;
            avgsByDoctor[docName].count[currMonth] = 1;
        }
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
        body: JSON.stringify({
            platformAverages: avgs.sentiment,
            doctorAverage: avgsByDoctor,
        }),
    };
};

const avgCalculator =  (currentAvg, newData, count) => {
    return currentAvg + (newData - currentAvg)/count;
};
