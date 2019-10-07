const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = (request, response, next) => {
	let token =
		request.headers.authorization ||
		request.headers["x-access-token"] ||
		request.query.token ||
		request.body.token;

	if (!token) {
		return response.status(401).send({
			success: false,
			message: "You did not provide a token"
		});
	} else {
		token = token.split(" ")[1];
	}

	return jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
		if (err) {
			return response.status(401).send({
				success: false,
				message: "Your token is invalid or expired"
			});
		}

		request.payload = payload;
		return next();
	});
};

module.exports = verifyToken;
