//For handling sample route

//Scafolding
const handler = {};

handler.sampleHandler = (reqObj, callback) => {
  callback(200, { message: "You are visiting sample url" });
};

module.exports = handler;
