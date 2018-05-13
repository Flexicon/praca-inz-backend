
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MoviesController = require('../../controllers/mongo/MoviesController');
const RatingsController = require('../../controllers/mongo/RatingsController');

router.use(bodyParser.urlencoded({extended: true}));


router.get('/', (req, res) => {
    res.send({
        version: '0.0.3',
        message: 'MongoDB API'
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