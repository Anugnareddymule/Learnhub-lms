import AWS from 'aws-sdk';

const AWS_CONFIG = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_BRcN2CXH8',
  userPoolWebClientId: '6d5u2nfffro25bbpteher640ma',
  identityPoolId: 'us-east-1:xxxx-xxxx-xxxx-xxxx',
  apiGatewayUrl: 'https://abc123.execute-api.us-east-1.amazonaws.com/prod'
};

AWS.config.update({
  region: AWS_CONFIG.region,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_CONFIG.identityPoolId
  })
});

export const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  region: AWS_CONFIG.region
});

export const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: AWS_CONFIG.region
});

export const awsConfig = AWS_CONFIG;

export const cognitoConfig = {
  region: AWS_CONFIG.region,
  userPoolId: AWS_CONFIG.userPoolId,
  userPoolWebClientId: AWS_CONFIG.userPoolWebClientId,
  identityPoolId: AWS_CONFIG.identityPoolId
};

export const API_ENDPOINTS = {
  courses: `${AWS_CONFIG.apiGatewayUrl}/courses`,
  auth: `${AWS_CONFIG.apiGatewayUrl}/auth`
};
