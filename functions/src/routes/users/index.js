const { Router } = require('express');
const { createAdmin } = require('./admin');
const { login, refreshJwtToken, modifyPassword } = require('./auth');
const middleware = require('../../middleware');

const userRouter = Router();

const { verifyToken, permissions } = middleware;

userRouter.post(
  '/createAdmin',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'admin', 'create'),
  createAdmin,
);

userRouter.post('/auth/login', login);

userRouter.post('/auth/refresh_token', refreshJwtToken);

userRouter.post('/auth/password', modifyPassword);

module.exports = userRouter;
