const MongoModels = require('../../models/mongodb-models');

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
    list: function (req, res, next) {
        MongoModels.Movie.count().then(count => {
            const sort = req.query.sort || 'id';
            const limit = Math.max(1, +req.query.limit || 100);
            const totalPages = Math.ceil(count / limit);
            let page = Math.max(1, +req.query.page || 1);
            page = Math.min(page, totalPages);

            MongoModels.Movie
                .find()
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(getSort(sort))
                .exec()
                .then(movies => res.send({ total: count, limit, page, totalPages, movies }))
                .catch(err => next(err));
        }).catch(err => next(err));
    },
    // Retrieve a single Movie document
    movie: function (req, res, next) {
        MongoModels.Movie.findById(+req.params.id)
            .then(movie => {
                if (!movie) {
                    res.status(404).send({ message: 'No movie found by given id' });
                    return;
                }
                const ratingsPromise = MongoModels.Rating
                    .aggregate([
                        { $match: { movieId: movie._id } },
                        { $group: { _id: null, rating: { $avg: '$rating' }, count: { $sum: 1 } } }
                    ]).exec();
                const tagsPromise = MongoModels.Tag
                    .find({ movieId: movie._id })
                    .limit(100)
                    .sort('-timestamp');

                Promise.all([ratingsPromise, tagsPromise])
                    .then(([rating, tags]) => res.send({ movie, rating, tags }))
                    .catch(err => next(err));

            }).catch(err => next(err));
    }
};

module.exports = MoviesController;