const MongoModels = require('../../models/mongodb-models');

const RatingsController = {
    // Retrieve a paginated list of Rating documents
    list: function (req, res, next) {
        const limit = Math.max(1, +req.query.limit || 100);

        MongoModels.Rating
            .find()
            .limit(limit)
            .sort('-timestamp')
            .populate('movieId')
            .exec()
            .then(ratings => res.send({ ratings }))
            .catch(err => next(err));
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