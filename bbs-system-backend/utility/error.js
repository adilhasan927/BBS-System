/**
 * Send Http error response.
 * @param {import('express').Response} res
 * @param {number} status
 */
function sendError(res, err='', status=500) {
  res.status(status);
  res.send(JSON.stringify(err));
}

module.exports = sendError;
