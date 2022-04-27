//Spins the Server
//as well as
//Start Worker Functions

const server = require("./lib/server");
const workers = require("./lib/workers");

const app = {};

//Wrapping Functions
app.init = () => {
  server.init();
  workers.init();
};

//Excecuting those wrapped functions
app.init();

module.exports = app;
