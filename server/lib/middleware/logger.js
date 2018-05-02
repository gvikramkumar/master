const _ = require('lodash');

module.exports = function(options) {

  const defaults = {
    mode: 'short' // 'short' or 'long'
  }
  const opts = _.merge(defaults, options);
  return (req, res, next) => {
    let msg = req.method + ' - ' + req.url.substr(0, 40) + '  ';
    console.log(msg);
    next();
  }}
