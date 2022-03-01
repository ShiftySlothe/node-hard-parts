const http = require("http");
const fs = require("fs");
const res = require("express/lib/response");

function doOnRequest(request, response) {
  // Send back a message saying "Welcome to Twitter"
  // code here...
  if (request.method === "GET" && request.url === "/") {
    // read the index.html file and send it back to the client
    // code here...
    const htmlDoc = fs.readFileSync("./index.html", { encoding: "utf8" });
    response.end(htmlDoc);
  } else if (request.method === "GET" && request.url === "/style.css") {
    const css = fs.readFileSync("./style.css", { encoding: "utf-8" });
    response.end(css);
  } else if (request.method === "POST" && request.url === "/sayHi") {
    fs.appendFileSync("hi_log.txt", "Somebody said hi.\n");
    response.end("hi back to you!");
  } else if (request.method === "POST" && request.url === "/greeting") {
    // accumulate the request body in a series of chunks
    // code here...
    let body = [];
    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        body = JSON.parse(body);
        console.log(body);
        let reply = "good morning";
        if (body.message === "hello") {
          reply = "hello there";
        } else if (body.message === "what's up") {
          reply = "the sky";
        } else {
          reply = "good morning";
        }
        fs.appendFileSync("hi_log.txt", reply + "\n");
        response.end(reply);
      });
  } else {
    // Handle 404 error: page not found
    // code here...
    response.end("Error: Not Found");
  }
}

const server = http.createServer(doOnRequest);

server.listen(3000);
