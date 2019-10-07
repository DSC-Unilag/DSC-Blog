/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const { cloudinaryDestroy, getIdFromUrl } = require('../../helpers/cloudinary');

const db = admin.firestore();

const deleteArticle = (request, response) => {
  const { aid } = request.params;
  const articleRef = db.collection('articles').doc(aid);
  return articleRef
    .get()
    .then((docRef) => {
      const data = { ...docRef.data(), aid: docRef.id };
      if (data.user !== request.payload.uid) {
        return response.status(401).json({
          success: false,
          message: 'You can only delete your articles',
        });
      }
      const imageID = getIdFromUrl(data.imageUrl);
      console.log(imageID);
      return cloudinaryDestroy(imageID);
    })
    .then(() => articleRef.delete())
    .then(() => response.status(200).json({
      success: true,
      message: 'Article Deleted',
    }))
    .catch(() => response.status(500).send({
      success: false,
      message: 'Something went wrong',
    }));
};

module.exports = deleteArticle;
