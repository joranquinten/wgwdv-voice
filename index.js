if (!process.env.now) require("dotenv").config();

const express = require("express");
var helmet = require("helmet");

const errorHandler = require("./middleware/error-handlers");
const tokenProtected = require("./middleware/token-protected");

const Contentful = require("./content/contentful");
const Fulfillment = require("./utils/fulfillment");
const Weather = require("./content/weather");

const app = express();
const port = process.env.now ? 8080 : 4000;

// Set up middlewares
app.use(helmet());

//app.use("/webhook", tokenProtected.validateWebhookSecret);

app.post("/", tokenProtected.validateWebhookSecret, async (req, res) => {
  const weatherType = await Weather.getWeatherType();
  const suggestion = await Contentful.getRandomSuggestion(weatherType);
  res.json(Fulfillment.getTemplate("Ik heb een idee!", suggestion.title));
});

if (process.env.NODE_ENV !== "production") {
  app.get("/", async (req, res) => {
    const weatherType = await Weather.getWeatherType();
    const suggestion = await Contentful.getRandomSuggestion(weatherType);
    res.json(Fulfillment.getTemplate("Ik heb een idee!", suggestion.title));
  });
}

app.use(errorHandler.clientErrorHandler);
app.use(errorHandler.errorHandler);

const server = app.listen(port, () => {
  if (process.env.NODE_ENV !== "production") {
    const port = server.address().port;
    console.log("Example app listening at http://localhost:%s", port);
  }
});
