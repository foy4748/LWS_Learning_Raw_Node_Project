//Scafolding
const environment = {};

environment.development = {
  port: 3001,
  envName: "development",
  secretKey: "fart in a jar MarTin",
  //Add Twilio credentials
  twilio: {
    //Used TEST Credentials
    TWILIO_ACCOUNT_SID: "",
    TWILIO_AUTH_TOKEN: "",
    From: "+15005550006",
    To: "+15005550009", //To test failure case
  },
};

environment.production = {
  port: 5001,
  envName: "production",
  secretKey: "be furious farter",
  //Add Twilio credentials
  twilio: {
    //Used PRODUCTION Credentials
    TWILIO_ACCOUNT_SID: "",
    TWILIO_AUTH_TOKEN: "",
    From: "+15005550006",
    To: "+15005550009", //To test failure case
  },
};

//Checking Environment

const currentEnv =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV
    : "development";

const envToExport =
  typeof environment[currentEnv] === "object"
    ? environment[currentEnv]
    : environment["development"];

module.exports = envToExport;
