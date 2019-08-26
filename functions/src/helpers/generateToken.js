const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (payload, expires = '24h') => {
  const token = jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { expiresIn: expires }
  );
  return token;
}

module.exports = generateToken;
