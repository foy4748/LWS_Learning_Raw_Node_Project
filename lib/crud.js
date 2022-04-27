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
            callback(false); //Added this  later :/
          } else {
            callback("Error writing file");
          }
        });
      } else {
        console.log(`Couldn't create ${file + ".json"}. It may exist`);
        callback("Error writing file");
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
                callback(false); //Added this later :/. Says that error is false
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
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + "/" + dir + "/" + file + ".json"}`, (error) =>
    error ? callback(error) : callback(false)
  );
};

//FOR READ DIRECTORY OPERATION
lib.readDir = (dir, callback) => {
  const absPath = `${lib.basedir + "/" + dir + "/"}`; //Absolute PATH
  fs.readdir(absPath, (err, files) => {
    if (!err && files && files.length > 0) {
      const trimmedFileNames = [];
      files.forEach((file) => {
        let trimmedFileName = file.replace(".json", "");
        if (trimmedFileName.length == 20) {
          trimmedFileNames.push(trimmedFileName);
        }
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err);
    }
  });
};
module.exports = lib;
