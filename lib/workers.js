const url = require("url");
const http = require("http");
const https = require("https");
const crud = require("./crud");
const { smsNotification } = require("../helpers/notifications");
const { parsedJSON } = require("../helpers/utilities");

//Scafolding the workers
const workers = {};

workers.changeState = (afterCheckState, checkData) => {
  const { error, body, statusCode } = afterCheckState;
  const newState =
    !error && !body && checkData.successCodes.indexOf(`${statusCode}`) > -1
      ? "up"
      : "down";
  const newLastStateCheck = Date.now();
  if (checkData.lastStateCheck && checkData.state != newState) {
    const newCheckData = checkData;
    newCheckData.state = newState;
    newCheckData.lastStateCheck = newLastStateCheck;
    crud.update("check", newCheckData.id, newCheckData, (err) => {
      if (err) {
        console.log("Coundn't update state of checkdata", err);
      } else {
        const msg = `Your ${newCheckData.method.toUpperCase()} method for ${
          newCheckData.url
        } is now ${newCheckData.state.toUpperCase()}`;
        smsNotification(newCheckData.mobileNo, msg, (err, errMsg) =>
          err
            ? console.log(err, "\n", errMsg)
            : console.log("SMS has been sent!")
        );
      }
    });
  } else {
    console.log("State Remained UNCHANGED. No SMS alert requires");
  }
};

workers.performCheck = (checkData) => {
  let afterCheckState = {
    //Initializing Outcome state
    error: false,
    body: false,
    status: false,
  };
  let outcomefound = false;

  //Destructuring checkObj
  let { protocol, method, timeout } = checkData;
  let checkDataUrl = checkData.url;
  const URL = url.parse(`${protocol}://${checkDataUrl}/`, true);
  const hostname = URL.hostname;
  const { path } = URL;
  //Configering Request Details
  const requestDetail = {
    protocol: `${protocol}:`,
    hostname,
    method: method.toUpperCase(),
    path,
    timeout: timeout * 1000,
  };

  const protocolToUse = protocol === "http" ? http : https;
  const req = protocolToUse.request(requestDetail, (res) => {
    let statusCode = res.statusCode;
    if (!outcomefound) {
      afterCheckState.statusCode = statusCode;
      outcomefound = true;
      workers.changeState(afterCheckState, checkData);
    }
  });
  req.on("error", (e) => {
    if (!outcomefound) {
      afterCheckState.error = true;
      afterCheckState.body = e;
      outcomefound = true;
      workers.changeState(afterCheckState, checkData);
    }
  });
  req.on("timeout", () => {
    if (!outcomefound) {
      afterCheckState.error = true;
      afterCheckState.body = "Timeout";
      outcomefound = true;
      workers.changeState(afterCheckState, checkData);
    }
  });

  //FORGOT to do this
  req.end();
};

workers.gatherAllChecks = () => {
  crud.readDir("check", (err, files) => {
    if (!err && files && files.length >= 1) {
      //File names without extensions
      files.forEach((file) => {
        crud.read("check", file, (err, raw_checkData) => {
          if (!err && raw_checkData) {
            let checkObj = parsedJSON(raw_checkData);
            //State & Last State Check
            //as well as initializing State & Last State Check
            checkObj.state =
              typeof checkObj.state === "string" &&
              ["up", "down"].indexOf(checkObj.state) > -1
                ? checkObj.state
                : "down";
            checkObj.lastStateCheck =
              typeof checkObj.lastStateCheck === "number" &&
              checkObj.lastStateCheck > 0
                ? checkObj.lastStateCheck
                : false;
            workers.performCheck(checkObj);
          } else {
            console.log("There was a problem with check data. \n", err);
          }
        });
      });
    } else {
      console.log("Couldn't read directory, No CHECKS found");
    }
  });
};
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, 8000);
};

//*****Invoking functions *****
workers.init = () => {
  workers.gatherAllChecks();

  workers.loop();
};

module.exports = workers;
