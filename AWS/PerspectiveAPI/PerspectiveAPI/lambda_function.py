import json
import requests
from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key


def lambda_handler(event, context):
    print('--------------------------')
    try:
        for record in event['Records']:
            if record['eventName'] == 'MODIFY':
                print(update(record))
            else:
                print("Event type is " + record['eventName'])
        print('--------------------------')
    except Exception as e:
        print(e)
        print('---------------------')
        return "Opps!"


def update(record):
    print('Handling MODIFY event')
    api_key = 'FILL-IT-IN'
    url = ('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze' + '?key=' + api_key)
    newImage = record['dynamodb']['NewImage']

    if not "transcript" in newImage:
        return "No transcript stored"
    if "sentiment" in newImage:
        return "Sentiment already processed."

    text = json.loads(newImage['transcript']['S'])['results']['transcripts'][0]['transcript']
    data_dict = {
        'comment': {'text': text},
        'languages': ['en'],
        'requestedAttributes': {'TOXICITY': {}}
    }
    response = requests.post(url=url, data=json.dumps(data_dict))
    response_dict = json.loads(response.content, parse_float=Decimal)

    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('consults-dev')

    table.update_item(
        Key={
                'consult_id': newImage['consult_id']['S'],
            },
        UpdateExpression="set sentiment = :s",
        ExpressionAttributeValues={
                ':s': response_dict['attributeScores']['TOXICITY']['summaryScore']['value']
            },
        ReturnValues="UPDATED_NEW"
        )
    print(json.dumps(json.loads(response.content), indent=2))
    print("Response Received.")
    print('---------------------------')
    return {
        'statusCode': 200,
        'body': json.dumps(json.loads(response.content), indent=2)
    }
