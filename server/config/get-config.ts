import _ from 'lodash';
import commonConfig from './common';
import devConfig from './dev';
import ldevConfig from './ldev';
import prodConfig from './prod';
import stageConfig from './stage';
import sdevConfig from './sdev';
import unitdevConfig from './unitdev';
import unitsdevConfig from './unitsdev';
import unitstageConfig from './unitstage';

const configs = {devConfig, ldevConfig, prodConfig, stageConfig, sdevConfig, unitdevConfig, unitsdevConfig, unitstageConfig};

const node_env = process.env.NODE_ENV || 'development';
let env;
const envs = [
  {re: /^dev/, env: 'dev'}, // local machine dev
  {re: /^ldev/, env: 'ldev'}, // local dev with local pg
  {re: /^unitdev/, env: 'unitdev'},
  {re: /^unitsdev/, env: 'unitsdev'},
  {re: /^unitstage/, env: 'unitstage'},
  {re: /^sdev/, env: 'sdev'}, // shared server dev
  {re: /^stage/, env: 'stage'},
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
console.log('env:', env);

const envConfig = configs[env + 'Config'] || {};
const config = _.merge({}, commonConfig, envConfig);
config.env = env;
export default config;
