// eslint-disable-next-line no-unused-vars
module.exports = function(err, req, res, next) {
  console.log(`[App] Global error handler: ${err.stack}`);
  const resp = { code: err.code || 0, info: err.info || 'none', dev: err.dev || 'none' };
  res.status(500).json(resp);
};
