const MongoModels = require('../../models/mongodb-models');

const RatingsController = {
    // Retrieve a paginated list of Rating documents
    list: function (req, res) {
        const limit = Math.max(1, +req.query.limit || 100);

        MongoModels.Rating
            .find()
            .limit(limit)
            .sort('-timestamp')
            .populate('movieId')
            .exec()
            .then(ratings => res.send({ ratings }));
    },
    // Retrieve a single Rating document
    rating: function (req, res) {
        MongoModels.Rating.findById(req.params.id, function (err, rating) {
            if (!rating) {
                res.status(404).send({ message: 'No rating found by given id' });
                return;
            }
            res.send(rating);
        });
    }
};

module.exports = RatingsController;