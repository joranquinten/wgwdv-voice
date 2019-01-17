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
    let reply = response;
    if (additionalInfo.weatherTitle) {
      reply = `Het is "${additionalInfo.weatherTitle}". ${response}`;
    }

    return {
      fulfillmentText: reply,
      fulfillmentMessages: [
        {
          card: {
            title: title,
            subtitle: reply
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
                  textToSpeech: `${reply} ${
                    goodbyeMessage[getRandomInt(0, goodbyeMessage.length - 1)]
                  }`
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
