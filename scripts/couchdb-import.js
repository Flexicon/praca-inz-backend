const couchimport = require('couchimport');
const axios = require('axios');
const chalk = require('chalk');

const batchSize = 1000;
const opts = {
  COUCH_DELIMITER: ',',
  COUCH_URL: 'http://couchdb:5984',
  COUCH_PARALLELISM: 5
};
const http = axios.create({
  baseURL: 'http://couchdb:5984',
  timeout: 10000
});

importMovies();

function importMovies() {
  console.log('Importing movies...');
  let moviesCounter = 0;
  couchimport
    .importFile(
      './seeds/movies.csv',
      { ...opts, COUCH_DATABASE: 'movies' },
      function(err, data) {
        console.log('Operation over.', err, data);
        importTags();
      }
    )
    .on('written', data => {
      moviesCounter += data.documents;
      if (moviesCounter % batchSize === 0 || data.documents < 500) {
        moviesCounter = 0;
        const percent = (data.total / 27278) * 100;
        console.log(chalk.blue(Math.floor(percent) + '%'));
        http
          .get('/movies/_design/moviesviews/_view/count_by_title')
          .then(() => console.log(chalk.green('Update successful: Movies')))
          .catch(err => {
            // console.log(
            //   chalk.red('ERROR CAUGHT: Movies'),
            //   err.response ? err.response.data : err
            // );
          });
      }
    });
}

function importTags() {
  console.log('Importing tags...');
  let tagsCounter = 0;
  couchimport
    .importFile(
      './seeds/tags.csv',
      { ...opts, COUCH_DATABASE: 'tags' },
      function(err, data) {
        console.log('Operation over.', err, data);
        importRatings();
      }
    )
    .on('written', data => {
      tagsCounter += data.documents;
      if (tagsCounter % batchSize === 0 || data.documents < 500) {
        ratingsCounter = 0;
        const percent = (data.total / 465564) * 100;
        console.log(chalk.blue(Math.floor(percent) + '%'));
        http
          .get('http://couchdb:5984/tags/_design/lists/_view/count_by_movie')
          .then(() => console.log(chalk.green('Update successful: Tags')))
          .catch(err => {
            // console.log(
            //   chalk.red('ERROR CAUGHT: Tags'),
            //   err.response ? err.response.data : err.code
            // );
          });
      }
    });
}

function importRatings() {
  console.log('Importing ratings...');
  let ratingsCounter = 0;
  couchimport
    .importFile(
      './seeds/ratings.csv',
      { ...opts, COUCH_DATABASE: 'ratings' },
      function(err, data) {
        console.log('Operation over.', err, data);
        validateRatingsIndex();
      }
    )
    .on('written', data => {
      ratingsCounter += data.documents;
      if (ratingsCounter % batchSize === 0 || data.documents < 500) {
        ratingsCounter = 0;
        const percent = (data.total / 2000000) * 100;
        console.log(chalk.blue(Math.floor(percent) + '%'));
        http
          .get('http://couchdb:5984/ratings/_design/lists/_view/avg_by_movie')
          .then(() => console.log(chalk.green('Update successful: Ratings')))
          .catch(err => {
            // console.log(
            //   chalk.red('ERROR CAUGHT: Ratings'),
            //   err.response ? err.response.data : err.code
            // );
          });
      }
    });
}

function validateRatingsIndex() {
  http
    .get('http://couchdb:5984/ratings/_design/lists/_view/avg_by_movie')
    .then(() => console.log(chalk.green('Ratings index validated!')))
    .catch(() => {
      validateRatingsIndex();
    });
}
