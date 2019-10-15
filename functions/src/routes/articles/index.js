const { Router } = require('express');
const middleware = require('../../middleware');
const getArticles = require('./getArticles');
const postArticle = require('./postArticle');
const publishArticle = require('./publishArticle');
const getArticle = require('./getArticle');
const deleteArticle = require('./deleteArticle');
const editArticle = require('./editArticle');
// const {upload} = require("../../helpers/firebaseUpload");

const articleRouter = Router();

const { verifyToken, permissions, gcFileActions } = middleware;

articleRouter.get(
  '/',
  (req, res, next) => {
    req.type = 'all';
    req.published = true;
    next();
  },
  getArticles,
);
articleRouter.get(
  '/unpublished',
  verifyToken,
  (req, res, next) => {
    req.type = 'all';
    req.published = false;
    next();
  },
  getArticles,
);

articleRouter.get('/:id', getArticle);

articleRouter.get(
  '/category/:cid',
  (req, res, next) => {
    req.type = 'category';
    next();
  },
  getArticles,
);

articleRouter.get(
  '/user/:uid',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'articles', 'read'),
  (req, res, next) => {
    req.type = 'user';
    next();
  },
  getArticles,
);

articleRouter.post(
  '/',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'articles', 'create'),
  gcFileActions.fileUpload,
  postArticle,
);

articleRouter.patch(
  '/publish',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'articles', 'update'),
  publishArticle,
);

articleRouter.delete(
  '/:aid',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'articles', 'delete'),
  deleteArticle,
);

articleRouter.put(
  '/edit/:id',
  verifyToken,
  (req, res, next) => permissions(req, res, next, 'articles', 'update'),
  gcFileActions.fileUpload,
  editArticle,
);

module.exports = articleRouter;
