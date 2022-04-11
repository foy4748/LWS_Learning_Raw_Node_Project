//Scafolding
const environment = {};

environment.development = {
  port: 3001,
  envName: "development",
  secretKey: "fart in a jar MarTin",
};

environment.production = {
  port: 5001,
  envName: "production",
  secretKey: "be furious farter",
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
