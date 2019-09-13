const express = require('express');
const userRoute = require('./users');
const applicationRouter = require('./applications');
const articlesRouter = require('./articles');
const categoryRouter = require('./categories');
const { configureCloudinary } = require('../helpers/cloudinary');

const routes = express();
configureCloudinary();

routes.use('/users', userRoute);
routes.use('/applications', applicationRouter);
routes.use('/articles', articlesRouter);
routes.use('/categories', categoryRouter);

module.exports = routes;
