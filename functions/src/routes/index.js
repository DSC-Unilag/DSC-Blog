const express = require('express');
const userRoute = require('./users');
const applicationRoute = require('./applications');

const routes = express();

routes.use('/users', userRoute);
routes.use('/applications', applicationRoute);

module.exports = routes;
