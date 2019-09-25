/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const deleteContributor = (request, response) => {
	const {cid} = request.params;
	return db
		.collection("users")
		.doc(cid)
		.delete()
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
