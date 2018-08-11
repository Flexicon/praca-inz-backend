const Utils = require('../../shared/util');
const couch = require('../../dbs/couchdb');

const MoviesController = {
  // Retrieve a paginated list of Movie documents
  list: async function(req, res, next) {
    const phrase = req.query.phrase || '';
    const tillPhrase = Utils.incrementLastChar(phrase);

    // Count View query
    const dbName = 'movies';
    const startKey = [phrase];
    const endKey = [tillPhrase];
    const countViewUrl = phrase
      ? '_design/moviesviews/_view/count_by_title'
      : '_design/moviesviews/_view/count_by_id';

    const queryOptions = phrase
      ? {
          startKey,
          endKey
        }
      : {};

    const count = await couch
      .get(dbName, countViewUrl, queryOptions)
      .then(({ data }) => data.rows[0].value)
      .catch(err => next(err));

    // List View query
    const listViewUrl = phrase
      ? '_design/moviesviews/_view/list_by_title'
      : '_design/moviesviews/_view/list_by_id';

    // Pagination params
    const { limit, page, totalPages, sort } = Utils.preparePaginationParams(
      req.query,
      count
    );
    const skip = count > 0 ? (page - 1) * limit : 0;

    queryOptions.limit = limit;
    queryOptions.skip = skip;
    queryOptions.include_docs = true;
    queryOptions.descending = sort.includes('_desc');

    const items = await couch
      .get(dbName, listViewUrl, queryOptions)
      .then(({ data }) => data.rows)
      .then(rows => rows.map(row => row.doc))
      .catch(err => next(err));

    res.send({
      total: count,
      limit,
      page,
      totalPages,
      sort,
      phrase,
      items
    });
  },
  // Retrieve a single Movie document
  movie: function(req, res, next) {
    res.send({ message: 'Movie detail - couchdb' });

    // MongoModels.Movie.findById(+req.params.id)
    //   .then(movie => {
    //     if (!movie) {
    //       res.status(404).send({ message: 'No movie found by given id' });
    //       return;
    //     }
    //     const ratingsPromise = MongoModels.Rating.aggregate([
    //       { $match: { movieId: movie._id } },
    //       { $group: { _id: null, rating: { $avg: '$rating' }, count: { $sum: 1 } } },
    //     ]).exec();
    //     const tagsPromise = MongoModels.Tag.find({ movieId: movie._id })
    //       .limit(100)
    //       .sort('-timestamp');

    //     Promise.all([ratingsPromise, tagsPromise])
    //       .then(([rating, tags]) => res.send({ movie, rating, tags }))
    //       .catch(err => next(err));
    //   })
    //   .catch(err => next(err));
  }
};

module.exports = MoviesController;
