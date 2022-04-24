//For handling check route

//Dependencies
const crud = require("../../lib/crud");
const validate = require("../../helpers/validate");
const { parsedJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

//Scafolding
const handler = {};

handler.checkHandler = (reqObj, callback) => {
  const allowedMethods = ["get", "post", "put", "delete"];
  const indexOfMethod = allowedMethods.indexOf(reqObj.method);
  if (indexOfMethod > -1) {
    handler._check[reqObj.method](reqObj, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

handler._check.get = (reqObj, callback) => {};
handler._check.post = (reqObj, callback) => {
  const validCheck = validate._check(reqObj.body);
  if (validCheck) {
    let { token } = reqObj.headerObject;
    token = validate._id(token);
    if (token) {
      crud.read("token", token, (err, raw_tokenData) => {
        if (!err && raw_tokenData) {
          let tokenData = parsedJSON(raw_tokenData);
          crud.read("user", tokenData.mobileNo, (err, raw_userData) => {
            if (!err && raw_userData) {
              let userData = parsedJSON(raw_userData);
              tokenHandler.validate(
                token,
                userData.mobileNo,
                (tokenValidiy) => {
                  if (tokenValidiy) {
                    //Token is valid according to db
                    //As well as associated with user.
                    const checkId = utilities.randomString(20);
                    //Creating check object
                    const checkObj = { ...validCheck, id: checkId };

                    //Updatng user object
                    let checks = userData.checks ? userData.checks : [];
                    if (checks instanceof Array && checks.length < 5) {
                      crud.create("check", checkId, checkObj, (err) => {
                        err ? callback(500) : callback(200);
                      });
                      checks.push(checkId);
                      const userWithCheck = { ...userData, checks };
                      crud.update(
                        "user",
                        userData.mobileNo,
                        userWithCheck,
                        (err) => {
                          err ? callback(500) : callback(200);
                        }
                      );
                      callback(200, {
                        message: "Successfully added check to user",
                      });
                    } else {
                      callback(403, {
                        message: "Maximum limit of checks exceeded",
                      });
                    }
                  } else {
                    callback(403, {
                      message: "Token is not associated with user",
                    });
                  }
                }
              );
            } else {
              callback(403, { message: "User not found" });
            }
          });
        } else {
          callback(403, { message: "Authentication failed" });
        }
      });
    } else {
      callback(403, { message: "Authentication failed" });
    }
  } else {
    callback(400, { message: "There is a problem in your request" });
  }
};
handler._check.put = (reqObj, callback) => {};
handler._check.delete = (reqObj, callback) => {};

module.exports = handler;
