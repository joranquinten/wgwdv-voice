const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const contentful = require("./contentful");

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
    return await contentful.client.getEntries(requestQuery);
  } catch (error) {
    return error;
  }
}

async function getWeatherType() {
  return getWeatherTypes().then(entries => {
    const weatherTypes = contentful.getItems(entries);
    return getWeather().then(weatherReport => {
      const temperature = Math.floor(
        weatherReport.currently.temperature +
          weatherReport.currently.apparentTemperature / 2
      );
      const chanceOfRainPercentage =
        weatherReport.currently.precipProbability * 100;
      const amountOfRain = weatherReport.currently.precipIntensity * 100; // above .25 is significant amount of rain

      const currentWeather = {temperature, chanceOfRainPercentage, amountOfRain};

      const filteredWeatherTypes = weatherTypes
        .map(type => {
          const avgTemp = (type.minimum + type.maximum) / 2;
          const translatedChanceOfRain = type.kansOpNeerslag * 10;

          return { ...type, avgTemp, translatedChanceOfRain }
        })
        .filter(type => (
          type.minimum <= currentWeather.temperature &&
          type.maximum >= currentWeather.temperature)
        )
        .sort((a, b) => Math.abs(a.avgTemp - currentWeather.temperature) -
          Math.abs(b.avgTemp - currentWeather.temperature))
        .sort((a, b) => Math.abs(a.translatedChanceOfRain - currentWeather.amountOfRain) -
          Math.abs(b.translatedChanceOfRain - currentWeather.amountOfRain));
      return filteredWeatherTypes[0];
    });
  });
}

module.exports.getWeather = getWeather;
module.exports.getWeatherType = getWeatherType;
