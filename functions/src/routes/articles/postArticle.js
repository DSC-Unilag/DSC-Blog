/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const { cloudinaryUpload } = require('../../helpers/cloudinary');
const { deleteFile } = require('../../middleware/gcloudStorage');

const db = admin.firestore();

const postArticle = (request, response) => {
  const { title, content, categoryId } = request.body;
  const image = request.file;
  if (!title || !content || !categoryId || !image) {
    return response.status(400).send({
      success: false,
      message: 'Missing input/fields',
    });
  }
  return cloudinaryUpload(image)
    .then((result) => db.collection('articles').add({
      title,
      content,
      imageUrl: result.secure_url,
      user: request.payload.uid,
      category: categoryId,
      published: false,
      updated: new Date().getTime(),
      created: new Date().getTime(),
    }))
    .then(() => deleteFile(image.split('/')[4]))
    .then(() => response.status(201).send({
      success: true,
      message: 'Post Sent for Review',
    }))
    .catch(() => response.status(500).send({
      success: false,
      message: 'Something went wrong',
    }));
};

module.exports = postArticle;
