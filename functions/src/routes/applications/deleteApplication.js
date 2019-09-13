/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const deleteApplication = (request, response) => {
	const {appid} = request.params;
	const appRef = db.collection("applications").doc(appid);
	return appRef
		.get()
		.then(docRef => {
			const applicationData = docRef.data();
			if (applicationData.status !== "reviewed") {
				return response.status(412).send({
					success: false,
					message: "Application must be reviewed before deleting"
				});
			}
			return appRef.delete();
		})
		.then(() => {
			return response.status(200).send({
				success: true,
				message: "Application Deleted"
			});
		})
		.catch(() => {
			return response.status(500).send({
				success: false,
				message: "Something went wrong"
			});
		});
};

module.exports = deleteApplication;
