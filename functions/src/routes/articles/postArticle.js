/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const postArticle = (request, response) => {
	const {title, content, categoryId} = request.body;
	if (!title || !content || !categoryId) {
		return response.status(400).send({
			success: false,
			message: "Missing input/fields"
		});
	}

	return db
		.collection("articles")
		.add({
			title,
			content,
			user: request.payload.uid,
			category: categoryId,
			published: false,
			updated: new Date().getTime(),
			created: new Date().getTime()
		})
		.then(() => {
			return response.status(201).send({
				success: true,
				message: "Post Sent for Review"
			});
		})
		.catch(() => {
			return response.status(500).send({
				success: false,
				message: "Something went wrong"
			});
		});
};

module.exports = postArticle;
