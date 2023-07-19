const { sign } = require("jsonwebtoken");

const createToken = (user) => {
  const dataStoredInToken = { _id: user._id };
  const expiresIn = 60 * 60 * 24;
  const secretkey =
    "72960973554fa34a8f04c4ddbf5ae30f818a8f45886e854ee5af79b6389d928b";
  return {
    expiresIn,
    token: sign(dataStoredInToken, secretkey, { expiresIn }),
  };
};

module.exports = createToken;
