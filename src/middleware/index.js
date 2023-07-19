const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const jwtMiddleware = async (req, res, next) => {
  const Authorization = req.header("Authorization")
    ? req.header("Authorization").split("Bearer ")[1]
    : null;

  if (!Authorization) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }
  try {
    const secretkey =
      "72960973554fa34a8f04c4ddbf5ae30f818a8f45886e854ee5af79b6389d928b";
    const decoded = await jwt.verify(Authorization, secretkey);
    const userId = decoded._id;
    const findUser = await UserModel.findById(userId);
    req.user = findUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = jwtMiddleware;
