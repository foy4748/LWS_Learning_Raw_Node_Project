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

handler._check.get = (reqObj, callback) => {
  let { token } = reqObj.headerObject;
  let { id } = reqObj.queryObject;
  token = validate._id(token);
  id = validate._id(id);
  if (token && id) {
    crud.read("token", token, (err, raw_tokenData) => {
      if (!err && raw_tokenData) {
        let tokenData = parsedJSON(raw_tokenData);
        crud.read("user", tokenData.mobileNo, (err, raw_userData) => {
          if (!err && raw_userData) {
            let userData = parsedJSON(raw_userData);
            tokenHandler.validate(token, userData.mobileNo, (tokenValidiy) => {
              if (tokenValidiy) {
                //Checking if token is valid
                //as well as associated with user
                crud.read("check", id, (err, raw_checkData) => {
                  const checkObj = parsedJSON(raw_checkData);
                  if (!err && checkObj) {
                    callback(200, checkObj);
                  } else {
                    callback(500, { message: "Check doesn't exist" });
                  }
                });
              } else {
                callback(403, {
                  message: "Token is not associated with user",
                });
              }
            });
          } else {
            callback(403, { message: "User not found" });
          }
        });
      } else {
        callback(403, { message: "Authentication failed" });
      }
    });
  } else {
    callback(403, { message: "Invalid tokens or id" });
  }
};

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
handler._check.put = (reqObj, callback) => {
  let { token } = reqObj.headerObject;
  let { protocol, url, method, successCodes, timeout, id } = reqObj.body;
  //Validating each form fields seperately
  protocol = validate._protocol(protocol);
  url = validate._url(url);
  method = validate._method(method);
  successCodes = validate._successCodes(successCodes);
  timeout = validate._timeout(timeout);
  id = validate._id(id);
  token = validate._id(token);
  //End of Validating each form fields seperately
  if (token) {
    crud.read("token", token, (err, raw_tokenData) => {
      if (!err && raw_tokenData) {
        let tokenData = parsedJSON(raw_tokenData);
        crud.read("user", tokenData.mobileNo, (err, raw_userData) => {
          if (!err && raw_userData) {
            let userData = parsedJSON(raw_userData);
            tokenHandler.validate(token, userData.mobileNo, (tokenValidiy) => {
              if (tokenValidiy) {
                crud.read("check", id, (err, checkData) => {
                  if (!err && checkData) {
                    const checkObj = parsedJSON(checkData);
                    let invalidMessage = "";

                    if (protocol) {
                      checkObj.protocol = protocol;
                    } else {
                      invalidMessage += " Protocol is invalid. ";
                    }

                    if (url) {
                      checkObj.url = url;
                    } else {
                      invalidMessage += " URL is invalid. ";
                    }

                    if (method) {
                      checkObj.method = method;
                    } else {
                      invalidMessage += " Method is invalid. ";
                    }

                    if (successCodes) {
                      checkObj.successCodes = successCodes;
                    } else {
                      invalidMessage += " SuccessCodes are invalid. ";
                    }

                    if (timeout) {
                      checkObj.timeout = timeout;
                    } else {
                      invalidMessage += " Timeout is invalid. ";
                    }

                    crud.update("check", id, checkObj, (err) => {
                      err ? callback(500) : callback(200);
                    });

                    if (invalidMessage.length < 1) {
                      callback(200, { message: "Check data has been updated" });
                    } else {
                      const message = `Check data has been updated but...  ${invalidMessage}`;
                      callback(200, {
                        message,
                      });
                    }
                  } else {
                    callback(500, {
                      message: "Check is not found or check ID is invalid",
                    });
                  }
                });
              } else {
                callback(403, {
                  message: "Token is not associated with user",
                });
              }
            });
          } else {
            callback(403, { message: "User not found" });
          }
        });
      } else {
        callback(403, { message: "Authentication failed" });
      }
    });
  } else {
    callback(403, { message: "Invalid tokens or id" });
  }
};

handler._check.delete = (reqObj, callback) => {
  let { token } = reqObj.headerObject;
  let { id } = reqObj.queryObject;
  token = validate._id(token);
  id = validate._id(id);
  if (token && id) {
    crud.read("token", token, (err, raw_tokenData) => {
      if (!err && raw_tokenData) {
        let tokenData = parsedJSON(raw_tokenData);
        crud.read("user", tokenData.mobileNo, (err, raw_userData) => {
          if (!err && raw_userData) {
            let userData = parsedJSON(raw_userData);
            tokenHandler.validate(token, userData.mobileNo, (tokenValidiy) => {
              if (tokenValidiy) {
                //Checking if token is valid
                //as well as associated with user
                crud.delete("check", id, (err) =>
                  err ? console.log(err) : false
                );
                let i = userData.checks.indexOf(id);
                if (
                  typeof userData.checks === "object" &&
                  userData.checks instanceof Array &&
                  i > -1
                ) {
                  userData.checks.splice(i, 1);
                  const newUserData = { ...userData };
                  crud.update("user", userData.mobileNo, newUserData, (err) =>
                    err ? callback(500) : callback(200)
                  );
                  callback(200, { message: "Check successfully deleted" });
                } else {
                  callback(500, {
                    message: "Check is not associated with user",
                  });
                }
              } else {
                callback(403, {
                  message: "Token is not associated with user",
                });
              }
            });
          } else {
            callback(403, { message: "User not found" });
          }
        });
      } else {
        callback(403, { message: "Authentication failed" });
      }
    });
  } else {
    callback(403, { message: "Invalid tokens or id or already deleted" });
  }
};

module.exports = handler;
