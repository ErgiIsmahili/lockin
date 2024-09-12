require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const isAuthenticated = async (req, res, next) => {
  // Check if the authorization header is present
  const authHeader = req.headers.authorization;
  const token1 = authHeader.split(" ")[1];

  console.log(req)
  console.log(jwt.verify(token1, process.env.JWT_SECRET))
  console.log(res)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authorization header is missing or invalid" });
  }

  // Check if the header starts with "Bearer "
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    // Verify the token
    console.log('JWT Secret:', process.env.JWT_SECRET); // Temporary debug
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to the request object
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = isAuthenticated;
