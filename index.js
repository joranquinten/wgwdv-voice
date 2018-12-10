if (!process.env.now) require("dotenv").config();

const express = require("express");
const app = express();
const helmet = require("helmet");

// internal tooling
const errorHandler = require("./utils/error-handlers");
const suggestion = require("./utils/suggestion");
const weather = require("./utils/get-weather");

const port = process.env.now ? 8080 : 4000;

app.use(helmet());
app.use(errorHandler.clientErrorHandler);
app.use(errorHandler.errorHandler);

app.post("/", (req, res) => {
  const token = req.headers["wgwdv-secret"];
  if (!token || token !== process.env.wgwdv_secret)
    return res
      .status(401)
      .send({ auth: false, message: "No token or incorrect token provided." });
  suggestion.printSuggestion(req, res);
});

if (!process.env.now) {
  app.get("/", (req, res) => {
    suggestion.printSuggestion(req, res);
  });

  app.get("/weather", (req, res) => {
    weather.getWeather().then(weatherReport => {
      res.json(weatherReport);
    });
  });
}

app.listen(port);
