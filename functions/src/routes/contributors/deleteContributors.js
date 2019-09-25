/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const deleteContributor = (request, response) => {
	const {uid} = request.params;
	return db
		.collection("articles")
		.where("user", "==", uid)
		.get()
		.then(snapshot => {
			const deleteContributorArticles = snapshot.docs.map(docRef => {
				return db
					.collection("articles")
					.doc(docRef.id)
					.delete();
			});
			return Promise.all(deleteContributorArticles);
		})
		.then(() => {
			return db
				.collection("users")
				.doc(uid)
				.delete();
		})
		.then(() =>
			response.status(200).send({
				success: true,
				message: "Contributor Deleted"
			})
		)
		.catch(() =>
			response.status(500).send({
				success: false,
				message: "Something went wrong"
			})
		);
};

module.exports = deleteContributor;
