const { Router } = require('express');
const middleware = require('../../middleware');
const getAllCategories = require('./getAllCategories');
const addCategory = require('./addCategory');

const categoryRouter = Router();

const { verifyToken, permissions } = middleware;

categoryRouter.get('/', getAllCategories);

categoryRouter.post(
  '/',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'categories', 'create'),
  addCategory,
);

module.exports = categoryRouter;
