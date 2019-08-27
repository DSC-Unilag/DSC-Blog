const express = require('express');
const userRoute = require('./users');

const routes = express();

routes.use('/users', userRoute);

module.exports = routes;
