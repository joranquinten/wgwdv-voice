if (!process.env.now) require("dotenv").config();

const express = require("express");
var helmet = require("helmet");

const app = express();
const port = process.env.now ? 8080 : 4000;

const isBefore = require("date-fns/is_before");
const isAfter = require("date-fns/is_after");
const isEqual = require("date-fns/is_equal");

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

const DateFns = require('./utils/date-fns');

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
    const getDateField = DateFns.getDateField;

    // filter dates
    const filteredByDate = (suggestions.items || []).reduce(
      (filtered, suggestion) => {
        const today = new Date();

        const startDate = getDateField(suggestion, "startDate");
        const stopDate = getDateField(suggestion, "stopDate");

        if (
          (isBefore(startDate, today) || isEqual(startDate, today)) &&
          (isAfter(stopDate, today) || isEqual(stopDate, today))
        ) {
          return [...filtered, suggestion];
        }

        return filtered;
      },
      []
    );

    const count = filteredByDate.length;

    const randomSuggestion = filteredByDate[getRandomInt(0, count)];
    const { title } = randomSuggestion.fields;

    res
      .status(200)
      .json(fulfillmentTemplate.getTemplate("Ik heb een idee!", title));
  });
};

app.post("/", (req, res) => {
  const token = req.headers["wgwdv-secret"];
  if (token !== process.env.wgwdv_secret)
    return res.status(401).send({ auth: false, message: "No token provided." });

  printSuggestion(req, res);
});

if (!process.env.now) {
  app.get("/", (req, res) => {
    printSuggestion(req, res);
  });
}

const server = app.listen(port, () => {
  if (!process.env.now) {
    const port = server.address().port;
    console.log("Example app listening at http://localhost:%s", port);
  }
});
