const connection = require('../utility/db');
const verify = require('../utility/verify');
const Message = require('../models/message');
const SocketIOStatic = require('socket.io');
const debounce = require('lodash/debounce');
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
          io.to(socket.id).emit("error", "TokenError");
          loggedIn = false;
        } else {
          loggedIn = true;
          username = val.username;
        }
      }, false)
    })

    socket.on('joinConversation', async (otherUsername, fn) => {
      if (!loggedIn) return;

      socket.leave(currentRoom);
      currentRoom = undefined;

      const dbs = await connection;
      dbs.db('documents')
      .collection('users')
      .find({
        username: username,
        friends: { username: otherUsername }
      })
      .count()
      .then(val => {
        if (val != 1) { throw Error("UserNotFoundError"); }
        currentRoom = ([username, otherUsername].sort()).toString();
        socket.join(currentRoom);
        console.log(`Joined ${currentRoom}`);
        fn();  
      }).catch(err => {
        if (err.message == "UserNotFoundError") {
          io.to(socket.id).emit('error', "UserNotFoundError");
        } else {
          io.to(socket.id).emit('error', "DBError")
        }
      })
    })

    socket.on('getMessages', loc => {
      if (!loggedIn) return;
      console.log(currentRoom, loc);
      getMessages(io, socket, currentRoom, loc);
    })

    socket.on('sendMessage', message => {
      if (!loggedIn) return;
      sendMessage(io, socket, currentRoom, message);
    })

    socket.on('typing', debounce(_ => {
      if (!loggedIn) return;
      socket.broadcast.to(currentRoom).emit('typing');
    }, 1000, { leading: true }))
  })
}

/**
 * Retrieve messages from DB and emit to socket.
 * @param {import('socket.io').Server} io
 * @param {SocketIO.Socket} socket // socket to emit to.
 * @param {string} currentRoom // conversation room user is in.
 * @param {Location} loc // messages to retrieve.
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
        io.to(socket.id).emit('messages', []);
      }
      console.log("Messages fetched from db.");
    }).catch(err => {
      console.log(err);
      io.to(socket.id).emit('error', "DBError");
    })
  })
}

/**
 * Defines a section of the messages list.
 * @class Location
 */
class Location {
  /**
   * @param {number} position // start position, relative to latest message.
   * @param {number} limit // how many messages to retrieve.
   */
  constructor(position, limit) {
    this.position = position;
    this.limit = limit;
  }
}

/**
 * Saves message to DB and sends to users in room.
 * @param {import('socket.io').Server} io
 * @param {string} currentRoom // conversation room user is in.
 * @param {SocketIO.Socket} socket // socket that sent message.
 * @param {Message} message // message to send.
 */
function sendMessage(io, socket, currentRoom, message) {
  message.timestamp = Date.now();
  socket.to(currentRoom).emit('messages', [message]);

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
