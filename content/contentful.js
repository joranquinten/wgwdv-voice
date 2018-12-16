const contentful = require("contentful");
const NodeCache = require("node-cache");
const isBefore = require("date-fns/is_before");
const isAfter = require("date-fns/is_after");
const isEqual = require("date-fns/is_equal");
const format = require("date-fns/format");
const DateFns = require("../utils/date-fns");

// Set up our client
const client = contentful.createClient({
  space: process.env.ctf_space_id,
  accessToken: process.env.ctf_cda_token
});

// Set up cache
const contentfulCache = new NodeCache();
const cacheOpts = {
  key: "suggestionsCache",
  ttl: 60 * 60 * 1 // 1 hours
};

const getDateField = DateFns.getDateField;

const today = format(new Date(), "YYYY-MM-DD");

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const formatSuggestionsResponse = items =>
  items.map(item => ({
    id: item.sys.id,
    ...item.fields
  }));

const dateFilter = items => {
  return (items || []).filter(item => {
    const startDate = getDateField(item, "startDate");
    const stopDate = getDateField(item, "stopDate");
    return (
      (isBefore(startDate, today) || isEqual(startDate, today)) &&
      (isAfter(stopDate, today) || isEqual(stopDate, today))
    );
  });
};

const Contentful = {
  async getAllSuggestions() {
    cachedResponse = contentfulCache.get(cacheOpts.key);
    if (cachedResponse === undefined) {
      const requestQuery = {
        content_type: "suggestie"
      };

      try {
        const response = await client.getEntries(requestQuery);
        const formattedSuggestions = formatSuggestionsResponse(response.items);
        contentfulCache.set(cacheOpts.key, formattedSuggestions, cacheOpts.ttl);
        return formattedSuggestions;
      } catch (error) {
        throw new Error(error);
      }
    } else {
      return cachedResponse;
    }
  },
  filterSuggestions(items) {
    filteredByDate = dateFilter(items);

    return filteredByDate;
  },
  async getRandomSuggestion() {
    return await Contentful.getAllSuggestions().then(items => {
      const filtered = Contentful.filterSuggestions(items);
      const randomInt = getRandomInt(0, filtered.length - 1);
      const randomItem = filtered[randomInt];
      return randomItem;
    });
  }
};

module.exports = Contentful;
