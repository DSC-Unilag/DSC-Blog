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
			return data;
		})
		.then(data => {
			const populateUsers = data.map(doc => {
				return db
					.collection("users")
					.doc(doc.user)
					.get()
					.then(docRef => {
						const userData = docRef.data();
						return {
							...doc,
							user: {
								firstname: userData.firstname,
								lastname: userData.lastname,
								email: userData.email,
								role: userData.role,
								uid: docRef.id
							}
						};
					});
			});
			return Promise.all(populateUsers);
		})
		.then(data => {
			const populateCategories = data.map(doc => {
				return db
					.collection("categories")
					.doc(doc.category)
					.get()
					.then(docRef => {
						return {...doc, category: {...docRef.data(), cid: docRef.id}};
					});
			});
			return Promise.all(populateCategories);
		})
		.then(data => {
			return response.status(200).json({
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
