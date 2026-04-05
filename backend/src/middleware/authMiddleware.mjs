import { CognitoJwtVerifier } from "aws-jwt-verify";
import config from "../../config.mjs";
import User from "../models/userModel.mjs";

export const requireAuth = async (req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(200);

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Authorization header provided" });
    }

    const token = authHeader.split(" ")[1];

    const verifier = CognitoJwtVerifier.create({
      userPoolId: config.userPoolId,
      tokenUse: "id", 
      clientId: config.clientId,
    });

    const payload = await verifier.verify(token);
    
    req.user = payload;
    next();
  } catch (err) {
    console.error("Critical JWT Verification Failure:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = async (req, res, next) => {
  // First ensure they are authenticated
  requireAuth(req, res, async () => {
    try {
      const dbUser = await User.findOne({ userId: req.user.sub });
      // Special override: you can set config.adminEmail or check a specific email
      if (req.user.email === 'admin@gmail.com' && (!dbUser || dbUser.role !== 'admin')) {
        if (dbUser) {
           dbUser.role = 'admin';
           await dbUser.save();
        }
        return next();
      }

      if (!dbUser || dbUser.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      next();
    } catch (err) {
      console.error("Admin check failed:", err);
      res.status(500).json({ message: "Server error during admin check" });
    }
  });
};
