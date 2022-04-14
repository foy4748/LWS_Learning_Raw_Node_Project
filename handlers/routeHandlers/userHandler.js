//For handling user route

//Dependencies
const crud = require("../../lib/crud");
const validate = require("../../helpers/validate");
const { parsedJSON } = require("../../helpers/utilities");

//Scafolding
const handler = {};

handler.userHandler = (reqObj, callback) => {
  const allowedMethods = ["get", "post", "put", "delete"];
  const indexOfMethod = allowedMethods.indexOf(reqObj.method);
  if (indexOfMethod > -1) {
    handler._users[reqObj.method](reqObj, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.get = (reqObj, callback) => {
  let { mobileNo } = reqObj.queryObject;
  //Validating mobileNo
  mobileNo = validate._mobileNo(mobileNo);
  if (mobileNo) {
    crud.read("user", mobileNo, (err, u) => {
      const user = { ...parsedJSON(u) };
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          message: `User is not found with mobile no ${mobileNo}`,
        });
      }
    });
  } else {
    callback(400, {
      message: "Mobile no is not valid,",
    });
  }
};
handler._users.post = (reqObj, callback) => {
  let valid = validate._user(reqObj.body);
  //POSTing data to local storage / database (say)
  if (valid) {
    valid.password = validate._password(valid.password);
    crud.read("user", valid.mobileNo, (err) => {
      if (err) {
        crud.create("user", `${valid.mobileNo}`, valid, (error) => {
          console.log("Something went wrong while creating user \n", error);
        });

        callback(500, { message: "POSTED user data on db" });
      } else {
        callback(504, { message: "User already exists" });
      }
    });
  } else {
    callback(403, { message: "Invalid form data has been submitted" });
  }
};
handler._users.put = (reqObj, callback) => {
  //Validating User submitted form data
  const validUser = validate._user(reqObj.body);

  if (validUser) {
    crud.read("user", validUser.mobileNo, (err, userData) => {
      if (!err && userData) {
        crud.update("user", validUser.mobileNo, validUser, (err2) => {
          console.log("Something went wrong while updateing file", err2);
        });
        callback(200, { message: "Updated user successfully" });
      } else {
        callback(500, { message: "Read operation failed" });
      }
    });
  } else {
    callback(400, { message: "Submitted form is not valid" });
  }
};
handler._users.delete = (reqObj, callback) => {
  let { mobileNo } = reqObj.queryObject;
  //Validating mobile no
  mobileNo = validate._mobileNo(mobileNo);
  if (mobileNo) {
    crud.read("user", mobileNo, (err, data) => {
      if (!err && data) {
        crud.delete("user", mobileNo, (err) => console.log(err));
        callback(200, { message: "Deleted user successfully" });
      } else {
        callback(500, {
          message: `User doesn't exist with mobile no ${mobileNo}`,
        });
      }
    });
  } else {
    callback(400, { message: "Mobile no is not valid" });
  }
};

module.exports = handler;
