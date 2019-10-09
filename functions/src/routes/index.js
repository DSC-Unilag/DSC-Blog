const express = require("express");
const listEndpoints = require("express-list-endpoints");
const userRoute = require("./users");
const applicationRouter = require("./applications");
const articlesRouter = require("./articles");
const categoryRouter = require("./categories");
const contributorRouter = require("./contributors");
const {configureCloudinary} = require("../helpers/cloudinary");

const routes = express();
configureCloudinary();

// Enable CORS
routes.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, Authorization"
	);
	res.header(
		"Access-Control-Request-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, Authorization"
	);
	next();
});

routes.use("/users", userRoute);
routes.use("/applications", applicationRouter);
routes.use("/articles", articlesRouter);
routes.use("/categories", categoryRouter);
routes.use("/contributors", contributorRouter);
routes.use("/endpoints", (req, res) =>
	res.status(200).json(listEndpoints(routes))
);

module.exports = routes;
