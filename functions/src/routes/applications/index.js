const { Router } = require('express');
const middleware = require('../../middleware');
const contributorApplication = require('./contributorApplication');
const getApplications = require('./getApplications');
const reviewApplication = require('./reviewApplication');
const deleteApplication = require('./deleteApplication');
const { createContributor } = require('../users/contributor');

const applicationRouter = Router();

const { verifyToken, permissions } = middleware;

applicationRouter.get(
  '/',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'applications', 'read'),
  (req, res, next) => {
    req.status = 'pending';
    next();
  },
  getApplications,
);

applicationRouter.get(
  '/reviewed',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'applications', 'read'),
  (req, res, next) => {
    req.status = 'reviewed';
    next();
  },
  getApplications,
);

applicationRouter.post('/contributor', contributorApplication);

applicationRouter.patch(
  '/',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'applications', 'update'),
  reviewApplication,
);

applicationRouter.delete(
  '/:appid',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'applications', 'delete'),
  deleteApplication,
);

applicationRouter.post(
  '/approve',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'contributors', 'create'),
  createContributor,
);

module.exports = applicationRouter;
