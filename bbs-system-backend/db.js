/**
 * Initialising MongoDB connection
 */

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Use connect method to connect to the Server
const connection = MongoClient.connect(url);
module.exports = connection;