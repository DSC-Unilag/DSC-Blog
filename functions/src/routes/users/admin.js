/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const randomize = require("../../helpers/randomize");
const generateToken = require("../../helpers/generateToken");
const passwordHash = require("../../helpers/passwordHash");
const verifyUser = require("../../helpers/verifyUser");
const userPermissions = require("../../helpers/userPermissions");

const db = admin.firestore();

const createAdmin = (request, response) => {
	const {firstname, lastname, email} = request.body;
	if (!firstname || !lastname || !email) {
		return response.status(400).send({
			success: false,
			message: "Missing input/fields"
		});
	}
	return verifyUser({email}, ["email"]).then(check => {
		if (check) {
			return response.status(409).send({
				success: false,
				message: "This user already exists"
			});
		}
		const actualPassword = randomize(10);
		const password = passwordHash.hash(actualPassword, 10);
		const role = "admin";
		const claims = userPermissions(role);
		if (!claims) {
			return response.status(409).send({
				success: false,
				message: "Please add a valid role"
			});
		}

		return db
			.collection("users")
			.add({
				firstname,
				lastname,
				email,
				password,
				role,
				claims,
				updated: new Date().getTime(),
				created: new Date().getTime()
			})
			.then(docRef => {
				return response.status(201).send({
					success: true,
					message: "Admin successfully created",
					data: {
						id: docRef.id,
						firstname,
						lastname,
						email,
						role,
						claims
					}
				});
			})
			.catch(() => {
				return response.status(500).send({
					success: false,
					message: "Something went wrong"
				});
			});
	});
};

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
				return response.status(200).json({
					success: true,
					message: "Logged In",
					popup: "Welcome " + data.firstname,
					token
				});
			})
			.catch(err => {
				return response.status(500).send({
					success: false,
					message: "Something went wrong",
					error: err.message,
					errStack: err.stack
				});
			});
	});
};

module.exports = {createAdmin, login};
