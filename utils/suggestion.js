const contentful = require("./contentful");
const fulfillmentTemplate = require("./fulfillment-template");

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

async function getSuggestion() {
  const requestQuery = {
    content_type: "suggestie"
  };

  try {
    return await contentful.client.getEntries(requestQuery);
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

module.exports.getSuggestion = getSuggestion;
module.exports.printSuggestion = printSuggestion;
