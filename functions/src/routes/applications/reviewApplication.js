/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const reviewApplication = (request, response) => {
	const {appid} = request.body;
	return db
		.collection("applications")
		.doc(appid)
		.update({
			status: "reviewed"
		})
		.then(() => {
			return response.status(200).send({
				success: true,
				message: "Application Reviewed"
			});
		})
		.catch(() => {
			return response.status(500).send({
				success: false,
				message: "Something went wrong"
			});
		});
};

module.exports = reviewApplication;
