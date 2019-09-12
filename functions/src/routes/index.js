const express = require('express');
const userRoute = require('./users');
const applicationRoute = require('./applications');
const articlesRouter = require('./articles');

const routes = express();

routes.use('/users', userRoute);
routes.use('/applications', applicationRoute);
routes.use('/articles', articlesRouter);

module.exports = routes;
