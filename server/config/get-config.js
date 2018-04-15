const _ = require('lodash'),
  ExtendedError = require('../lib/errors/extended-error');

const node_env = process.env.NODE_ENV || 'development';
let env = null;
const envs = [
  {re: /^dev/, env: 'dev'}, // local machine dev
  {re: /^unit/, env: 'unit'},
  {re: /^sdev/, env: 'sdev'}, // shared server dev
  {re: /^qa/, env: 'qa'},
  {re: /^prod/, env: 'prod'}
];
envs.forEach(x => {
  if (x.re.test(node_env)) {
    env = x.env;
  }
});
if (!env) {
  throw new Error('Bad NODE_ENV value');
}
console.log('NODE_ENV:', env);

const commonConfig = require('./common.js') || {};
const envConfig = require(`./${env}.js`) || {};
const config = _.merge({}, commonConfig, envConfig);
config.env = env;
module.exports = config;
