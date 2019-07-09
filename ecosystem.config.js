module.exports = {
  apps : [{
    name      : 'fin-dfa',
    script    : 'dist/server/server.js',
    // max_memory_restart: '2G',
    max_restarts: 3,
    min_uptime: '10s'
  }]
};
