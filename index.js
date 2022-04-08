const http = require("http");
const { reqResHandler } = require("./helpers/reqRes");
//Scafolding the app
const app = {};

//Configurations
app.config = {
  port: 3001,
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
