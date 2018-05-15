const {Client} = require('pg'),
  config = require('../../config/get-config').postgres;


const client = new Client({
  host: config.host,
  database: config.database,
  port: config.port,
  user: config.user,
  password: config.password
})

const rtn = {pgdb: client};
module.exports = rtn;

rtn.promise = client.connect()
  .then(() => client);

