require("dotenv").config();

const express = require("express");
const app = express();
const port = 8080;

const contentful = require("contentful");
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: process.env.CTF_SPACE_ID,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.CTF_CDA_TOKEN
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

app.get("/api/suggestion", (req, res) => {
  //res.send("Hello World!!!");
  console.log(fulfillmentTemplate.getTemplate("title", "description"));

  // getting all suggestions
  getSuggestion().then(suggestions => {
    // get a random entry
    const count = suggestions.total;

    const randomSuggestion = suggestions.items[getRandomInt(0, count)];
    const { title } = randomSuggestion.fields;

    res.json(fulfillmentTemplate.getTemplate("Ik heb een idee", title));
  });
  //res.json(getSuggestion());
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
