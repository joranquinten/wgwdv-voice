const fetch = require("node-fetch");
const Contentful = require("./contentful");
const NodeCache = require("node-cache");

// setup cache
const weatherCache = new NodeCache();
const cacheOpts = {
  key: "weatherCache",
  ttl: 60 * 60 * 6 // 6 hour
};

const Weather = {
  async getWeather() {
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

    cachedDailyReport = weatherCache.get(cacheOpts.key);

    if (cachedDailyReport === undefined) {
      const response = await fetch(weatherAPI);
      const dailyReport = await response.json();
      weatherCache.set(cacheOpts.key, dailyReport, cacheOpts.ttl);
      return dailyReport;
    } else {
      return cachedDailyReport;
    }
  },
  async getWeatherType() {
    return Contentful.getWeatherTypes().then(weatherTypes => {
      return Weather.getWeather().then(weatherReport => {
        const temperature = Math.floor(
          weatherReport.currently.temperature +
            weatherReport.currently.apparentTemperature / 2
        );
        const chanceOfRainPercentage =
          weatherReport.currently.precipProbability * 100;
        const precipType = weatherReport.currently.precipType;
        const amountOfRain = weatherReport.currently.precipIntensity * 100; // above .25 is significant amount of rain

        const currentWeather = {
          temperature,
          chanceOfRainPercentage,
          amountOfRain,
          precipType
        };

        const roundDecimals = number => Math.round(number * 100) / 100;

        // First the exceptions:
        if (currentWeather.precipType === "snow" && amountOfRain > 0) {
          return weatherTypes.filter(type => (type.title.includes('sneeuw')))[0];
        }

        const filteredWeatherTypes = weatherTypes
          .map(type => {
            const avgTemp = (type.minimum + type.maximum) / 2;
            const score = {
              temp:
                type.minimum === -50 || type.minimum === 50
                  ? 2
                  : roundDecimals(
                      Math.abs(avgTemp - currentWeather.temperature)
                    ),
              precipication:
                type.kansOpNeerslagPercentage === null
                  ? 0
                  : roundDecimals(
                      Math.abs(
                        type.kansOpNeerslagPercentage -
                          currentWeather.chanceOfRainPercentage
                      )
                    )
            };
            return { ...type, score };
          })
          .sort((a, b) => a.score.temp - b.score.temp);
        return filteredWeatherTypes[0];
      });
    });
  }
};

module.exports = Weather;
/*




module.exports.getWeather = getWeather;
module.exports.getWeatherTypes = getWeatherTypes;
module.exports.getWeatherType = getWeatherType;
*/
