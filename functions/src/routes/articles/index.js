const {Router} = require("express");
const middleware = require("../../middleware");
const getAllArticles = require("./getAllArticles");
const postArticle = require("./postArticle");
const publishArticle = require("./publishArticle");

const articleRouter = Router();

const {verifyToken, permissions, fileUpload} = middleware;

articleRouter.get(
	"/",
	(req, res, next) => {
		req.published = true;
		next();
	},
	getAllArticles
);
articleRouter.get(
	"/unpublished",
	verifyToken,
	(req, res, next) => {
		req.published = false;
		next();
	},
	getAllArticles
);
articleRouter.post(
	"/",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "articles", "create"),
	fileUpload,
	postArticle
);

articleRouter.patch(
	"/publish",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "articles", "update"),
	publishArticle
);

module.exports = articleRouter;
