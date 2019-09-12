/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getAllCategories = (request, response) => {
	return db
		.collection("categories")
		.get()
		.then(snapshot => {
			const data = snapshot.docs.map(doc => {
				return {
					...doc.data(),
					id: doc.id
				};
			});
			return response.status(200).send({
				success: true,
				message: "Categories Retrieved",
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

module.exports = getAllCategories;
