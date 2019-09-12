/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getAllArticles = (request, response) => {
	return db
		.collection("articles")
		.where("published", "==", request.published)
		.get()
		.then(snapshot => {
			const data = snapshot.docs.map(doc => {
				return {...doc.data(), aid: doc.id};
			});
			return response.status(200).send({
				success: true,
				message: "Articles Retrieved",
				data
			});
		})
		.catch(() => {
			return response.status(500).send({
				success: false,
				message: "Something went wrong"
			});
		});
};

module.exports = getAllArticles;
