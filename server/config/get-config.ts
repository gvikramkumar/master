import * as _ from 'lodash';
import commonConfig from './common';
import devConfig from './dev';
import prodConfig from './prod';
import qaConfig from './qa';
import sdevConfig from './sdev';
import unitConfig from './unit';

const configs = {devConfig, prodConfig, qaConfig, sdevConfig, unitConfig};

const node_env = process.env.NODE_ENV || 'development';
let env;
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

const envConfig = configs[env + 'Config'] || {};
const config = _.merge({}, commonConfig, envConfig);
config.env = env;
export default config;
