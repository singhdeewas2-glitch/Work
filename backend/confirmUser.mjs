import dotenv from 'dotenv';
dotenv.config();

import { CognitoIdentityProviderClient, AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import config from './config.mjs';

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey,
  }
});

const confirmUser = async (email) => {
  try {
    const command = new AdminConfirmSignUpCommand({
      UserPoolId: config.userPoolId,
      Username: email,
    });
    await cognitoClient.send(command);
    console.log(`Successfully confirmed user: ${email}`);
  } catch (err) {
    console.error(`Failed to confirm user ${email}:`, err.message);
  }
};

// Replace with the email shown in the screenshot
confirmUser('admin@gmail.com');
