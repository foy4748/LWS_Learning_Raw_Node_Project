const https = require("https");
const querystring = require("querystring");
const { twilio } = require("../environments");
const validate = require("./validate");
const { TWILIO_ACCOUNT_SID, From, TWILIO_AUTH_TOKEN } = twilio;

notifications = {};

notifications.smsNotification = (phone, msg, callback) => {
  //Validating Phone & Message
  let validPhone = validate._mobileNo(phone);
  let validMsg = validate._userMsg(msg);

  if (validPhone && validMsg) {
    const payload = {
      Body: validMsg,
      From,
      To: `+88${validPhone}`,
    };
    const stringifiedPayload = querystring.stringify(payload);

    // Configure the request details
    var options = {
      host: "api.twilio.com",
      port: 443,
      method: "POST",
      path: `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      auth: `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    // Instantiate the request
    const req = https.request(options, (res) => {
      // grab the status of the sent request
      const status = res.statusCode;

      res.setEncoding("utf8");

      // callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false, { message: "SMS sent." });
      } else {
        callback(500, {
          error: `Status code returned was ${status}: ${res.statusMessage}`,
        });
      }
    });
    req.on("error", (err) => console.log(err));
    req.write(stringifiedPayload);
    req.end();
  } else {
    callback("Invalid Phone no or Message length exceeded");
  }
};

module.exports = notifications;
