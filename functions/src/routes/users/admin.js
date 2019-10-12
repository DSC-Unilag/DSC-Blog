/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");
const randomize = require("../../helpers/randomize");
const passwordHash = require("../../helpers/passwordHash");
const verifyUser = require("../../helpers/verifyUser");
const userPermissions = require("../../helpers/userPermissions");
const {sendMail} = require("../../helpers/mail");

const db = admin.firestore();

const createAdmin = (request, response) => {
	const {firstname, lastname, email} = request.body;
	if (!firstname || !lastname || !email) {
		return response.status(400).send({
			success: false,
			message: "Missing input/fields"
		});
	}
	let actualPassword;
	return verifyUser({email}, ["email"]).then(check => {
		if (check) {
			return response.status(409).send({
				success: false,
				message: "This user already exists"
			});
		}
		actualPassword = randomize(10);
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
			.then(() => {
				return sendMail({
					to: email,
					subject: "Congratulations Admin!",
					html: `<p>You have been selected to be an administrator on DSC Unilag Blog</p>
                <p>These are your login details</p>
                <p>Email: ${email}</p>
                <p>Password: ${actualPassword}</p>`
				});
			})
			.then(() => {
				return response.status(201).send({
					success: true,
					message: "Admin successfully created",
					data: {
						firstname,
						lastname,
						email,
						role,
						claims
					}
				});
			})
			.catch(() =>
				response.status(500).send({
					success: false,
					message: "Something went wrong"
				})
			);
	});
};

module.exports = {createAdmin};
