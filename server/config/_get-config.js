const base = require('../../node-base'),
  ExtendedError = base.errors.ExtendedError;

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
console.log('node_env', env);
let config, commonConfig, envConfig;
try {
  commonConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/common.json'), 'utf8'));
} catch (e) {
  const msg = 'Failed to parse config file: common.json';
  console.error(msg, e);
  throw new ExtendedError(msg, e);
}
try {
  envConfig = JSON.parse(fs.readFileSync(path.join(__dirname, `config/${env}.json`), 'utf8'));
} catch (e) {
  const msg = `Failed to parse config file: ${env}.json`;
  console.error(msg, e);
  throw new ExtendedError(msg, e);
}
config = _.merge({}, commonConfig, envConfig);
config.env = env;
module.exports = config;
