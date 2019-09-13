const cloudinary = require('cloudinary').v2;

const cloudinaryUpload = (imagePath) => new Promise((resolve, reject) => {
  cloudinary.uploader.upload(imagePath, (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});

const configureCloudinary = () => {
  const { CLOUDINARY_URL } = process.env;
  const cloudName = CLOUDINARY_URL.split('@')[1];
  const apiKey = CLOUDINARY_URL.slice(13, CLOUDINARY_URL.length).split(':')[0];
  const apiSecret = CLOUDINARY_URL.slice(13, CLOUDINARY_URL.length)
    .split(':')[1]
    .split('@')[0];
  return cloudinary.config({
    cloudName,
    apiKey,
    apiSecret,
  });
};

module.exports = { cloudinaryUpload, configureCloudinary };
