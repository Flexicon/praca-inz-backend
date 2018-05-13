// Connect to DB via Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb/praca_inz');

module.exports = mongoose;