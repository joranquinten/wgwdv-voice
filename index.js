if (!process.env.now) require("dotenv").config();

const express = require("express");
const app = express();
const helmet = require("helmet");
const fetch = require("node-fetch");

const port = process.env.now ? 8080 : 4000;

app.use(helmet());
app.use(clientErrorHandler);
app.use(errorHandler);

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render("error", { error: err });
}

const contentful = require("contentful");
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: process.env.ctf_space_id,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.ctf_cda_token
});

const fulfillmentTemplate = require("./utils/fulfillment-template");

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

async function getWeather() {
  const config = {
    secret: process.env.darksky_secret,
    location: "52.238,5.5346",
    lang: "nl",
    units: "si",
    exclude: "minutely,hourly,daily,alerts,flags"
  };

  const weatherAPI = `https://api.darksky.net/forecast/${config.secret}/${
    config.location
  }?lang=${config.lang}&units=${config.units}&exclude=${config.exclude}`;

  const response = await fetch(weatherAPI);
  return response.json();
}

async function getSuggestion() {
  const requestQuery = {
    content_type: "suggestie"
  };

  try {
    return await client.getEntries(requestQuery);
  } catch (error) {
    return error;
  }
}

printSuggestion = function(req, res) {
  getSuggestion().then(suggestions => {
    // get a random entry
    const count = suggestions.total;

    const randomSuggestion = suggestions.items[getRandomInt(0, count)];
    const { title } = randomSuggestion.fields;

    res.json(fulfillmentTemplate.getTemplate("Ik heb een idee!", title));
  });
};

app.post("/", (req, res) => {
  const token = req.headers["wgwdv-secret"];
  if (!token || token !== process.env.wgwdv_secret)
    return res
      .status(401)
      .send({ auth: false, message: "No token or incorrect token provided." });
  printSuggestion(req, res);
});

if (!process.env.now) {
  app.get("/", (req, res) => {
    printSuggestion(req, res);
  });

  app.get("/weather", (req, res) => {
    getWeather().then(weatherReport =>{
      res.json(weatherReport);
    });
  });
}

app.listen(port);
