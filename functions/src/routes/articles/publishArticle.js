/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const publishArticle = (request, response) => {
	const {aid} = request.body;
	return db
		.collection("articles")
        .doc(aid)
        .update({
			published: true
		})
		.then(() => {
			return response.status(200).send({
				success: true,
				message: "Article Published"
			});
		})
		.catch(() => {
			return response.status(500).send({
				success: false,
                message: "Something went wrong"
			});
		});
};

module.exports = publishArticle;
