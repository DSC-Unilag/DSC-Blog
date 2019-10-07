/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const { cloudinaryDestroy, getIdFromUrl } = require('../../helpers/cloudinary');

const db = admin.firestore();

const deleteContributor = (request, response) => {
  const { uid } = request.params;
  return db
    .collection('articles')
    .where('user', '==', uid)
    .get()
    .then((snapshot) => {
      const deleteContributorArticles = snapshot.docs.map((docRef) => db
        .collection('articles')
        .doc(docRef.id)
        .delete());
      // Delete Image From Cloudinary
      snapshot.docs.forEach((docRef) => {
        const articleData = { ...docRef.data() };
        const imageID = getIdFromUrl(articleData.imageUrl);
        deleteContributorArticles.push(cloudinaryDestroy(imageID));
      });
      return Promise.all(deleteContributorArticles);
    })
    .then(() => db
      .collection('users')
      .doc(uid)
      .delete())
    .then(() => response.status(200).send({
      success: true,
      message: 'Contributor Deleted',
    }))
    .catch(() => response.status(500).send({
      success: false,
      message: 'Something went wrong',
    }));
};

module.exports = deleteContributor;
