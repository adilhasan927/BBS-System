const Message = require('../models/message');
const verify = require('../utility/verify');
const connection = require('../utility/db');

/**
 * @type {Map<string, string>}
 */
const users = new Map();

/**
 * @param {SocketIO.Server} io 
 */
function init(io) {
  io.on("connection", socket => {
    console.log("a user connected");

    var username;
    var loggedIn = false;
    /**
     * @param {string} token
     */
    socket.on('listen', token => {
      verify(token, (err, val) => {
        if (err) {
          io.to(socket.id).emit("error", err);
          socket.disconnect();
        } else {
          username = val.username;
          users.set(username, socket.id);

          connection.then(dbs => {
            dbs.db('documents')
            .collection('users')
            .findOne({ username: username })
            .then(val => {
              io.to(users.get(username)).emit('messages', val.inbox);
              console.log("messages fetched from db.");
            }).catch(err => {
              io.to(users.get(username)).emit('error', err.message);
            })
          })
        }
      }, false)
    })

    /**
     * @param {Message} message
     */
    socket.on('sendMessage', message => {
      if (!loggedIn) return;

      io.to(users.get(message.to)).emit('messages', message);
      io.to(users.get(username)).emit('messages', message);

      connection.then(dbs => {
        dbs.db('documents')
        .collection('users')
        .updateOne({
          username: message.to
        }, {
          $push: { inbox: message }
        }).then(_ => {
          console.log("message added to db.")
        }).catch(err => {
          io.to(users.get(username)).emit('error', err.message);
        })
      })
    })
  })
}

module.exports = init;