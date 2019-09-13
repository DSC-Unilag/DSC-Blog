/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');

const db = admin.firestore();

const getAllCategories = (request, response) => db
  .collection('categories')
  .get()
  .then((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return response.status(200).send({
      success: true,
      message: 'Categories Retrieved',
      data,
    });
  })
  .catch(() => response.status(500).send({
    success: false,
    message: 'Something went wrong',
  }));

module.exports = getAllCategories;
