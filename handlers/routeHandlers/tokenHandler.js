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
handler._token.put = (reqObj, callback) => {
  let { id, extend } = reqObj.body;
  id = validate._id(id);
  extend = typeof extend === "boolean" && extend === true ? true : false;
  if (id && extend) {
    crud.read("token", id, (err, data) => {
      if (!err && data) {
        let update_token_form = parsedJSON(data);
        if (update_token_form.expires > Date.now()) {
          update_token_form.expires = Date.now() + 60 * 60 * 1000;
          crud.update("token", id, update_token_form, (err) => {
            if (!err) {
              callback(200, { message: "Updated Token" });
            } else {
              callback(500, { message: "Token update has been failed" });
            }
          });
          callback(200, { message: "Updated Token" });
        } else {
          callback(500, { message: "Token has been expired" });
        }
      } else {
        callback(500, { message: "Token is not found at db" });
      }
    });
  } else {
    callback(400, { message: "Token is not valid" });
  }
};
handler._token.delete = (reqObj, callback) => {
  let { id } = reqObj.queryObject;
  id = validate._id(id);
  if (id) {
    crud.read("token", id, (err, data) => {
      if (!err && data) {
        crud.delete("token", id);
        callback(200, { message: "Token has been deleted" });
      } else {
        callback(500, { message: "Token wasn't found in db" });
      }
    });
  } else {
    callback(400, { message: "Invalid Token" });
  }
};

handler.validate = (tokenId, mobNo, callback) => {
  let id = validate._id(tokenId);
  let mobileNo = validate._mobileNo(mobNo);
  if (id && mobileNo) {
    crud.read("token", id, (err, data) => {
      if (!err && data) {
        const tokenData = parsedJSON(data);
        if (tokenData.mobileNo === mobileNo && tokenData.expires > Date.now()) {
          callback(true);
        } else {
          console.log("Token id is not associated with user");
          callback(false);
        }
      } else {
        console.log("Token not found in db");
        callback(false);
      }
    });
  } else {
    console.log("Token Id or mobileNo is invalid");
    callback(false);
  }
};

module.exports = handler;
