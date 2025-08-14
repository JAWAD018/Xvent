// import jwt from "jsonwebtoken";

// // Generate JWT Token
// export const generateToken = (userId, role) => {
//   return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
//     expiresIn: "7d", // token validity
//   });
// };

// // Verify JWT Middleware
// export const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };

// // Role Authorization Middleware
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// };

import jwtLib from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Generate JWT Token
const generateToken = (payload) => {
  return jwtLib.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d", // token validity
  });
};

// console.log(process.env.JWT_SECRET);

// Verify JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwtLib.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Role Authorization Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// Export as a single object
export const jwt = {
  generateToken,
  verifyToken,
  authorizeRoles,
};
