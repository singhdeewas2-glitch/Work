import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import User from '../models/userModel.mjs';
import config from '../../config.mjs';

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey,
  }
});

export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log(`[API] Signup request received for ${email}`);
    
    if (!config.clientId) {
      return res.status(500).json({ message: "Backend Cognito ClientId missing" });
    }

    const command = new SignUpCommand({
      ClientId: config.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'name', Value: name }
      ]
    });

    const response = await cognitoClient.send(command);
    console.log(`[API] Signup success for ${email}`);
    res.json({ message: "Signup successful", data: response });
  } catch (error) {
    console.error(`[API] Signup error:`, error.message);
    res.status(400).json({ message: error.message || "Signup failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[API] Login request received for ${email}`);
    
    if (!config.clientId) {
      return res.status(500).json({ message: "Backend Cognito ClientId missing" });
    }

    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: config.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      }
    });

    const response = await cognitoClient.send(command);
    console.log(`[API] Login success for ${email}`);
    
    res.json({ 
      message: "Login successful", 
      user: { email },
      token: response.AuthenticationResult.IdToken 
    });
  } catch (error) {
    console.error(`[API] Login error:`, error.message);
    res.status(401).json({ message: error.message || "Invalid email or password" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.sub;
    let userProfile = await User.findOne({ userId });
    
    if (!userProfile) {
      userProfile = new User({ 
        userId, 
        email: req.user.email,
        role: req.user.email === 'admin@gmail.com' ? 'admin' : 'user'
      });
      await userProfile.save();
    } else if (req.user.email === 'admin@gmail.com' && userProfile.role !== 'admin') {
      userProfile.role = 'admin';
      await userProfile.save();
    }
    
    res.json(userProfile);
  } catch (err) {
    console.error("GET /profile error:", err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
