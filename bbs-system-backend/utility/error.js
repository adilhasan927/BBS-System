/**
 * @param {Response} res
 * @param {number} status
 */
module.exports = function sendError(res, err, status=500) {
  res.status(status);
  res.send(JSON.stringify(err));
}