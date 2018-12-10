const fetch = require("node-fetch");

async function getWeather() {
  const config = {
    secret: "865e02b217b44d44209f3c9a26798255", //secret: process.env.darksky_secret,
    location: "52.238,5.5346",
    lang: "en",
    units: "si",
    exclude: "minutely,hourly,daily,alerts,flags"
  };

  const weatherAPI = `https://api.darksky.net/forecast/${config.secret}/${
    config.location
    }?lang=${config.lang}&units=${config.units}&exclude=${config.exclude}`;

  const response = await fetch(weatherAPI);
  return response.json();
}

module.exports.getWeather = getWeather;
