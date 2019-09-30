/* eslint-disable promise/no-nesting */
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const { cloudinaryUpload } = require('../../helpers/cloudinary');

const db = admin.firestore();

const editArticle = (request, response) => {
    const { id } = request.query;
    const { title, content, categoryId } = request.body;

    const [image] = request.files;
    let imageUrl = "";

    if(image) {
    cloudinaryUpload(image.filepath)
        .then((result) => {
            fs.unlinkSync(image.filepath, (error) => {
                if (error) throw new Error(error.message);
              });
            imageUrl = result.secure_url;
        })
        .catch(() => response.status(500).send({
            success: false,
            message: 'Something went wrong while uploading image'
          })) 
    }
   
    db.collection('articles')
        .doc(id)
        .get()
        .then((oldDoc) => {
            const doc = oldDoc.data();
            return db
                .collection('articles')
                .doc(id)
                .set({
                    title: title || doc.title ,
                    content: content || doc.content,
                    categoryId: categoryId || doc.categoryId,
                    published: doc.published || false,
                    imageUrl: imageUrl || doc.imageUrl,
                    updated: new Date().getTime()
                }, {merge: true})
                .then(() => response.status(201).send({
                    success: true,
                    message: 'Post Updated',
                    }))
                .catch(() => response.status(500).send({
                success: false,
                message: 'Something went wrong'
                }));
        })
        .catch(() => response.status(500).send({
            success: false,
            message: 'Article does not exist'
         }))


    }
module.exports = editArticle;