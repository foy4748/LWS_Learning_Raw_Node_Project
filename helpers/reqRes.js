//Handles requests and responses

//Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

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
  const requestObject = {
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

  //Executing Chosen Handler
  chosenHandler(requestObject, (statusCode, payload) => {
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    payload = typeof payload === "object" ? payload : {};

    const payloadString = JSON.stringify(payload);

    //Returing final response
    res.writeHead(statusCode);
    res.end(payloadString);
  });
};

module.exports = reqRes;

/*


  const decoder = new StringDecoder("utf8");
  let container = "";

  //////////////////////////////////////////////////////////
  req.on("data", (buffer) => {
    container += decoder.write(buffer);
  });

  req.on("end", () => {
    container += decoder.end();
    console.log(container);
  });

  res.end("Hello Devs"); //Handling Responses
*/
