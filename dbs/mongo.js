// Connect to DB via Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb/inz_db');

module.exports = mongoose;