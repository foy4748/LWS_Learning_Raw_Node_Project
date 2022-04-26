const { hash } = require("./utilities");

validate = {};

//Create User Form Validation --------------------
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
    //Mobile no validation
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
  if (
    //Password validation
    password.length > 0 &&
    password.length < 51
  ) {
    return hash(password);
  } else {
    return false;
  }
};

validate._user = (reqBodyObj) => {
  const { firstName, lastName, mobileNo, password } = reqBodyObj;
  if (
    //Validating the whole submitted Create User form
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
//END of Validating User form data --------------------

//Validating token ID
validate._id = (raw_id) => {
  let id = raw_id;
  if (typeof id === "string" && id.length === 20) {
    return id;
  } else {
    return false;
  }
};

//Validating CHECK links --------------------
validate._protocol = (raw_protocol) => {
  let protocol = raw_protocol;
  if (
    //Validating Protocol
    typeof protocol === "string" &&
    ["http", "https", "ftp", "sftp", "ssh"].indexOf(
      protocol.trim().toLowerCase()
    ) > -1
  ) {
    return protocol;
  } else {
    return false;
  }
};

validate._url = (raw_url) => {
  let url = raw_url;
  if (
    //Validating URL
    typeof url === "string" &&
    url.trim().length > 0
  ) {
    return url;
  } else {
    return false;
  }
};

validate._method = (raw_method) => {
  let method = raw_method;
  if (
    //Validating METHOD
    typeof method === "string" &&
    ["get", "post", "put", "delete"].indexOf(method.trim().toLowerCase()) > -1
  ) {
    return method;
  } else {
    return false;
  }
};

validate._successCodes = (raw_successCodes) => {
  let successCodes = raw_successCodes;
  if (
    //Validating Array of Success Codes
    typeof successCodes === "object" &&
    successCodes instanceof Array
  ) {
    return successCodes;
  } else {
    return false;
  }
};

validate._timeout = (raw_timeout) => {
  let timeout = raw_timeout;
  if (
    //Validating Timeout Seconds
    typeof timeout === "number" &&
    timeout % 1 === 0 &&
    timeout >= 1 &&
    timeout <= 5
  ) {
    return timeout;
  } else {
    return false;
  }
};

validate._check = (raw_reqObjBody) => {
  let reqBodyObj = raw_reqObjBody;
  let { protocol, url, method, successCodes, timeout } = reqBodyObj;
  if (
    //Validating whole CHECK submitted form
    validate._protocol(protocol) &&
    validate._url(url) &&
    validate._method &&
    validate._successCodes(successCodes) &&
    validate._timeout(timeout)
  ) {
    const valid = { protocol, url, method, successCodes, timeout };
    return valid;
  } else {
    return false;
  }
};
//END of Validating CHECK links --------------------

validate._userMsg = (raw_msg) => {
  let msg = raw_msg;
  msg =
    typeof msg === "string" && msg.trim().length < 1600 ? msg.trim() : false;
  return msg;
};

module.exports = validate;
