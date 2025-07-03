// AWS Configuration
AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1_hEINciki8',
        clientId: '35nr2ouhvulntc32c76c619vff'
    })
});

export const dynamodb = new AWS.DynamoDB.DocumentClient();
