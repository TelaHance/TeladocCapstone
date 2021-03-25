const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const ecs = new AWS.ECS();

const QueueUrl = 'https://sqs.us-west-2.amazonaws.com/113657999858/WebsocketQueue.fifo';

exports.handler = async (event) => {
    const { routeKey, connectionId } = event.requestContext;
    console.log(routeKey);

    if (routeKey === '$connect') {
        const sqsParams = {
            MessageBody: JSON.stringify({ connectionId }),
            QueueUrl,
            MessageGroupId: connectionId,
            MessageDeduplicationId: connectionId,
        };

        try {
            const data = await sqs.sendMessage(sqsParams).promise();
            console.log(`SQS Message successfully sent: ${JSON.stringify(data)}`);
        } catch(err) {
            console.error(`Error while sending SQS message: ${err}`);
            return { statusCode: 500 };
        }

        // Stop all tasks before running new one.
        // This is only necessary because of restrictions on AWS free tier.
        try {
            const numTasks = await stopAllTasks();
            console.log(`Successfully stopped ${numTasks} running tasks.`);
        } catch(err) {
            console.error(`Error while stopping currently running tasks: ${err}`);
            return { statusCode: 500 };
        }

        const runTaskParams = {
            cluster: 'FILL-IT-IN-HERE',
            taskDefinition: 'FILL-IT-IN-HERE:12',
            count: 1,
        };
        let data = await ecs.runTask(runTaskParams).promise();

        // Wait until state is "RUNNING" before establishing the connection
        let task = data.tasks[0];
        await new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                if (task.lastStatus === task.desiredStatus) {
                    console.log('Successfully waited for "RUNNING" state');
                    resolve(true);
                    return clearInterval(interval);
                } else {
                    console.log('Task still in "PENDING" state');
                    const describeTasksParams = {
                        tasks: [task.taskArn],
                        cluster: 'FILL-IT-IN-HERE',
                    };
                    data = await ecs.describeTasks(describeTasksParams).promise();
                    task = data.tasks[0];
                }
            }, 500); // Check only 2 times per second
        });
        const describeTasksParams = {
            tasks: [task.taskArn],
            cluster: 'FILL-IT-IN-HERE',
        };
        data = await ecs.describeTasks(describeTasksParams).promise();
        task = data.tasks[0];
        console.log(task);

        return {
            statusCode: 200,
            body: 'Connected Successfully'
        };
    }


    else {
        return {
            statusCode: 200,
        };
    }

    async function stopAllTasks() {
        const listTasksParams = {
            cluster: 'FILL-IT-IN-HERE',
            containerInstance: 'FILL-IT-IN-HERE',
        };
        const data = await ecs.listTasks(listTasksParams).promise();
        const runningTasks = data.taskArns.length;
        console.log(`Found ${runningTasks} running tasks.`);
        if (runningTasks !== 0) {
            await Promise.all(data.taskArns.map(arn => {
                const stopTaskParams = {
                    task: arn,
                    cluster: 'FILL-IT-IN-HERE',
                    reason: 'New incoming call',
                };
                console.log(`Stopping task: ${arn}`);
                return ecs.stopTask(stopTaskParams).promise();
            }));
        }
        return runningTasks;
    }
};
