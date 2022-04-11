//For handling user route

//Dependencies
const crud = require("../../lib/crud");
const { hash } = require("../../helpers/utilities");

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
  callback(200, { message: "You are visiting user url" });
};
handler._users.post = (reqObj, callback) => {
  //Destructuring POSTed form data
  const { firstName, lastName, mobileNo, password } = reqObj.body;

  const valid = {}; //Scafolding valid data

  //Validating form data
  if (
    //FIRST NAME VALIDATION
    typeof firstName === "string" &&
    firstName.trim().length > 0 &&
    firstName.trim().length < 50
  ) {
    valid.firstName = firstName;
  } else {
    valid.firstName = false;
  }
  if (
    //LAST NAME VALIDATION
    typeof lastName === "string" &&
    lastName.trim().length > 0 &&
    lastName.trim().length < 50
  ) {
    valid.lastName = lastName;
  } else {
    valid.lastName = false;
  }

  if (
    //Mobile no validatio
    typeof mobileNo === "string" &&
    mobileNo.trim().length === 11
  ) {
    valid.mobileNo = mobileNo;
  } else {
    valid.mobileNo = false;
  }
  valid.password = hash(password);
  //END of Validating form data

  //POSTing data to local storage / database (say)
  if (valid.firstName && valid.lastName && valid.mobileNo && valid.password) {
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
handler._users.put = (reqObj, callback) => {};
handler._users.delete = (reqObj, callback) => {};

module.exports = handler;
