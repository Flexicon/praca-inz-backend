'use strict';

// Load up Express app
const app = require('./app');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Routing
app.get('/', (req, res) => {
    res.send({
        version: '0.0.1',
        message: 'Praca inz backend'
    });
});

// Mongo routes
const MongoRouter = require('./routers/MongoRouter');
app.use('/mongo', MongoRouter);

// Couch routes
const CouchRouter = require('./routers/CouchRouter');
app.use('/couch', CouchRouter);

// Error handler
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send({ message: 'An unexpected error has occurred', err: err.message });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

