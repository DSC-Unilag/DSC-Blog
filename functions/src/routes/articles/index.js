const {Router} = require("express");
const middleware = require("../../middleware");
const getAllArticles = require("./getAllArticles");
const getAllCategories = require("./getAllCategories");
const postArticle = require("./postArticle");
const publishArticle = require("./publishArticle");

const articleRouter = Router();

const {verifyToken, permissions} = middleware;

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
articleRouter.get("/categories", getAllCategories);
articleRouter.post(
	"/",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "articles", "create"),
	postArticle
);

articleRouter.patch(
	"/publish",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "articles", "update"),
	publishArticle
);

module.exports = articleRouter;
