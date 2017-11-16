const MongoModels = require('../../models/mongodb-models');

const NotesController = {
    // Retrieve all Notes entities
    all: function (req, res) {
        MongoModels.Note.find(function (err, notes) {
            if (err) {
                res.send({status: false, message: 'An error has occurred while retrieving notes'});
                console.error(err.message);
                return;
            }
            res.send({status: true, notes: notes});
        });
    },
    // Retrieve a single Note entity
    note: function (req, res) {
        MongoModels.Note.findById(req.body.id, function (err, note) {
            if (err || !note) {
                res.send({status: false, message: 'No note found by given id'});
                return;
            }
            res.send({status: true, note});
        });
    },
    // Add new Note
    add: function (req, res) {
        const title = req.body.title, content = req.body.content;

        if (!title || !content) {
            res.send({status: false, message: 'No data passed, saving aborted'});
            return;
        }

        let newNote = new MongoModels.Note({title: title, content: content});

        newNote.save(function (err, note) {
            if (err) {
                res.send({status: false, message: 'An error has occurred while saving'});
                console.error(err.message);
                return;
            }
            res.send({status: true, note});
        });
    },
    // Rome Note from the database
    remove: function (req, res) {
        const id = req.body.id;
        MongoModels.Note.findById(id, function (err, note) {
            if (err || !note) {
                res.send({status: false, message: 'No note found by given id'});
                return;
            }

            note.remove();
            res.send({status: true, message: 'Note removed'});
        });
    }
};

module.exports = NotesController;