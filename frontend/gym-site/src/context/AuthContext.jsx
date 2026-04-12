/*
AuthContext
Handles user authentication state and AWS Cognito integration
Provides signup, login, logout, and session management functionality
*/

import React, { createContext, useState, useEffect, useContext } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPoolId, clientId, validateCognitoConfig } from '../config/cognitoConfig';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

let userPool = null;
let configError = null;

try {
  validateCognitoConfig();
  userPool = new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId
  });
} catch (error) {
  configError = error.message;
}

export const AuthProvider = ({ children }) => {
  // State management
  const [user, setUser] = useState(null);           // Cognito user object
  const [dbUser, setDbUser] = useState(null);       // Database user profile
  const [loading, setLoading] = useState(true);     // Initial loading state

  // Check for existing user session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  // Check if user has valid session and fetch profile data
  const checkSession = () => {
    if (!userPool) {
      setLoading(false);
      return;
    }
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession(async (err, session) => {
        if (err || !session.isValid()) {
          // Invalid session - clear user data
          setUser(null);
          setDbUser(null);
          setLoading(false);
        } else {
          // Valid session - set user and fetch profile
          setUser(currentUser);
          await fetchDbProfile(session.getIdToken().getJwtToken());
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  };

  // Fetch user profile from database using JWT token
  const fetchDbProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDbUser(data);
      }
    } catch (err) {
      // Error fetching user profile data - will be handled by UI
    }
  };

  // Get current user session - used for authenticated API calls
  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      const currentUser = userPool.getCurrentUser();
      if (currentUser) {
        currentUser.getSession((err, session) => {
          if (err) {
            reject(err);
          } else {
            resolve(session);
          }
        });
      } else {
        reject(new Error('No active user session found'));
      }
    });
  };

  // Register new user with Cognito
  const signup = async (email, password, name) => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      
      // User attributes for registration
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'name',
          Value: name
        }),
        new CognitoUserAttribute({
          Name: 'profile',
          Value: 'https://dummy.com/profile.png'
        }),
        new CognitoUserAttribute({
          Name: 'custom:profileUrl',
          Value: 'default.png'
        })
      ];
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  // Authenticate user with email and password
  const login = async (email, password) => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });
      
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: async (data) => {
          // Successful login - set user and fetch profile
          setUser(cognitoUser);
          await fetchDbProfile(data.getIdToken().getJwtToken());
          resolve(data);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  // Sign out user and clear state
  const logout = () => {
    if (!userPool) return;
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setUser(null);
    setDbUser(null);
  };

  // Initiate password reset flow
  const forgotPassword = async (email) => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.forgotPassword({
        onSuccess: (data) => resolve(data),
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  // Complete password reset with verification code
  const confirmPassword = async (email, verificationCode, newPassword) => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => resolve(),
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={{ user, dbUser, loading, session: getSession, signup, login, logout, forgotPassword, confirmPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
