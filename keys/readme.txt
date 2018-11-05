
need 2 files here:
key.pem
server.crt

or... name them anything else and update ssl section for sdev.ts, stage.ts, or prod.ts, whichever applies

  ssl: {
    key: 'key.pem',
    cert: 'server.crt'
  },

