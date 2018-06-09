const MongoModels = require('../../models/mongodb-models');
const Utils = require('../../shared/util');

function getSort(sort) {
    switch (sort) {
        case 'timestamp':
            return 'timestamp';
        case 'timestamp_desc':
        default:
            return '-timestamp';
    }
}

const RatingsController = {
    // Retrieve a paginated list of Rating documents
    list: function (req, res, next) {
        MongoModels.Rating.count().then(count => {
            const {
                limit,
                page,
                totalPages,
                sort
            } = Utils.preparePaginationParams(req.query, count, 100, 'timestamp_desc');

            MongoModels.Rating
                .find()
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(getSort(sort))
                .populate('movieId')
                .exec()
                .then(ratings => res.send({ total: count, limit, page, totalPages, sort, ratings }))
                .catch(err => next(err));
        }).catch(err => next(err));
    },
    // Retrieve a single Rating document
    rating: function (req, res, next) {
        MongoModels.Rating.findById(req.params.id, function (err, rating) {
            if (!rating) {
                res.status(404).send({ message: 'No rating found by given id' });
                return;
            }
            res.send(rating);
        }).catch(err => next(err));
    }
};

module.exports = RatingsController;