const NodeCouchDb = require('node-couchdb');

const couch = new NodeCouchDb({
  host: 'couchdb',
});

module.exports = couch;