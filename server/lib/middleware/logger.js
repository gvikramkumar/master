const _ = require('lodash');

module.exports = function(options) {

  const defaults = {
    mode: 'short' // 'short' or 'long'
  }
  const opts = _.merge(defaults, options);
  const substrLength = 100;
  return (req, res, next) => {
    let msg = req.method + ' - ' + req.url.substr(0, 40) + '  ';

    if (req.body) {
      msg = msg + ' body: ';
      if (opts.mode == 'long') {
        msg = msg + req.body.query.toString() || req.body.mutation.toString();
      }
      else if (opts.mode === 'short') {
        if (req.body && req.body.query) {
          msg = msg + req.body.query.substr(0, substrLength);
        }
        else if (req.body && req.body.mutatation) {
          msg = msg + req.body.mutation.substr(0, substrLength);
        }
        else if (req.body && typeof req.body === 'object') {
          try {
            msg = msg + req.body.substr(0, substrLength);
          } catch (e) {
          }
        }
      }
      // we need all 4 of these replace('\n') calls for some odd reason
      console.log(msg.replace(/\n/g, ' '));
    } else {
      console.log(msg);
    }
    next();
  }}
