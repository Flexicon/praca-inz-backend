const mongoose = require('../dbs/mongo');

// Mongoose schemas and models
const movieSchema = mongoose.Schema({
    _id: Number,
    title: String,
    genres: String,
    poster: String
});
const Movie = mongoose.model('movie', movieSchema);

const ratingSchema = mongoose.Schema({
    movieId: { type: Number, ref: 'movie' },
    rating: Number,
    'timestamp': Number
});
const Rating = mongoose.model('rating', ratingSchema);

const tagSchema = mongoose.Schema({
    movieId: { type: Number, ref: 'movie' },
    tag: String,
    'timestamp': Number
});
const Tag = mongoose.model('tag', tagSchema);


module.exports = {
    Movie,
    Rating,
    Tag,
};
