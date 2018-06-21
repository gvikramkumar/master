import * as _ from 'lodash';

export default function(options) {

  const defaults = {
    mode: 'short' // 'short' or 'long'
  }
  const opts = _.merge(defaults, options);
  return (req, res, next) => {
    const msg = req.method + ' - ' + req.url;
    console.log(msg);
    next();
  }}
