const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 3000;
const filepath = path.path(__dirname, "medical_record.json");
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
});

server.listen(port, function (error) {
  if (error) {
    console.log("There is something wrong", error);
  } else {
    console.log("server started on port " + port);
  }
});
