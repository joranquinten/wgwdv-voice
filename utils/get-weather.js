const fetch = require("node-fetch");
const contentful = require("./contentful");
const NodeCache = require("node-cache");

const weatherCache = new NodeCache({ stdTTL: 60 * 30, checkperiod: 60 * 20 });

async function getWeather() {
  const config = {
    secret: process.env.darksky_secret,
    location: "52.238,5.5346",
    lang: "en",
    units: "si",
    exclude: "minutely,hourly,daily,alerts,flags"
  };

  const weatherAPI = `https://api.darksky.net/forecast/${config.secret}/${
    config.location
  }?lang=${config.lang}&units=${config.units}&exclude=${config.exclude}`;

  const response = await fetch(weatherAPI);
  const dailyReport = await response.json();

  cachedDailyReport = weatherCache.get("dailyReport");

  if (cachedDailyReport === undefined) {
    weatherCache.set("dailyReport", dailyReport, function(err, success) {
      if (!err && success) {
        return dailyReport;
      }
    });
  } else {
    return cachedDailyReport;
  }

  return dailyReport;
}
async function getWeatherTypes() {
  const requestQuery = {
    content_type: "temperatuur"
  };

  try {
    const response = await contentful.client.getEntries(requestQuery);
    return (weatherTypes = contentful.getItems(response))
      .map(item => ({ ...item,
        kansOpNeerslagPercentage: (item.kansOpNeerslag * 20)/100}));
  } catch (error) {
    return error;
  }
}

async function getWeatherType() {
  return getWeatherTypes().then(weatherTypes => {
    return getWeather().then(weatherReport => {
      const temperature = Math.floor(
        weatherReport.currently.temperature +
          weatherReport.currently.apparentTemperature / 2
      );
      const chanceOfRainPercentage =
        weatherReport.currently.precipProbability * 100;
      const amountOfRain = weatherReport.currently.precipIntensity * 100; // above .25 is significant amount of rain

      const currentWeather = {
        temperature,
        chanceOfRainPercentage,
        amountOfRain
      };

      const roundDecimals = number => Math.round(number * 100) / 100;

      const filteredWeatherTypes = weatherTypes.map(
          type => {
            const avgTemp = (type.minimum + type.maximum) / 2;
            const score = {
              temp: (type.minimum === -50 || type.minimum === 50) ? 2 : roundDecimals(Math.abs(avgTemp - currentWeather.temperature)),
              precipication: (type.kansOpNeerslagPercentage === null) ? 0 : roundDecimals(Math.abs(type.kansOpNeerslagPercentage - currentWeather.chanceOfRainPercentage))
            };
            return { ...type, score }
          })
        .sort(
          (a, b) =>
            a.score.temp -
            b.score.temp
        );
      return filteredWeatherTypes[0];
    });
  });
}

module.exports.getWeather = getWeather;
module.exports.getWeatherTypes = getWeatherTypes;
module.exports.getWeatherType = getWeatherType;
