const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const goodbyeMessage = [
  "Veel plezier! Komen jullie nog een keertje terug?",
  "Veel plezier en tot ziens!",
  "Veel plezier! Doei!",
  "Veel plezier en misschien tot snel?",
  "Veel plezier! Zie ik jullie morgen weer?"
];

const FulfillmentTemplate = {
  getTemplate(title, response, additionalInfo) {
    return {
      fulfillmentText: response,
      fulfillmentMessages: [
        {
          card: {
            title: title,
            subtitle: response
          }
        }
      ],
      source: "https://watzalikdoenvandaag.nl",
      payload: {
        google: {
          expectUserResponse: false,
          richResponse: {
            items: [
              {
                simpleResponse: {
                  textToSpeech: `${response} ${goodbyeMessage[getRandomInt(0, goodbyeMessage.length - 1)]}`
                }
              }
            ]
          }
        }
      }
    };
  }
};
module.exports = FulfillmentTemplate;
