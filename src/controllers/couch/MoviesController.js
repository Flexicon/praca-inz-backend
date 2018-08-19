const Utils = require('../../shared/util');
const couch = require('../../dbs/couchdb');

const MoviesController = {
  // Retrieve a paginated list of Movie documents
  list: async function(req, res, next) {
    const phrase = req.query.phrase || '';
    const tillPhrase = Utils.incrementLastChar(phrase);

    // Count View query
    const dbName = 'movies';
    const startkey = `"${phrase}"`;
    const endkey = `"${tillPhrase}"`;
    const countViewUrl = phrase
      ? '/_design/moviesviews/_view/count_by_title'
      : '/_design/moviesviews/_view/count_by_id';

    const queryOptions = phrase
      ? {
          startkey,
          endkey
        }
      : {};

    // Retrieve total movies count for given phrase
    const count = await couch
      .get(`/${dbName}/${countViewUrl}`, { params: queryOptions })
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
      .get(`/${dbName}/${listViewUrl}`, { params: queryOptions })
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
  movie: async function(req, res, next) {
    try {
      const movieId = req.params.id;

      // Retrieve movie doc
      const movie = await couch
        .get(`/movies/${movieId}`)
        .then(({ data }) => data)
        .catch(err => next(err));

      // Retrieve average rating
      const ratingsViewUrl = '/ratings/_design/lists/_view/avg_by_movie';
      const queryOptions = { startkey: `"${movieId}"`, endkey: `"${movieId}"` };

      const rating = await couch
        .get(ratingsViewUrl, { params: queryOptions })
        .then(({ data }) => data.rows[0].value)
        .then(({ count, sum }) => ({ count, avg: sum / count }))
        .catch(err => next(err));

      // Retrieve tags
      const tagsViewUrl = '/tags/_design/lists/_view/list_by_movie';
      queryOptions.include_docs = true;

      const tags = await couch
        .get(tagsViewUrl, { params: queryOptions })
        .then(({ data }) => data.rows)
        .then(rows => rows.map(row => row.doc))
        .catch(err => next(err));

      res.send({ movie, rating, tags });
    } catch (e) {
      next(e);
    }
  }
};

module.exports = MoviesController;
