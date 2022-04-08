//For handling sample route

//Scafolding
const handler = {};

handler.sampleHandler = (reqObj, callback) => {
  console.log(reqObj);
  callback(200, { message: "You are visiting sample url" });
};

module.exports = handler;
