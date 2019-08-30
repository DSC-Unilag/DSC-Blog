const { Router } = require('express');
const contributorApplication = require('./contributorApplication');

const applicationRoute = Router();

applicationRoute.post(
  '/contributor',
  contributorApplication
);

module.exports = applicationRoute;
