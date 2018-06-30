const couchimport = require('couchimport');
const opts = { COUCH_DELIMITER: ',', COUCH_URL: 'http://couchdb:5984', COUCH_PARALLELISM: 100 };

console.log('Importing movies...');
couchimport.importFile('./seeds/movies.csv', { ...opts, COUCH_DATABASE: 'movies' }, function(err, data) {
  console.log('Operation over.', err, data);
});

console.log('Importing ratings...');
couchimport.importFile('./seeds/ratings.csv', { ...opts, COUCH_DATABASE: 'ratings' }, function(err, data) {
  console.log('Operation over.', err, data);
});

console.log('Importing tags...');
couchimport.importFile('./seeds/tags.csv', { ...opts, COUCH_DATABASE: 'tags' }, function(err, data) {
  console.log('Operation over.', err, data);
});
