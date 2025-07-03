// AWS Configuration
AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1_hEINciki8',
        clientId: '35nr2ouhvulntc32c76c619vff'
    })
    api: {
    invokeUrl:'https://g0n36aa73c.execute-api.us-east-1.amazonaws.com/dev',
    }
});

export const dynamodb = new AWS.DynamoDB.DocumentClient();
