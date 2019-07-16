module.exports = function sendError(res, err) {
  res.send(JSON.stringify({
    successful: false,
    err: err,
  }))
}