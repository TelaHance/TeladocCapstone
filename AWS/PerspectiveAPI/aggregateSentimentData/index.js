const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const scanParams = {
        TableName: 'consults',
        FilterExpression:
            'attribute_exists(transcript) AND attribute_exists(doctor_sentiment)',
        ProjectionExpression:
            'consult_id, doctor_id, patient_id, start_time, transcript, doctor_sentiment',
    };

    const results = await dynamoDb.scan(scanParams).promise();

    // Return early if no consults matched the scan or query.
    if (results.Count === 0) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,GET',
            },
            body: JSON.stringify({}),
        };
    }

    const consults = results.Items;

    const userIds = [
        ...new Set(
            consults.flatMap(({ doctor_id }) => [ doctor_id ])
        ),
    ].map((user_id) => ({ user_id }));

    const getUsersParams = {
        RequestItems: {
            users: {
                Keys: userIds,
                ProjectionExpression: 'user_id, given_name, family_name, picture',
            },
        },
    };

    const usersResult = await dynamoDb.batchGet(getUsersParams).promise();
    const { users } = usersResult.Responses;

    const userData = {};
    users.forEach((user) => {
        const { user_id } = user;
        userData[user_id] = user;
    });

    const platformConsultsMap = consults.reduce((acc, consult) => {
        const { start_time } = consult;
        const month = new Date(start_time).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
        });
        if (!acc[month]) acc[month] = [];
        acc[month].push(consult);
        return acc;
    }, {});

    const { doctors } = consults.reduce(
        (acc, consult) => {
            const { doctor_id, start_time } = consult;
            const month = new Date(start_time).toLocaleString('default', {
                month: 'short',
                year: 'numeric',
            });
            acc.doctors[doctor_id] = acc.doctors[doctor_id] || {};
            acc.doctors[doctor_id][month] = acc.doctors[doctor_id][month] || [];

            acc.doctors[doctor_id][month].push(consult);

            return acc;
        },
        { doctors: {} }
    );

    const platformAverages = averageMap(platformConsultsMap);

    function averageByUsers(consultsByUser) {
        return Object.entries(consultsByUser)
            .map(([user_id, consultsByMonth]) => ({
                user: userData[user_id],
                averages: averageMap(consultsByMonth),
            }))
            .sort((a, b) => a.family_name - b.family_name);
    }

    const doctorAverages = averageByUsers(doctors);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
        },
        body: JSON.stringify({
            platformAverages,
            doctorAverages,
        }),
    };
};

function averageMap(consultListMap) {
    const averages = {};
    Object.entries(consultListMap).forEach(
        ([key, consultList]) => (averages[key] = average(consultList))
    );
    return averages;
}

function average(consultList) {
    const count = consultList.length;
    return consultList.reduce((acc, { doctor_sentiment }) => {
        Object.entries(doctor_sentiment).forEach(
            ([type, score]) => (acc[type] = (acc[type]||0) + score / count)
        );
        return acc;
    }, {});
}
