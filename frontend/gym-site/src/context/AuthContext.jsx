import React, { createContext, useState, useEffect, useContext } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { userPoolId, clientId, validateCognitoConfig } from '../config/cognitoConfig';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
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
  console.error("Cognito Configuration Error:", error.message);
  configError = error.message;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    if (!userPool) {
      setLoading(false);
      return;
    }
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err || !session.isValid()) {
          setUser(null);
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  };

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

  const signup = async (email, password, name) => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      
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
          console.error("Cognito Signup Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  const login = async (email, password) => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });
      
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (data) => {
          setUser(cognitoUser);
          resolve(data);
        },
        onFailure: (err) => {
          console.error("Cognito Login Error:", err);
          reject(err);
        },
      });
    });
  };

  const logout = () => {
    if (!userPool) return;
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setUser(null);
  };

  const forgotPassword = async (email) => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.forgotPassword({
        onSuccess: (data) => resolve(data),
        onFailure: (err) => {
          console.error("Cognito Forgot Password Error:", err);
          reject(err);
        },
      });
    });
  };

  const confirmPassword = async (email, verificationCode, newPassword) => {
    return await new Promise((resolve, reject) => {
      if (!userPool) return reject(new Error(configError || 'Cognito User Pool is not configured.'));
      
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => resolve(),
        onFailure: (err) => {
          console.error("Cognito Confirm Password Error:", err);
          reject(err);
        },
      });
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, session: getSession, signup, login, logout, forgotPassword, confirmPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
