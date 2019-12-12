/* eslint-disable promise/no-nesting */
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const randomize = require('../../helpers/randomize');
const passwordHash = require('../../helpers/passwordHash');
const userPermissions = require('../../helpers/userPermissions');
const { sendMail } = require('../../helpers/mail');

dotenv.config();
const db = admin.firestore();

const createContributor = (request, response) => {
  const { conid } = request.body;
  if (!conid) {
    return response.status(400).send({
      success: false,
      message: 'Missing input/fields',
    });
  }
  const appRef = db.collection('applications').doc(conid);
  return appRef
    .get()
    .then((docRef) => {
      const applicantData = docRef.data();
      if (applicantData.status !== 'reviewed') {
        return response.status(412).send({
          success: false,
          message: 'Review Application before approval',
        });
      }
      const passwordToken = randomize(20);
      const password = passwordHash.hash(randomize(10), 10);
      const role = 'contributor';
      const claims = userPermissions(role);
      if (!claims) {
        return response.status(409).send({
          success: false,
          message: 'Please add a valid role',
        });
      }

      return db
        .collection('users')
        .add({
          firstname: applicantData.firstname,
          lastname: applicantData.lastname,
          email: applicantData.email,
          password,
          role,
          claims,
          passwordToken,
          updated: new Date().getTime(),
          created: new Date().getTime(),
        })
        .then(() => {
          sendMail({
            to: applicantData.email,
            subject: 'Application Approved',
            html: `<p>Your application to write for DSC Blog has been approved</p>
                  <p>Go to this link to set your password: ${process.env.APP_URL}change_password.html?token=${passwordToken}&email=${applicantData.email} </p>`,
          });
        })
        .then(() => appRef.delete())
        .then(() => response.status(201).send({
          success: true,
          message: 'Contributor successfully created',
          data: {
            firstname: applicantData.firstname,
            lastname: applicantData.lastname,
            email: applicantData.email,
            role,
          },
        }));
    })
    .catch((err) => response.status(500).send({
      success: false,
      message: 'Something went wrong',
      errM: err.message,
      errS: err.stack,
      err,
    }));
};

module.exports = { createContributor };
