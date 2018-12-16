const FulfillmentTemplate = {
  getTemplate(title, response) {
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
                  textToSpeech: response
                }
              }
            ]
          }
        }
      }
    };
  }
}
module.exports = FulfillmentTemplate;