conn = new Mongo();
db = conn.getDB('praca_inz');

db.movies.createIndex({ 'title': 1 });
db.ratings.createIndex({ 'movieId': 1 });
db.ratings.createIndex({ 'timestamp': -1 });
db.tags.createIndex({ 'movieId': 1 });
