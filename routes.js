// Contains all the routes in this file

//Dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
//Scafolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
