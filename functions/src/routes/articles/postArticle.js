/* eslint-disable promise/no-nesting */
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const { cloudinaryUpload } = require('../../helpers/cloudinary');

const db = admin.firestore();

const postArticle = (request, response) => {
  const { title, content, categoryId } = request.body;
  if (!title || !content || !categoryId) {
    return response.status(400).send({
      success: false,
      message: 'Missing input/fields',
    });
  }

  const [image] = request.files;
  return cloudinaryUpload(image.filepath)
    .then((result) => {
      fs.unlinkSync(image.filepath, (error) => {
        if (error) throw new Error(error.message);
      });
      return db.collection('articles').add({
        title,
        content,
        imageUrl: result.secure_url,
        user: request.payload.uid,
        category: categoryId,
        published: false,
        updated: new Date().getTime(),
        created: new Date().getTime(),
      });
    })
    .then(() => response.status(201).send({
      success: true,
      message: 'Post Sent for Review',
    }))
    .catch(() => response.status(500).send({
      success: false,
      message: 'Something went wrong'
    }));
};

module.exports = postArticle;
