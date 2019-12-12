/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const randomize = require('../../helpers/randomize');
const passwordHash = require('../../helpers/passwordHash');
const verifyUser = require('../../helpers/verifyUser');
const userPermissions = require('../../helpers/userPermissions');
const { sendMail } = require('../../helpers/mail');

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
    const passwordToken = randomize(20);
    const password = passwordHash.hash(randomize(10), 10);
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
        passwordToken,
        updated: new Date().getTime(),
        created: new Date().getTime(),
      })
      .then(() => sendMail({
        to: email,
        subject: 'Congratulations Admin!',
        html: `<p>You have been selected to be an administrator on DSC Unilag Blog</p>
        <p>Go to this link to set your password: ${process.env.APP_URL}change_password.html?token=${passwordToken}&email=${email} </p>`,
      }))
      .then(() => response.status(201).send({
        success: true,
        message: 'Admin successfully created',
        data: {
          firstname,
          lastname,
          email,
          role,
          claims,
        },
      }))
      .catch(() => response.status(500).send({
        success: false,
        message: 'Something went wrong',
      }));
  });
};

module.exports = { createAdmin };
