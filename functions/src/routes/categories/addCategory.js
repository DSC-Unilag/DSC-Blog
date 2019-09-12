/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

const db = admin.firestore();

const addCategory = (request, response) => {
    const { name } = request.body;
	return db
		.collection("categories")
		.add({
            name,
            updated: new Date().getTime(),
		    created: new Date().getTime()
        })
		.then(docRef => {
			return response.status(201).send({
				success: true,
                message: "Category Added",
                data: {
                    id: docRef.id,
                    name
                }
			});
		})
		.catch(() => {
			return response.status(500).send({
				success: false,
				message: "Something went wrong"
			});
		});
};

module.exports = addCategory;
