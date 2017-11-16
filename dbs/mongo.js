// Connect to DB via Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb/note_db');

module.exports = mongoose;