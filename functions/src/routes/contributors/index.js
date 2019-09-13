const {Router} = require("express");
const middleware = require("../../middleware");
const getContributors = require("./getContributors");

const contributorRouter = Router();

const {verifyToken, permissions} = middleware;

contributorRouter.get(
	"/",
	verifyToken,
	(req, res, next) => permissions(req, res, next, "contributors", "read"),
	getContributors
);


module.exports = contributorRouter;
