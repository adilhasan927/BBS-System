const sendError = require('../utility/error');
const MongoClient = require('mongodb').MongoClient;
const insertOneWriteOpResult = require('mongodb').insertOneWriteOpResult;

/**
 * @param {Response} res
 * @param {MongoClient} dbs
 * @param {string} name
 * @param {string} admin
 * @returns {Promise<insertOneWriteOpResult}
 */
module.exports = function createSubforum(dbs, name, admin) {
  return dbs.db('documents') 
  .collection('subforums')
  .insertOne({
    name: name,
    admin: admin,
    posts: []
  })
}