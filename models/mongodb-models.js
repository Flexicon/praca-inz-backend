const mongoose = require('../dbs/mongo');

// Mongoose schemas and models
const noteSchema = mongoose.Schema({
    title: String,
    content: String
});
const Note = mongoose.model('Note', noteSchema);

const movieSchema = mongoose.Schema({
    movieId: Number,
    title: String,
    genres: String
});
const Movie = mongoose.model('Movie', movieSchema);

const ratingSchema = mongoose.Schema({
    movieId: Number,
    rating: Number,
    'timestamp': Number
});
const Rating = mongoose.model('Rating', ratingSchema);

module.exports = {
    Note,
    Movie,
    Rating
};
