const connection = require('../utility/db');
const verify = require('../utility/verify');
const Message = require('../models/message');
const SocketIOStatic = require('socket.io');

/**
 * @param {SocketIO.Server} io 
 */
function init(io) {
  io.on("connection", socket => {
    var username;
    var loggedIn = false;
    var currentRoom;

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
      
      connection.then(dbs => {
        dbs.db('documents')
        .collection('users')
        .find({ username: { $in: [username, otherUsername] } })
        .count()
        .then(val => {
          if (val != 2) {
            io.to(socket.id).emit('error', 'UserNotFoundError');
            return;
          }
        })
      })
    })

    socket.on('getMessages', loc => {
      if (!loggedIn) return;
      getMessages(io, socket, currentRoom, loc);
    })

    socket.on('sendMessage', message => {
      if (!loggedIn || !currentRoom) return;
      sendMessage(io, socket, currentRoom, message);
    })
  })
}

/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {Location} loc 
 */
function getMessages(io, socket, currentRoom, loc) {
  connection.then(dbs => {
    dbs.db('documents')
    .collection('conversations')
    .aggregate([
      { $match: { room: currentRoom } },
      { $unwind: '$messages' },
      { $replaceRoot: { newRoot: '$messages' }},
      { $sort: { timestamp: -1 } },
      { $skip: loc.position },
      { $limit: loc.limit }
    ])
    .toArray()
    .then(arr => {
      if (arr) {
        io.to(socket.id).emit('messages', arr);
      } else {
        io.to(socket.it).emit('messages', []);
      }
      console.log("Messages fetched from db.");
    }).catch(err => {
      console.log(err);
      io.to(currentRoom).emit('error', err.message);
    })
  })
}

/**
 * @class Location
 */
class Location {
  /**
   * 
   * @param {number} position 
   * @param {number} limit 
   */
  constructor(position, limit) {
    this.position = position;
    this.limit = limit;
  }
}

/**
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {Message} message
 */
function sendMessage(io, socket, currentRoom, message) {
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
      io.to(socket.id).emit('error', "DBError");
    })
  })
}

module.exports = init;
