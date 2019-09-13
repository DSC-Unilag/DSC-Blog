const {Router} = require("express");
const middleware = require("../../middleware");
const getArticles = require("./getAllArticles");
const postArticle = require("./postArticle");
const publishArticle = require("./publishArticle");
const getArticlesByCategory = require("./getArticlesByCategory");

const articleRouter = Router();

const {verifyToken, permissions, fileUpload} = middleware;

articleRouter.get(
	"/",
	(req, res, next) => {
		req.published = true;
		next();
	},
	getArticles
);
articleRouter.get(
	"/unpublished",
	verifyToken,
	(req, res, next) => {
		req.published = false;
		next();
	},
	getArticles
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

articleRouter.get("/:cid", getArticlesByCategory);

module.exports = articleRouter;
