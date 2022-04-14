//For handling user route

//Dependencies
const crud = require("../../lib/crud");
const validate = require("../../helpers/validate");
const { parsedJSON, randomString } = require("../../helpers/utilities");

//Scafolding
const handler = {};

handler.tokenHandler = (reqObj, callback) => {
  const allowedMethods = ["get", "post", "put", "delete"];
  const indexOfMethod = allowedMethods.indexOf(reqObj.method);
  if (indexOfMethod > -1) {
    handler._token[reqObj.method](reqObj, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.get = (reqObj, callback) => {
  let { id } = reqObj.queryObject;
  //Validating token ID
  id = validate._id(id);
  if (id) {
    crud.read("token", id, (err, data) => {
      if (!err && data) {
        let data_json = parsedJSON(data);
        callback(200, data_json);
      } else {
        callback(500, { message: "Couldn't read data" });
      }
    });
  } else {
    callback(400, { message: "ID is invalid" });
  }
};
handler._token.post = (reqObj, callback) => {
  let { mobileNo, password } = reqObj.body;

  mobileNo = validate._mobileNo(mobileNo);
  password = validate._password(password); //validate._password already returns hashed password

  if (mobileNo) {
    crud.read("user", mobileNo, (err, data) => {
      if (!err && data) {
        const user = parsedJSON(data);
        if (user.password === password) {
          const id = randomString(20);
          const expires = Date.now() + 60 * 60 * 1000;

          const tokenObj = {
            id,
            expires,
            mobileNo,
          };
          crud.create("token", id, tokenObj, (err) => {
            err
              ? callback(500, { message: "Failded to create token" })
              : callback(200, { message: "Token has been created" });
          });
          callback(200, { message: "Token has been created" });
        } else {
          callback(400, { message: "Password is not matching" });
        }
      } else {
        callback(500, { message: "Couldn't read file" });
      }
    });
  } else {
    callback(400, { message: "Invalid mobileNo" });
  }
};
handler._token.put = (reqObj, callback) => {};
handler._token.delete = (reqObj, callback) => {};

module.exports = handler;
