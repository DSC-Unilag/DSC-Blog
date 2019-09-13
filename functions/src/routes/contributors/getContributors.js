/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');

const db = admin.firestore();

const getContributors = (request, response) => db
  .collection('users')
  .where('role', '==', 'contributor')
  .get()
  .then((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return response.status(200).send({
      success: true,
      message: 'Contributors Retrieved',
      data,
    });
  })
  .catch(() => response.status(500).send({
    success: false,
    message: 'Something went wrong',
  }));

module.exports = getContributors;
