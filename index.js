const http = require("http");
const { reqResHandler } = require("./helpers/reqRes");
const environment = require("./environments");
//TEST

const crud = require("./lib/crud");

crud.delete("test", "storage", (error) => console.log(error));

//END of TEST

//Scafolding the app
const app = {};

//Configurations
app.config = {
  port: environment.port,
};

//*****Defining functions *****

//*****Creating the server
app.createServer = () => {
  const server = http.createServer(app.reqResHandle);
  const PORT = app.config.port;
  server.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
};

//*****Handling Requests and Responses
app.reqResHandle = reqResHandler;

//*****Invoking functions *****
app.createServer();
