/* eslint-disable promise/no-nesting */
const fs = require("fs");
const admin = require("firebase-admin");
const {
	cloudinaryUpload,
	cloudinaryDestroy,
	getIdFromUrl
} = require("../../helpers/cloudinary");

const db = admin.firestore();

const handleEditArticle = (
	request,
	response,
	articleRef,
	{id, title, categoryId, content, imageUrl}
) => {
	return articleRef
		.get()
		.then(oldDoc => {
			const doc = oldDoc.data();
			if (doc.user !== request.payload.uid) {
				return response.status(401).json({
					success: false,
					message: "You can only edit your articles"
				});
			}
			return db
				.collection("articles")
				.doc(id)
				.set(
					{
						title: title || doc.title,
						content: content || doc.content,
						category: categoryId || doc.category,
						published: doc.published || false,
						imageUrl: imageUrl || doc.imageUrl,
						updated: new Date().getTime()
					},
					{merge: true}
				);
		})
		.then(() =>
			response.status(200).send({
				success: true,
				message: "Post Updated"
			})
		)
		.catch(err => {
			return response.status(500).send({
				success: false,
				message: "Article does not exist",
				errM: err.message,
				errS: err.stack
			});
		});
};

const editArticle = (request, response) => {
	const {id} = request.params;
	const {title, content, categoryId} = request.body;

	const [image] = request.files;
	let imageUrl = "";
	const articleRef = db.collection("articles").doc(id);
	if (image) {
		return articleRef
			.get()
			.then(docRef => {
				const doc = docRef.data();
				if (doc.user !== request.payload.uid) {
					return response.status(401).json({
						success: false,
						message: "You can only edit your articles"
					});
				}
				const imageID = getIdFromUrl(doc.imageUrl);
				return cloudinaryDestroy(imageID);
			})
			.then(() => {
				return cloudinaryUpload(image.filepath);
			})
			.then(result => {
				fs.unlinkSync(image.filepath, error => {
					if (error) throw new Error(error.message);
				});
				imageUrl = result.secure_url;
			})
			.catch(err => {
				return response.status(500).send({
					success: false,
					message: "Something went wrong while uploading image"
				});
			})
			.finally(() => {
				return handleEditArticle(request, response, articleRef, {
					id,
					title,
					content,
					categoryId,
					imageUrl
				});
			});
	} else {
		return handleEditArticle(request, response, articleRef, {
			id,
			title,
			content,
			categoryId,
			imageUrl
		});
	}
};
module.exports = editArticle;
