const MongoClient = require('mongodb').MongoClient;
const insertOneWriteOpResult = require('mongodb').insertOneWriteOpResult;

/**
 * Add subforum to DB.
 * @param {MongoClient} dbs
 * @returns {Promise<insertOneWriteOpResult}
 */
function createSubforum(dbs, name, admin, description) {
  return dbs.db('documents') 
  .collection('subforums')
  .insertOne({
    name: name,
    admin: admin,
    posts: [],
    description: description ? description: null,
  })
}

module.exports = createSubforum;
