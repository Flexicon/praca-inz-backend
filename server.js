'use strict';

// Load up Express app
const app = require('./app');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Routing
app.get('/', (req, res) => {
    res.send('Docker Backend!');
});

const MongoRouter = require('./routers/mongo/MongoRouter');
app.use('/mongo', MongoRouter);

// Error handler
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send({ message: 'An unexpected error has occurred' });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

