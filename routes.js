// Contains all the routes in this file

//Dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
//Scafolding
const routes = {
  sample: sampleHandler,
};

module.exports = routes;
