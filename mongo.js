const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;
// you can replace test with any database name that you want
const mongoConnect = (cb) => {
        MongoClient.connect('mongodb://127.0.0.1:27017/web', { useUnifiedTopology: true })
            .then((client) => {
                _db = client.db();
                cb()
                console.log('Connected to MongoDb');
            }).catch((err) => {
                console.log(err);
            });
    }
    //after your server started you can use getDb to access mongo Database
const getDb = () => {
    if (_db) return _db;
    return null;
}



exports.mongoConnect = mongoConnect;
exports.getDb = getDb;