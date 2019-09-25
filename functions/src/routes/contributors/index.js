const {Router} = require("express");
const middleware = require("../../middleware");
const getContributors = require("./getContributors");
const deleteContributor = require("./deleteContributors");

const contributorRouter = Router();

const {verifyToken, permissions} = middleware;

contributorRouter.get(
	"/",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "contributors", "read"),
	getContributors
);

contributorRouter.delete(
	"/:cid",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "contributors", "delete"),
	deleteContributor
);

module.exports = contributorRouter;
