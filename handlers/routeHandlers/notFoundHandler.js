//For handling not found route

//Scafolding
const handler = {};

handler.notFoundHandler = (reqObj, callback) => {
  console.log(reqObj);
  callback(404, { message: `${reqObj.trimmedPath} is not found` });
};

module.exports = handler;
