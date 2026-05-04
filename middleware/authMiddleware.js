const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Remove "Bearer "
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, "secretkey");

    // ✅ FIX HERE
    req.user = decoded;  // 🔥 IMPORTANT CHANGE

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};