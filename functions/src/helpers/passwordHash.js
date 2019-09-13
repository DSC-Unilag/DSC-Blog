const bcrypt = require('bcryptjs');

const hash = (password, salt) => bcrypt.hashSync(password, salt);

const compare = (password, hashed) => bcrypt.compareSync(password, hashed);

module.exports = {
  hash,
  compare,
};
