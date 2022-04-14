const { hash } = require("./utilities");

validate = {};

validate._firstName = (raw_firstName) => {
  let firstName = raw_firstName;
  if (
    //FIRST NAME VALIDATION
    typeof firstName === "string" &&
    firstName.trim().length > 0 &&
    firstName.trim().length < 50
  ) {
    return firstName;
  } else {
  }
  return false;
};

validate._lastName = (raw_lastName) => {
  let lastName = raw_lastName;
  if (
    //LAST NAME VALIDATION
    typeof lastName === "string" &&
    lastName.trim().length > 0 &&
    lastName.trim().length < 50
  ) {
    return lastName;
  } else {
    lastName = false;
  }
};

validate._mobileNo = (raw_mobileNo) => {
  let mobileNo = raw_mobileNo;
  if (
    //Mobile no tio
    typeof mobileNo === "string" &&
    mobileNo.trim().length === 11
  ) {
    return mobileNo;
  } else {
    return false;
  }
};
validate._password = (pass) => {
  let password = pass;
  if (password.length > 0 && password.length < 51) {
    return hash(password);
  } else {
    return false;
  }
};

validate._user = (reqBodyObj) => {
  const { firstName, lastName, mobileNo, password } = reqBodyObj;
  if (
    validate._firstName(firstName) &&
    validate._lastName(lastName) &&
    validate._mobileNo(mobileNo) &&
    validate._password(password)
  ) {
    valid = { firstName, lastName, mobileNo, password };
    return valid;
  }

  return false;
};
//END of Validating form data

module.exports = validate;
