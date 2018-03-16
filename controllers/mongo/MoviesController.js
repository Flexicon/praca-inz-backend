const MongoModels = require('../../models/mongodb-models');

const MoviesController = {
    // Retrieve all Movie documents
    all: function (req, res) {
        MongoModels.Movie.find(function (err, movies) {
            if (err) {
                res.send({ status: false, message: 'An error has occurred while retrieving movies' });
                console.error(err.message);
                return;
            }
            res.send({ status: true, movies: movies });
        });
    },
    // Retrieve a single Movie document
    movie: function (req, res) {
        MongoModels.Movie.find(req.body.id, function (err, movie) {
            if (err || !movie) {
                res.send({ status: false, message: 'No movie found by given id' });
                return;
            }
            res.send({ status: true, movie: movie });
        });
    }
};

module.exports = MoviesController;