const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const printSuggestion = function(req, res) {
  getAllSuggestions().then(suggestions => {
    // get a random entry
    const count = suggestions.total;
    console.log(suggestions)
    const randomSuggestion = suggestions.items[getRandomInt(0, count)];
    const { title } = randomSuggestion.fields;

    res
      .status(200)
      .json(fulfillmentTemplate.getTemplate("Ik heb een idee!", title));
  });
};

const getAllSuggestions = async function() {
  const requestQuery = {
    content_type: "suggestie"
  };

  try {
    return await client.getEntries(requestQuery);
  } catch (error) {
    return error;
  }
};

module.exports = {
  printSuggestion,
  getAllSuggestions
};
