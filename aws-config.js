// AWS Configuration
import AWS from 'aws-sdk';

// Replace these with your actual AWS resource IDs
const AWS_CONFIG = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_XXXXXXXXX', // Replace with your User Pool ID
  userPoolWebClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your App Client ID
  identityPoolId: 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', // Replace with your Identity Pool ID
  apiGatewayUrl: 'https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod' // Replace with your API Gateway URL
};

// Configure AWS SDK
AWS.config.update({
  region: AWS_CONFIG.region,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_CONFIG.identityPoolId
  })
});

// Initialize Cognito Identity Service Provider
export const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  region: AWS_CONFIG.region
});

// Initialize DynamoDB Document Client
export const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: AWS_CONFIG.region
});

// Export configuration
export const awsConfig = AWS_CONFIG;

// Cognito User Pool configuration for client-side operations
export const cognitoConfig = {
  region: AWS_CONFIG.region,
  userPoolId: AWS_CONFIG.userPoolId,
  userPoolWebClientId: AWS_CONFIG.userPoolWebClientId,
  identityPoolId: AWS_CONFIG.identityPoolId
};

// API endpoints
export const API_ENDPOINTS = {
  courses: `${AWS_CONFIG.apiGatewayUrl}/courses`,
  auth: `${AWS_CONFIG.apiGatewayUrl}/auth`
};