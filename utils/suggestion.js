const contentful = require("./contentful");
const fulfillmentTemplate = require("./fulfillment-template");
const weather = require("./get-weather");

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

async function getSuggestions() {
  const requestQuery = {
    content_type: "suggestie"
  };

  try {
    return await contentful.client.getEntries(requestQuery);
  } catch (error) {
    return error;
  }
}

async function matchSuggestions(req, res) {
  weather.getWeather().then(weatherReport => {
    return suggestions;
  });
}

printSuggestion = function(req, res) {
  getSuggestions().then(suggestions => {
    // Filter by weather
    weather.getWeatherType().then(weatherType => {
      console.log(">", weatherType);
      // Use the weathertype ID to retrieve matches from suggestions (or none)
    });

    // Get a random entry from the result
    const count = suggestions.total;
    const randomSuggestion = suggestions.items[getRandomInt(0, count)];
    const { title } = randomSuggestion.fields;

    res.json(fulfillmentTemplate.getTemplate("Ik heb een idee!", title));
  });
};

module.exports.getSuggestions = getSuggestions;
module.exports.printSuggestion = printSuggestion;
