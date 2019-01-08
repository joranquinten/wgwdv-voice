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
  getWeatherAPI() {
    return "https://wgwdv-api.watzalikdoenvandaag.nl/api/weather";
  },
  async weatherAPICall() {
    const weatherAPI = Weather.getWeatherAPI();

    const response = await fetch(weatherAPI, {
      method: "POST",
      headers: {
        "wgwdv-secret": process.env.wgwdv_secret
      }
    });
    const jsonResult = await response.json();
    return jsonResult;
  },
  async getWeatherType() {
    const jsonResult = await Weather.weatherAPICall();
    const { weatherType } = jsonResult;
    return weatherType;
  }
};

module.exports = Weather;
