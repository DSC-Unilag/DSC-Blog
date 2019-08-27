/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const randomize = require('../../helpers/randomize');
const passwordHash = require('../../helpers/passwordHash');
const verifyUser = require('../../helpers/verifyUser');
const userPermissions = require('../../helpers/userPermissions');

const db = admin.firestore();

const createAdmin = (request, response) => {
  const { firstname, lastname, email } = request.body;
  if (!firstname || !lastname || !email) {
    return response.status(400).send({
      success: false,
      message: 'Missing input/fields'
    });
  }
  return verifyUser({ email }, ['email'])
    .then(check => {
      if (check) {
        return response.status(409).send({
          success: false,
          message: 'This user already exists'
        });
      }
      const password = passwordHash.hash(randomize(10), 10);
      const role = 'admin';
      const claims = userPermissions(role);
      if (!claims) {
        return response.status(409).send({
          success: false,
          message: 'Please add a valid role'
        });
      }

      return db
        .collection('users')
        .add({
          firstname,
          lastname,
          email,
          password,
          role,
          claims,
          updated: new Date().getTime(),
          created: new Date().getTime()
        })
        .then(() => {
          return response.status(201).send({
            success: true,
            message: 'Admin successfully created',
            data: {
              firstname,
              lastname,
              email,
              role,
              claims
            }
          });
        })
        .catch(() => {
          return response.status(500).send({
            success: false,
            message: 'Something went wrong'
          });
        });
    });
};

module.exports = createAdmin;
