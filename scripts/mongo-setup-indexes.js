conn = new Mongo();
db = conn.getDB('praca_inz');

db.ratings.createIndex({ 'timestamp': -1 });
db.movies.createIndex({ 'title': 1 });
