import { createRequire } from "module";

const require = createRequire(import.meta.url);
const express = require("express");
const app = express();
const minimist = require("minimist");
const morgan = require("morgan");

const args = minimist(process.argv.slice(2));
const port = args["port"];
const database = require("./database.js");
const aPort = port || process.env.PORT || 3000;
const { exit } = require('process');


if (args['help']) {
  console.log(`server.js [options]
    --port	Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.
  
    --debug	If set to \`true\`, creates endpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws 
                an error with the message "Error test successful." Defaults to 
                \`false\`.
  
    --log	If set to false, no log files are written. Defaults to true.
                Logs are always written to database.
  
    --help	Return this message and exit.`)
  exit(EXIT_SUCCESS)
}

// coin functions
function coinFlip() {
  let randomNum = Math.random();
  if (randomNum > 0.5) {
    return "heads";
  } else {
    return "tails";
  }
}
function coinFlips(flips) {
  const coinArray = [];
  for (let i = 0; i < flips; i++) {
    let randomNum = Math.random();
    if (randomNum > 0.5) {
      coinArray[i] = "heads";
    } else {
      coinArray[i] = "tails";
    }
  }
  return coinArray;
}
function countFlips(array) {
  let headsCount = 0;
  let tailsCount = 0;

  for (let i = 0; i < array.length; i++) {
    if (array[i] == "heads") {
      headsCount++;
    } else {
      tailsCount++;
    }
  }
  return {
    tails: tailsCount,
    heads: headsCount,
  };
}
function flipACoin(call) {
  let result = coinFlip();
  if (result == call) {
    return {
      call: call,
      flip: result,
      result: "win",
    };
  } else {
    return {
      call: call,
      flip: result,
      result: "lose",
    };
  }
}
// end coin functions

app.get("/app/", (req, res) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.writeHead(res.statusCode, { "Content-Type": "text/plain" });
  res.end(res.statusCode + " " + res.statusMessage);
});

app.get("/app/flip/", (req, res) => {
  res.statusCode = 200;
  let result = coinFlip();
  res.send('{"flip":"' + result + '"}');
});

app.get("/app/flips/:number", (req, res) => {
  let flips = coinFlips(req.params.number);
  let flipsCount = countFlips(flips);

  res.status(200).json({
    raw: flips,
    summary: flipsCount,
  });
});

app.get("/app/flip/call/tails/", (req, res) => {
  res.statusCode = 200;
  let result = flipACoin("tails");
  res.send(result);
});

app.get("/app/flip/call/heads/", (req, res) => {
  res.statusCode = 200;
  let result = flipACoin("heads");
  res.send(result);
});

const server = app.listen(port, () => {
  console.log("App listening on port %PORT%".replace("%PORT%", aPort));
});

// Default response for any other request
app.use(function (req, res) {
  res.status(404).send("404 NOT FOUND");
});
