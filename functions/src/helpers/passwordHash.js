const bcrypt = require('bcrypt');

const hash = (password, salt) => bcrypt.hashSync(password, salt);

const compare = (password, hashed) => bcrypt.compareSync(password, hashed);

module.exports = {
  hash,
  compare
};
