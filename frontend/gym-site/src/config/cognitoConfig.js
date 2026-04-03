export const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
export const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
export const region = import.meta.env.VITE_COGNITO_REGION;

export const validateCognitoConfig = () => {
  const missingVariables = [];

  const isInvalid = (val) => {
    return !val || val === 'REPLACE_WITH_ACTUAL_USER_POOL_ID' || val === 'REPLACE_WITH_ACTUAL_CLIENT_ID' || val === 'REPLACE_WITH_ACTUAL_REGION' || val.includes('actual_');
  };

  if (isInvalid(userPoolId)) missingVariables.push('VITE_COGNITO_USER_POOL_ID');
  if (isInvalid(clientId)) missingVariables.push('VITE_COGNITO_CLIENT_ID');
  if (isInvalid(region)) missingVariables.push('VITE_COGNITO_REGION');

  if (missingVariables.length > 0) {
    throw new Error(`AWS Cognito credentials missing. You must open your .env file and paste real AWS credentials for: ${missingVariables.join(', ')}`);
  }

  return true;
};
