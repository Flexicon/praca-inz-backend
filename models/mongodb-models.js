const mongoose = require('../dbs/mongo');

// Mongoose schemas and models
const noteSchema = mongoose.Schema({
    title: String,
    content: String
});
const Note = mongoose.model('Note', noteSchema);

module.exports = {
    Note
};
