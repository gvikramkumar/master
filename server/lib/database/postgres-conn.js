const {Client} = require('pg'),
  config = require('../../config/get-config').postgres;


const client = new Client({
  host: config.host,
  database: config.database,
  port: config.port,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
})

const rtn = {pgdb: client};
module.exports = rtn;

if (process.env.NO_POSTGRES) {
  rtn.promise = Promise.resolve()
    .then(() => {
      console.log(`POSTGRES NOT CONNECTED, USING NO_POSTGRES ENV VAR`);
      rtn.pgdb = undefined;
      return undefined;
    });
} else {
  rtn.promise = client.connect()
    .then(() => {
      console.log(`postgres connected on: ${config.host}:${config.port}/${config.database}`)
      return client;
    });
}


