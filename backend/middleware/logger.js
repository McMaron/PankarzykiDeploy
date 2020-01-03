const morgan = require('morgan');

// eslint-disable-next-line no-unused-vars
morgan.token('request', function(req, res) {
  const logObj = { body: req.body };
  return JSON.stringify(logObj, null, 2);
});

morgan.token('response', function(req, res) {
  const logObj = { status: res.statusCode, msg: res.statusMessage };
  return JSON.stringify(logObj, null, 2);
});

module.exports = morgan(
  ':method :url :response-time ms\nRequest: :request\nResponse: :response\n' +
    '========================================================',
);
