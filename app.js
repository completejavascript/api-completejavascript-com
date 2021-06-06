const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const path = require("path");

const jsonFeedRoutesV1 = require("./api/v1/routes/json-feed.js");
const swaggerDocRoutesV1 = require("./api/v1/routes/swagger-jsdoc.js");

const HOST = process.env.HOST;
console.log(process.env.HOST, process.env.API_VERSION);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Config views
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Set common headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );

  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE"
    );
    return res.status(200).json({});
  }

  next();
});

//Configure for server's frontend
if (process.env.API_VERSION === "1") {
  app.get("/", (req, res) => {
    res.render("v1/docs/redoc", { HOST });
  });
}

app.get("/docs/v1/", (req, res) => {
  res.render("v1/docs/redoc", { HOST });
});

app.get("/demo/v1/json-feed", (req, res) => {
  res.render("v1/demo/json-feed", { HOST });
});

// Handling valid requests
app.use("/api/v1/jsonfeed", jsonFeedRoutesV1);
app.use("/api/v1/docs", swaggerDocRoutesV1);

// Hanling 404 requests
app.use((req, res, next) => {
  const error = new Error("Request not found");
  error.status = 404;
  next(error);
});

// Handling errors
app.use((error, req, res, next) => {
  res.status(error.status);
  res.json({
    error: {
      message: error.message,
    },
    request: {
      method: req.method,
      url: `${process.env.HOST}${req.originalUrl}`,
    },
    apiVersion: error.apiVersion,
  });
});

module.exports = app;
