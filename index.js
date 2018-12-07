require("dotenv").config();

const express = require("express");
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST");
});
const port = 8080;

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

app.post("/", (req, res) => {
  getSuggestion().then(suggestions => {
    // get a random entry
    const count = suggestions.total;

    const randomSuggestion = suggestions.items[getRandomInt(0, count)];
    const { title } = randomSuggestion.fields;

    res.json(fulfillmentTemplate.getTemplate("Ik heb een idee", title));
  });
});

app.listen();
