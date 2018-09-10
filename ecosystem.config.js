module.exports = {
  apps : [{
    name      : 'fin-dfa',
    script    : 'dist/server/server.js',
    max_memory_restart: '2G',
    max_restarts: 1,
    env: {
      NODE_ENV: 'development'
    },
    env_stage : {
      NODE_ENV: 'stage'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }]
};
