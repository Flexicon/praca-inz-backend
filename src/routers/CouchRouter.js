const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MoviesController = require('../controllers/couch/MoviesController');
const RatingsController = require('../controllers/couch/RatingsController');

router.use(bodyParser.urlencoded({extended: true}));


router.get('/', (req, res) => {
    res.send({
        version: '0.0.1',
        message: 'CouchDB API'
    });
});

// Movies routes
router.route('/movies')
    .get(MoviesController.list);
router.route('/movies/:id')
    .get(MoviesController.movie);

// Ratings routes
router.route('/ratings')
    .get(RatingsController.list);
router.route('/ratings/:id')
    .get(RatingsController.rating);

module.exports = router;