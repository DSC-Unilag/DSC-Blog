const { Router } = require('express');
const createAdmin = require('./admin');
const middleware = require('../../middleware');

const userRoute = Router();

const { verifyToken, permissions } = middleware;

userRoute.post(
  '/createAdmin',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'admin', 'create'),
  createAdmin
);

module.exports = userRoute;
