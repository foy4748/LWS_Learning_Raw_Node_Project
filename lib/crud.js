const fs = require("fs");
const path = require("path");

const lib = {};

lib.basedir = path.join(__dirname, "/../.data");

//FOR CREATE OPERATION
lib.create = (dir, file, data, callback) => {
  fs.open(
    lib.basedir + "/" + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor);
          } else {
            callback("Error writing file");
          }
        });
      } else {
        console.log(`Couldn't create ${file + ".json"}. It may exist`);
      }
    }
  );
};

//FOR READ OPERATION
lib.read = (dir, file, callback) => {
  fs.readFile(
    `${lib.basedir + "/" + dir + "/" + file + ".json"}`,
    "utf8",
    (error, data) => {
      callback(error, data);
    }
  );
};

//FOR UPDATE OPERATION
lib.update = (dir, file, data, callback) => {
  fs.open(
    `${lib.basedir + "/" + dir + "/" + file + ".json"}`,
    "r+",
    (error, fileDescriptor) => {
      if (!error && fileDescriptor) {
        const stringData = JSON.stringify(data);
        fs.ftruncate(fileDescriptor, (err) => {
          if (err) {
            console.log("Coundn't truncate! \n", err);
            callback(err);
          } else {
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (err) {
                console.log("Coundn't update file!! \n", err);
                callback(err);
              } else {
                fs.close(fileDescriptor);
              }
            });
          }
        });
      } else {
        callback(error);
      }
    }
  );
};

//FOR DELETE OPERATION
lib.delete = (dir, file) => {
  fs.unlink(`${lib.basedir + "/" + dir + "/" + file + ".json"}`, (error) =>
    error ? console.log(error) : null
  );
};

module.exports = lib;
