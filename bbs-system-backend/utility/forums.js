const sendError = require('../utility/error');
const MongoClient = require('mongodb').MongoClient;
const insertOneWriteOpResult = require('mongodb').insertOneWriteOpResult;

/**
 * @param {MongoClient} dbs
 * @returns {Promise<insertOneWriteOpResult}
 */
module.exports = function createSubforum(dbs, name, admin, description) {
  return dbs.db('documents') 
  .collection('subforums')
  .insertOne({
    name: name,
    admin: admin,
    posts: [],
    description: description ? description: null,
  })
}