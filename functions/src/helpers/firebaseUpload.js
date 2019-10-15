const firebase = require('firebase/app');

const storageRef = firebase.storage().ref();

const upload = (file, filename) => {
  const imageRef = storageRef.child(filename);
  return imageRef.put(file);
};


module.exports = { upload };
