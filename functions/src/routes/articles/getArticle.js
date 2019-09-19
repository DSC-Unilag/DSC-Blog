/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');

const db = admin.firestore();

const getArticle = (request, response) => {
  const { id } = request.params;
  return db
    .collection('articles')
    .doc(id)
    .get()
    .then((docRef) => ({ ...docRef.data(), aid: docRef.id }))
    .then((data) => db
      .collection('users')
      .doc(data.user)
      .get()
      .then((docRef) => {
        const userData = docRef.data();
        return {
          ...data,
          user: {
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            role: userData.role,
            uid: docRef.id,
          },
        };
      }))
    .then((data) => db
      .collection('categories')
      .doc(data.category)
      .get()
      .then((docRef) => ({
        ...data,
        category: { ...docRef.data(), cid: docRef.id },
      })))
    .then((data) => response.status(200).json({
      success: true,
      message: 'Article Retrieved',
      data,
    }))
    .catch(() => response.status(500).send({
      success: false,
      message: 'Something went wrong',
    }));
};

module.exports = getArticle;
