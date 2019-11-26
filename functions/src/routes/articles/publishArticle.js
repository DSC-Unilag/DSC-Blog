/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const publishArticle = (request, response) => {
	const {aid} = request.body;
	const articleRef = db.collection("articles").doc(aid);
	return articleRef
		.get()
		.then(docRef => {
			if (request.payload.role !== "super admin") {
				const doc = docRef.data();
				if (doc.user === request.payload.uid) {
					return response.status(401).json({
						success: false,
						message: "You cannot publish your own articles"
					});
				}
			}
			return articleRef.update({
				published: true
			});
		})
		.then(() =>
			response.status(200).send({
				success: true,
				message: "Article Published"
			})
		)
		.catch(() =>
			response.status(500).send({
				success: false,
				message: "Something went wrong"
			})
		);
};

module.exports = publishArticle;
