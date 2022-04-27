const http = require("http");
const { reqResHandler } = require("../helpers/reqRes");
const environment = require("../environments");

//Scafolding the server
const server = {};

//Configurations
server.config = {
  port: environment.port,
};

//*****Defining functions *****

//*****Creating the server
server.createServer = () => {
  const createdServer = http.createServer(server.reqResHandle);
  const PORT = server.config.port;
  createdServer.listen(PORT, () =>
    console.log(`Server is listening to port ${PORT}`)
  );
};

//*****Handling Requests and Responses
server.reqResHandle = reqResHandler;

//*****Invoking functions *****
server.init = () => {
  server.createServer();
};

module.exports = server;
