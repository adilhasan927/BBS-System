var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var postRouter = require('./routes/post');
var commentRouter = require('./routes/comment');
var accountRouter = require('./routes/account');
var forumsRouter = require('./routes/forums');
var friendsRouter = require('./routes/friends');
var filesRouter = require('./routes/files');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const corsOptions = {
  origin: '127.0.0.1',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.use(logger('dev'));

//app.use(express.json({ extended: false, limit: '4mb' }));
app.use(express.urlencoded({ extended: false, limit: '4mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// respond with code 204 to favicon requests.
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(function (req, res, next) {
  res.header("Content-Type",'application/json');
  next();
});

app.use('/', indexRouter);
app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/account', accountRouter);
app.use('/api/forums', forumsRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/files', filesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err)
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
