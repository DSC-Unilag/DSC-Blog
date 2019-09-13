/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const randomize = require('../../helpers/randomize');
const passwordHash = require('../../helpers/passwordHash');
const verifyUser = require('../../helpers/verifyUser');
const userPermissions = require('../../helpers/userPermissions');

const db = admin.firestore();

const createContributor = (request, response) => {
  const { conid } = request.body;
  if (!conid) {
    return response.status(400).send({
      success: false,
      message: 'Missing input/fields',
    });
  }
  return db
    .collection('applications')
    .doc(conid)
    .get()
    .then((docRef) => {
      const applicantData = docRef.data();
      if (applicantData.status !== 'reviewed') {
        return response.status(412).send({
          success: false,
          message: 'Review Application before approval',
        });
      }
      const actualPassword = randomize(10);
      const password = passwordHash.hash(actualPassword, 10);
      const role = 'contributor';
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
          firstname: applicantData.firstname,
          lastname: applicantData.lastname,
          email: applicantData.email,
          password,
          role,
          claims,
          updated: new Date().getTime(),
          created: new Date().getTime(),
        })
        .then((newDocRef) => response.status(201).send({
          success: true,
          message: 'Contributor successfully created',
          data: {
            id: docRef.id,
            firstname: applicantData.firstname,
            lastname: applicantData.lastname,
            email: applicantData.email,
            role,
          },
        }));
      // Email the contributor his/her details
    })
    .catch((err) => response.status(500).send({
      success: false,
      message: 'Something went wrong',
      errM: err.message,
      errS: err.stack,
      err,
    }));
};

module.exports = { createContributor };
