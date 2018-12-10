const contentful = require("contentful");
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: process.env.ctf_space_id,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: process.env.ctf_cda_token
});

module.exports.client = client;