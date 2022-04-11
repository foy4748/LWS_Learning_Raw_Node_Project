//Handles requests and responses

//Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

const { parsedJSON } = require("./utilities");

//Scafolding
const reqRes = {};

reqRes.reqResHandler = (req, res) => {
  //Handling Requests
  const parsedUrl = url.parse(req.url, true);
  const trimmedPath = parsedUrl.path.replace(/^\/+|\/+$/g, "");
  const queryObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headerObject = req.headers;

  //Request object
  let requestObject = {
    parsedUrl,
    trimmedPath,
    queryObject,
    method,
    headerObject,
  };

  //Chosen Handler
  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  //Parsing data from request
  const decoder = new StringDecoder("utf8");
  let container = "";
  req.on("data", (buffer) => {
    container += decoder.write(buffer);
  });

  req.on("end", () => {
    container += decoder.end();
    requestObject.body = parsedJSON(container);
    //Executing Chosen Handler as a callback in the end of req event!! Very IMPORTANT
    chosenHandler(requestObject, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      //Returing final response

      //Part of Raw Node Project 3
      //It's really important to let the client know that
      //the server is sending json data when constructing
      //REST API
      res.setHeader("Content-Type", "application/json");
      /////////////////////////
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = reqRes;
