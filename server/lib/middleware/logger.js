const _ = require('lodash');

module.exports = function(options) {

  const defaults = {
    mode: 'short' // 'short' or 'long'
  }
  const opts = _.merge(defaults, options);

  return (req, res, next) => {
    let msg = req.method + ' - ' + req.url;

    if (req.body) {

      if (opts.mode == 'long') {
        msg = msg + req.body.query || req.body.mutation;
      }
      else if (opts.mode === 'short') {
        if (req.body && req.body.query) {
          msg = msg + req.body.query.replace('\n', ' ').substr(0, 30);
        }
        else if (req.body && req.body.mutatation) {
          msg = msg + req.body.mutation.replace('\n', ' ').substr(0, 30);
        }
        else if (req.body) {
          msg = msg + req.body.replace('\n', ' ').substr(0, 30);
        }
      }

      console.log(msg);
    } else {
      console.log(msg);
    }
    next();
  }}
