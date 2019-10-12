const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const {config} = require("dotenv");

config();
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	"https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

const smtpConfig = {
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.GMAIL_EMAIL,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN,
		accessToken: accessToken
	}
};

const smtpTransport = nodemailer.createTransport(smtpConfig);

const sendMail = ({to, subject, html}) => {
	const mailOptions = {
		from: process.env.GMAIL_EMAIL,
		to,
		subject,
		html
	};
	return new Promise((resolve, reject) => {
		smtpTransport.sendMail(mailOptions, (error, response) => {
			if (error) {
				reject(error);
			} else {
				resolve(response);
			}
		});
	});
};

module.exports = {sendMail};
