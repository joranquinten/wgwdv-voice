const contentful = require("contentful");
const NodeCache = require("node-cache");
const contentfulCache = new NodeCache({ stdTTL: 60, checkperiod: 15 });

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: process.env.ctf_space_id,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.ctf_cda_token
});

// TODO: Move contentful queries to here (suggetsions & weathertype)

const getItems = function(response) {
  return (response.items || []).reduce((items, item) => {
    return [...items, { id: item.sys.id, ...item.fields }];
  }, []);
};

module.exports.client = client;
module.exports.getItems = getItems;
