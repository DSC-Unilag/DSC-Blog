/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');

const db = admin.firestore();

const contributorApplication = (request, response) => {
  const { firstname, lastname, email, reason } = request.body;
  if (!firstname || !lastname || !email || !reason) {
    return response.status(400).send({
      success: false,
      message: 'Missing input/fields'
    });
  }

  return db
    .collection('applications')
    .add({
      firstname,
      lastname,
      email,
      reason,
      status: 'pending',
      updated: new Date().getTime(),
      created: new Date().getTime()
    })
    .then(() => {
      return response.status(201).send({
        success: true,
        message: 'Application sent in successfully',
        data: {
          firstname,
          lastname,
          email
        }
      });
    })
    .catch(() => {
      return response.status(500).send({
        success: false,
        message: 'Something went wrong'
      });
    });
};

module.exports = contributorApplication;
