import { CognitoJwtVerifier } from "aws-jwt-verify";
import config from "../../config.mjs";

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
