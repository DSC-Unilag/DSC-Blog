/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const random = require("rand-token");
const generateToken = require("../../helpers/generateToken");
const passwordHash = require("../../helpers/passwordHash");
const verifyUser = require("../../helpers/verifyUser");

const db = admin.firestore();

const login = (request, response) => {
	const {email, password} = request.body;
	if (!email || !password) {
		return response.status(400).send({
			success: false,
			message: "Missing input/fields"
		});
	}
	return verifyUser({email}, ["email"]).then(check => {
		if (!check) {
			return response.status(422).send({
				success: false,
				message: "This user does not exist"
			});
		}
		return db
			.collection("users")
			.where("email", "==", email)
			.get()
			.then(snapshot => {
				const doc = snapshot.docs[0];
				const data = {...doc.data(), uid: doc.id};
				if (!passwordHash.compare(password, data.password)) {
					return response.status(422).send({
						success: false,
						message: "Invalid Password"
					});
				}
				const {password: ps, ...safe} = data;
				const token = generateToken(safe);
				const refreshToken = random.uid(256);
				return db
					.collection("refresh_tokens")
					.doc(data.uid)
					.set({
						token: refreshToken
					})
					.then(() => {
						return response.status(200).json({
							success: true,
							message: "Logged In",
                            popup: `Welcome ${data.firstname}`,
                            uid: data.uid,
							token,
							refreshToken
						});
					});
			})
			.catch(err =>
				response.status(500).send({
					success: false,
					message: "Something went wrong",
					error: err.message,
					errStack: err.stack
				})
			);
	});
};

const refreshJwtToken = (request, response) => {
	const {uid, refreshToken} = request.body;
	return db
		.collection("refresh_tokens")
		.doc(uid)
		.get()
		.then(docRef => {
			const data = {...docRef.data()};
			if (refreshToken !== data.token) {
				return response.status(401).json({
					success: false,
					message: "Unauthorized"
				});
			}
			return db
				.collection("users")
				.doc(uid)
				.get();
		})
		.then(userDoc => {
			const data = {...userDoc.data(), uid: userDoc.id};
			const {password: ps, ...safe} = data;
			const token = generateToken(safe);
			const newRefreshToken = random.uid(256);
			return db
				.collection("refresh_tokens") 
				.doc(data.uid)
				.set({
					token: newRefreshToken
				})
				.then(() => {
					return response.status(200).json({
						success: true,
						token,
						refreshToken: newRefreshToken,
						uid: data.uid
					});
				});
		})
		.catch();
};

module.exports = {login, refreshJwtToken};
