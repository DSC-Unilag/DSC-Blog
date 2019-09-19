const express = require('express');
const cors = require('cors');
const listEndpoints = require('express-list-endpoints');
const userRoute = require('./users');
const applicationRouter = require('./applications');
const articlesRouter = require('./articles');
const categoryRouter = require('./categories');
const { configureCloudinary } = require('../helpers/cloudinary');

const routes = express();
configureCloudinary();

routes.use(cors());
routes.use('/users', userRoute);
routes.use('/applications', applicationRouter);
routes.use('/articles', articlesRouter);
routes.use('/categories', categoryRouter);

routes.use('/endpoints', (req, res) => res.status(200).json(listEndpoints(routes)));

module.exports = routes;
