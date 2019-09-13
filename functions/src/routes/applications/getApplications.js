/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const getApplications = (request, response) => {
	return db
		.collection("applications")
		.where("status", "==", request.status)
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
				message: "Applications Retrieved",
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

module.exports = getApplications;
