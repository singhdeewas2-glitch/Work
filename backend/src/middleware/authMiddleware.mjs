import { CognitoJwtVerifier } from "aws-jwt-verify";
import config from "../../config.mjs";
import User from "../models/userModel.mjs";

export const requireAuth = async (req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(200);

  try {
    console.log("=== AUTH DEBUG START ===");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request headers:", JSON.stringify(req.headers, null, 2));
    
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);
    console.log("Auth header type:", typeof authHeader);
    console.log("Auth header length:", authHeader?.length || 0);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("ERROR: No Bearer token found");
      console.log("Available headers:", Object.keys(req.headers));
      return res.status(401).json({ message: "No Authorization header provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token.substring(0, 50) + "...");
    console.log("Token length:", token.length);

    // Try to decode token without verification first to see payload structure
    try {
      const decodedWithoutVerification = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      console.log("Decoded token payload (no verification):", JSON.stringify(decodedWithoutVerification, null, 2));
      console.log("Token use claim:", decodedWithoutVerification.token_use);
      console.log("Client ID claim:", decodedWithoutVerification.client_id);
      console.log("Groups in payload:", decodedWithoutVerification['cognito:groups']);
    } catch (decodeErr) {
      console.log("Failed to decode token for inspection:", decodeErr.message);
    }

    // Try with access token first (since frontend sends accessToken)
    console.log("=== VERIFYING AS ACCESS TOKEN ===");
    try {
      const accessVerifier = CognitoJwtVerifier.create({
        userPoolId: config.userPoolId,
        tokenUse: "access", 
        clientId: config.clientId,
      });

      const payload = await accessVerifier.verify(token);
      console.log("SUCCESS: Access token verified!");
      console.log("JWT Payload:", JSON.stringify(payload, null, 2));
      console.log("Cognito Groups:", payload['cognito:groups']);
      console.log("User Sub:", payload.sub);
      console.log("User Email:", payload.email);
      
      req.user = payload;
      next();
      return;
    } catch (accessErr) {
      console.log("Access token verification failed:", accessErr.message);
    }

    // Fallback: Try with id token
    console.log("=== TRYING AS ID TOKEN ===");
    try {
      const idVerifier = CognitoJwtVerifier.create({
        userPoolId: config.userPoolId,
        tokenUse: "id", 
        clientId: config.clientId,
      });

      const payload = await idVerifier.verify(token);
      console.log("SUCCESS: ID token verified!");
      console.log("JWT Payload:", JSON.stringify(payload, null, 2));
      console.log("Cognito Groups:", payload['cognito:groups']);
      console.log("User Sub:", payload.sub);
      console.log("User Email:", payload.email);
      
      req.user = payload;
      next();
      return;
    } catch (idErr) {
      console.log("ID token verification failed:", idErr.message);
    }

    // Both failed
    console.error("CRITICAL: Both access and id token verification failed");
    return res.status(401).json({ message: "Invalid or expired token - tried both access and id token" });
  } catch (err) {
    console.error("Critical JWT Verification Failure:", err.message);
    console.error("Full error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = async (req, res, next) => {
  console.log("=== ADMIN AUTH CHECK ===");
  
  // First ensure they are authenticated
  requireAuth(req, res, async () => {
    try {
      console.log("JWT verification successful, checking admin access...");
      
      // Check if user is in admins group from JWT token
      const cognitoGroups = req.user['cognito:groups'] || [];
      console.log("User cognito:groups:", cognitoGroups);
      console.log("Groups type:", typeof cognitoGroups);
      console.log("Groups includes 'admins':", cognitoGroups.includes('admins'));
      
      // Allow access if user is in admins group
      if (cognitoGroups.includes('admins')) {
        console.log("SUCCESS: User has admin access - groups:", cognitoGroups);
        return next();
      }

      console.log("Admin access DENIED - not in admins group");
      
      // Fallback: Check database role for backward compatibility
      const dbUser = await User.findOne({ userId: req.user.sub });
      if (req.user.email === 'admin@gmail.com' && (!dbUser || dbUser.role !== 'admin')) {
        console.log("Fallback: Granting admin access to admin@gmail.com");
        if (dbUser) {
           dbUser.role = 'admin';
           await dbUser.save();
        }
        return next();
      }

      console.log("Admin access FAILED - no admin rights found");
      if (!dbUser || dbUser.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required - cognito groups: " + JSON.stringify(cognitoGroups) });
      }
      next();
    } catch (err) {
      console.error("Admin check failed:", err);
      res.status(500).json({ message: "Server error during admin check" });
    }
  });
};
