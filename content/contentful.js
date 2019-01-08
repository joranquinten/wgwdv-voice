const contentful = require("contentful");
const NodeCache = require("node-cache");

const isBefore = require("date-fns/is_before");
const isAfter = require("date-fns/is_after");
const isEqual = require("date-fns/is_equal");
const addDays = require("date-fns/add_days");
const addYears = require("date-fns/add_years");
const format = require("date-fns/format");
const parse = require("date-fns/parse");

const DateFns = require("../utils/date-fns");

// Set up our client
const client = contentful.createClient({
  space: process.env.ctf_space_id,
  accessToken: process.env.ctf_cda_token
});

// Set up cache
const contentfulCache = new NodeCache();
const cacheOpts = {
  key: ["suggestionsCache", "weatherCache"],
  ttl: 60 * 60 * 1 // 1 hours
};

const getDateField = DateFns.getDateField;

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const formatItemsResponse = items =>
  items.map(item => ({
    id: item.sys.id,
    ...item.fields
  }));

const dateFilter = (today, items) =>
  (items || []).filter(item => {
    let startDate = parse(getDateField(item, "startDate"));
    let stopDate = addDays(parse(getDateField(item, "stopDate")), 1);
    if (isBefore(stopDate, startDate)) {
      if (isBefore(today, startDate)) {
        startDate = addYears(startDate, -1);
      } else {
        stopDate = addYears(stopDate, 1);
      }
    }

    return (
      (isBefore(startDate, today) || isEqual(startDate, today)) &&
      (isAfter(stopDate, today) || isEqual(stopDate, today))
    );
  });

const weatherFilter = (items, weatherType) => {
  const filteredByWeather = items.reduce((collection, item) => {
    hasWeerTypen = !!item.geschiktVoorWeertypen;
    if (!hasWeerTypen) {
      return [...collection, { item }];
    } else {
      geschiktWeerTypeIds = item.geschiktVoorWeertypen.map(type => type.sys.id);
      if (geschiktWeerTypeIds.includes(weatherType.id)) {
        return [...collection, { item }];
      }
    }
    return collection;
  }, []);
  return filteredByWeather;
};

const Contentful = {
  async getAllSuggestions() {
    const cachedResponse = contentfulCache.get(cacheOpts.key[0]);
    if (cachedResponse === undefined) {
      const requestQuery = {
        content_type: "suggestie"
      };

      try {
        const response = await client.getEntries(requestQuery);
        const formattedSuggestions = formatItemsResponse(response.items);
        contentfulCache.set(
          cacheOpts.key[0],
          formattedSuggestions,
          cacheOpts.ttl
        );
        return formattedSuggestions;
      } catch (error) {
        throw new Error(error);
      }
    } else {
      return cachedResponse;
    }
  },
  filterSuggestions(items, weatherType) {
    let filtered;
    const today = new Date();
    filtered = dateFilter(today, items);
    filtered = weatherFilter(filtered, weatherType);
    return filtered;
  },
  async getRandomSuggestion(weatherType) {
    return await Contentful.getAllSuggestions().then(items => {
      const filtered = Contentful.filterSuggestions(
        items,
        weatherType
      );
      const randomInt = getRandomInt(0, filtered.length - 1);
      const randomItem = filtered[randomInt].item;
      return randomItem;
    });
  }
};

module.exports = Contentful;
