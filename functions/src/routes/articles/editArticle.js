/* eslint-disable promise/no-nesting */
const fs = require('fs');
const admin = require('firebase-admin');
const {
  cloudinaryUpload,
  cloudinaryDestroy,
  getIdFromUrl,
} = require('../../helpers/cloudinary');
const { deleteFile } = require('../../middleware/gcloudStorage');

const db = admin.firestore();

const handleEditArticle = (
  request,
  response,
  articleRef,
  {
    id, title, categoryId, content, imageUrl,
  },
) => articleRef
  .get()
  .then((oldDoc) => {
    const doc = oldDoc.data();
    if (doc.user !== request.payload.uid) {
      return response.status(401).json({
        success: false,
        message: 'You can only edit your articles',
      });
    }
    return db
      .collection('articles')
      .doc(id)
      .set(
        {
          title: title || doc.title,
          content: content || doc.content,
          category: categoryId || doc.category,
          published: doc.published || false,
          imageUrl: imageUrl || doc.imageUrl,
          updated: new Date().getTime(),
        },
        { merge: true },
      );
  })
  .then(() => response.status(200).send({
    success: true,
    message: 'Post Updated',
  }))
  .catch((err) => response.status(500).send({
    success: false,
    message: 'Article does not exist',
    errM: err.message,
    errS: err.stack,
  }));

const editArticle = (request, response) => {
  const { id } = request.params;
  const { title, content, categoryId } = request.body;
  let imageUrl = '';
  const articleRef = db.collection('articles').doc(id);
  const image = request.file;
  if (image) {
    return articleRef
      .get()
      .then((docRef) => {
        const doc = docRef.data();
        if (doc.user !== request.payload.uid) {
          return response.status(401).json({
            success: false,
            message: 'You can only edit your articles',
          });
        }
        const imageID = getIdFromUrl(doc.imageUrl);
        return cloudinaryDestroy(imageID);
      })
      .then(() => cloudinaryUpload(image))
      .then((result) => {
        deleteFile(image.split('/')[4]).then(() => {
          imageUrl = result.secure_url;
        });
      })
      .catch(() => response.status(500).send({
        success: false,
        message: 'Something went wrong while uploading image',
      }))
      .finally(() => handleEditArticle(request, response, articleRef, {
        id,
        title,
        content,
        categoryId,
        imageUrl,
      }));
  }
  return handleEditArticle(request, response, articleRef, {
    id,
    title,
    content,
    categoryId,
    imageUrl,
  });
};
module.exports = editArticle;
