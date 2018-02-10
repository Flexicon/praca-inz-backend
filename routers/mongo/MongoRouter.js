const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const NotesController = require('../../controllers/mongo/NotesController');

router.use(bodyParser.urlencoded({extended: true}));


router.get('/', (req, res) => {
    res.send({
        status: true,
        version: '0.0.2',
        message: 'MongoDB API'
    });
});

// Notes routes
router.route('/notes')
    .get(NotesController.all)
    .post(NotesController.note)
    .put(NotesController.add)
    .delete(NotesController.remove);

module.exports = router;