const crypto = require("crypto");
const env = require("../environments");
utilities = {};

//For Validating JSON obj if Stringed JSON received
utilities.parsedJSON = (stringJSON) => {
  let catchedJSON;
  try {
    catchedJSON = JSON.parse(stringJSON);
  } catch {
    catchedJSON = {};
  }
  return catchedJSON;
};

//Hashing any strings
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const HASH = crypto
      .createHmac("sha256", env.secretKey)
      .update(str)
      .digest("hex");

    return HASH;
  } else {
    return false;
  }
};

module.exports = utilities;
