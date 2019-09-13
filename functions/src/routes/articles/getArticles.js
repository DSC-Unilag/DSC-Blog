/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');

const db = admin.firestore();

const queries = {
  all: (published) => db.collection('articles').where('published', '==', published),
  category: (cid) => db
    .collection('articles')
    .where('published', '==', true)
    .where('category', '==', cid),
  user: (uid) => db.collection('articles').where('user', '==', uid),
};

const getArticles = (request, response) => {
  let query;
  if (request.type !== 'all') {
    const firstEl = Object.keys(request.params)[0];
    query = queries[request.type](request.params[firstEl]);
  } else {
    query = queries[request.type](request.published);
  }
  return query
    .get()
    .then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), aid: doc.id }));
      return data;
    })
    .then((data) => {
      const populateUsers = data.map((doc) => db
        .collection('users')
        .doc(doc.user)
        .get()
        .then((docRef) => {
          const userData = docRef.data();
          return {
            ...doc,
            user: {
              firstname: userData.firstname,
              lastname: userData.lastname,
              email: userData.email,
              role: userData.role,
              uid: docRef.id,
            },
          };
        }));
      return Promise.all(populateUsers);
    })
    .then((data) => {
      const populateCategories = data.map((doc) => db
        .collection('categories')
        .doc(doc.category)
        .get()
        .then((docRef) => ({
          ...doc,
          category: { ...docRef.data(), cid: docRef.id },
        })));
      return Promise.all(populateCategories);
    })
    .then((data) => {
      const type = request.type[0].toUpperCase() + request.type.slice(1);
      return response.status(200).json({
        success: true,
        message: `${type} Articles Retrieved`,
        data,
      });
    })
    .catch(() => response.status(500).send({
      success: false,
      message: 'Something went wrong',
    }));
};

module.exports = getArticles;
