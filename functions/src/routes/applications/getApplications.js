/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');

const db = admin.firestore();

const getApplications = (request, response) => db
  .collection('applications')
  .where('status', '==', request.status)
  .get()
  .then((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return response.status(200).send({
      success: true,
      message: 'Applications Retrieved',
      data,
    });
  })
  .catch(() => response.status(500).send({
    success: false,
    message: 'Something went wrong',
  }));

module.exports = getApplications;
