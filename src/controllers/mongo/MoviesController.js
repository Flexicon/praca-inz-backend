const MongoModels = require('../../models/mongodb-models');
const Utils = require('../../shared/util');

function getSort(sort) {
  switch (sort) {
    case 'title':
      return 'title';
    case 'title_desc':
      return '-title';
    case 'id_desc':
      return '-_id';
    case 'id':
    default:
      return '_id';
  }
}

const MoviesController = {
  // Retrieve a paginated list of Movie documents
  list: function(req, res, next) {
    const phrase = req.query.phrase || '';

    MongoModels.Movie.find(phrase ? { title: { $regex: new RegExp(phrase, 'i') } } : null)
      .count()
      .then(count => {
        const { limit, page, totalPages, sort } = Utils.preparePaginationParams(
          req.query,
          count,
          100,
        );

        MongoModels.Movie.find(phrase ? { title: { $regex: new RegExp(phrase, 'i') } } : {})
          .skip(count > 0 ? (page - 1) * limit : 0)
          .limit(limit)
          .sort(getSort(sort))
          .exec()
          .then(movies =>
            res.send({ total: count, limit, page, totalPages, sort, phrase, items: movies }),
          )
          .catch(err => next(err));
      })
      .catch(err => next(err));
  },
  // Retrieve a single Movie document
  movie: function(req, res, next) {
    MongoModels.Movie.findById(+req.params.id)
      .then(movie => {
        if (!movie) {
          res.status(404).send({ message: 'No movie found by given id' });
          return;
        }
        const ratingsPromise = MongoModels.Rating.aggregate([
          { $match: { movieId: movie._id } },
          { $group: { _id: null, rating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]).exec();
        const tagsPromise = MongoModels.Tag.find({ movieId: movie._id })
          .limit(100)
          .sort('-timestamp');

        Promise.all([ratingsPromise, tagsPromise])
          .then(([rating, tags]) => res.send({ movie, rating, tags }))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  },
};

module.exports = MoviesController;
