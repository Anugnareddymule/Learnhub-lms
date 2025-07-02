// AWS Configuration
AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'your-identity-pool-id'
    })
});

export const dynamodb = new AWS.DynamoDB.DocumentClient();