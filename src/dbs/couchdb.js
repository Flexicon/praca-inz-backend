const axios = require('axios');

const host = 'couchdb';
const port = 5984;

const config = {
  baseURL: `http://${host}:${port}`
};

const couchHttp = axios.create(config);

module.exports = couchHttp;
