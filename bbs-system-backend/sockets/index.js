const Message = require('../models/message');
const verify = require('../utility/verify');
const connection = require('../utility/db');

/**
 * @type {Map<string, string>}
 */

/**
 * @param {SocketIO.Server} io 
 */
function init(io) {
  io.on("connection", socket => {
    var username;
    var loggedIn = false;
    var currentRoom;
    var position = 0;
    var limit = 20;

    console.log("a user connected");

    socket.on('listen', token => {
      verify(token, (err, val) => {
        if (err) {
          io.to(socket.id).emit("error", err);
          loggedIn = false;
        } else {
          loggedIn = true;
          username = val.username;
        }
      }, false)
    })

    socket.on('joinConversation', otherUsername => {
      if (!loggedIn || !currentRoom);

      socket.leave(currentRoom);
      currentRoom = ([username, otherUsername].sort()).toString();
      socket.join(currentRoom);
      console.log(`Joined ${currentRoom}`);
      position = 0;
      getMessages();
    })

    socket.on('getMessages', username => {
      if (!loggedIn) return;
      getMessages();
    })

    /**
     * 
     * @param {SocketIO.Socket} io 
     */
    function getMessages() {
      if (!loggedIn || !currentRoom) return;

      connection.then(dbs => {
        dbs.db('documents')
        .collection('conversations')
        .aggregate([
          { $match: { room: currentRoom } },
          { $unwind: '$messages' },
          { $replaceRoot: { newRoot: '$messages' }},
          { $sort: { timestamp: -1 } },
          { $skip: position },
          { $limit: limit }
        ])
        .toArray()
        .then(arr => {
          if (arr) {
            io.to(socket.id).emit('messages', arr);
          } else {
            io.to(socket.it).emit('messages', []);
          }
          position = position + limit;
          console.log("Messages fetched from db.");
        }).catch(err => {
          console.log(err);
          io.to(currentRoom).emit('error', err.message);
        })
      })
    }

    socket.on('sendMessage', message => {
      if (!loggedIn || !currentRoom) return;

      message.timestamp = Date.now();
      io.to(currentRoom).emit('messages', [message]);

      connection.then(dbs => {
        dbs.db('documents')
        .collection('conversations')
        .updateOne({
          room: currentRoom
        }, {
          $push: { messages: message }
        }, { upsert: true }).then(_ => {
          console.log("message added to db.")
        }).catch(err => {
          io.to(socket.id).emit('error', err.message);
        })
      })
    })
  })
}

/**
 * @param {string} a
 * @param {string} b
 */ 

module.exports = init;