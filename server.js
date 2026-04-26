const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 3000;
const filePath = path.join(__dirname, "medical_record.json");
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { method, url } = req;

  if (url === "/medical" && method === "GET") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: "Could not read data" }));
      }
      res.writeHead(200);
      res.end(data);
    });
  } else if (url.startsWith("/medical/") && method === "GET") {
    const id = url.split("/")[2];

    fs.readFile(filePath, "utf8", (err, data) => {
      const records = JSON.parse(data || "[]");
      const record = records.find((r) => r.id === id);

      if (!record) {
        res.writeHead(404);
        return res.end(JSON.stringify({ error: "Record not found" }));
      }

      res.writeHead(200);
      res.end(JSON.stringify(record));
    });
  } else if (url === "/medical" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const newRecord = JSON.parse(body);

      fs.readFile(filePath, "utf8", (err, data) => {
        const record = JSON.parse(data || "[]");
        newRecord.id = Date.now().toString();
        record.push(newRecord);

        fs.writeFile(filePath, JSON.stringify(record, null, 2), (err) => {
          res.writeHead(201);
          res.end(JSON.stringify(newRecord));
        });
      });
    });
  }
});

server.listen(port, function (error) {
  if (error) {
    console.log("There is something wrong", error);
  } else {
    console.log("server started on port " + port);
  }
});
