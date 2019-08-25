const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const config = require('./config/config.json');

const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.databaseURL
});

firebase.initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  databaseURL: config.databaseURL,
  storageBucket: config.storageBucket
});

module.exports.welcome = functions.https.onRequest((request, response) => {
  return response.status(200).send({
    success: true,
    message: 'Welcome to DSC Blog Firebase Functions'
  })
});
