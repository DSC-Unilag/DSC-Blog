const cloudinary = require('cloudinary').v2;

const cloudinaryUpload = imagePath => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(imagePath, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

const configureCloudinary = () => {
	const {CLOUDINARY_URL} = process.env;
	const cloud_name = CLOUDINARY_URL.split("@")[1];
	const api_key = CLOUDINARY_URL.slice(13, CLOUDINARY_URL.length).split(":")[0];
	const api_secret = CLOUDINARY_URL.slice(13, CLOUDINARY_URL.length)
		.split(":")[1]
		.split("@")[0];
	return cloudinary.config({
		cloud_name,
		api_key,
		api_secret
	});
};

module.exports = {cloudinaryUpload, configureCloudinary};
