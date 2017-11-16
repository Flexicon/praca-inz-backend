'use strict';

// Load up Express app
const app = require('./app');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Routing
app.get('/', (req, res) => {
    res.send('Hello Docker!');
});

const MongoRouter = require('./routers/mongo/MongoRouter');
app.use('/mongo', MongoRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

