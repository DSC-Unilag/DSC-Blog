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
      message: 'Missing input/fields',
    });
  }
  return verifyUser({ email }, ['email']).then((check) => {
    if (check) {
      return response.status(409).send({
        success: false,
        message: 'This user already exists',
      });
    }
    const actualPassword = randomize(10);
    const password = passwordHash.hash(actualPassword, 10);
    const role = 'admin';
    const claims = userPermissions(role);
    if (!claims) {
      return response.status(409).send({
        success: false,
        message: 'Please add a valid role',
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
        created: new Date().getTime(),
      })
      .then(
        (docRef) => response.status(201).send({
          success: true,
          message: 'Admin successfully created',
          data: {
            id: docRef.id,
            firstname,
            lastname,
            email,
            role,
            claims,
          },
        }),
        // Email the contributor his/her details
      )
      .catch(() => response.status(500).send({
        success: false,
        message: 'Something went wrong',
      }));
  });
};

module.exports = { createAdmin };
