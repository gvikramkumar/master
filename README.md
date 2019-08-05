##### fin-dfa
### Digital Finance Allocations
  saggangu
#### build and run                                     
assume site root unless specified otherwise
1. <code>git clone [-b branchName] https://gitscm.cisco.com/scm/it-cvc-ciscocommerce-findfaapp/fin-dfa.git</code>
2. creates a fin-dfa directory >> cd fin-dfa  
3. <code>npm set registry http://swtg-npm.cisco.com</code> // change npm registry to point to cisco internal npm registry
4. npm install
5. /ui: <code>npm install</code> (separate install for ui)
6. <code>npm run seedbat</code> for windows and <code>npm run seedsh</code> for max/linux (creates the fin-dfa database locally) OR <code>npm run seedbatdev/seedshdev</code> for our shared dev database.
7. windows: <code>set POSTRGES_USER=xxx set POSTGRES_PASSWORD=xxx npm start</code> // starts server on http://localhost:3002 (configurable in server/config/dev.json)
8. mac: <code>POSTRGES_USER=xxx POSTGRES_PASSWORD=xxx npm start</code> // starts server on http://localhost:3002 (configurable in server/config/dev.json)
9. linux: <code>NODE_ENV=sdev/qa/prod PORT=xxx POSTRGES_USER=xxx POSTGRES_PASSWORD=xxx npm start</code> // starts server on http://localhost:3002 (configurable in server/config/sdev-qa-prod.json)
10. build server: <code>npm run build</code>
11. UI dual server mode (local only): /ui: <code>ng serve</code> starts the ui server on http://localhost:4200  
12. UI single server mode (sdev/qa/prod):   
/ui:  <code>npm run build-prod</code> builds ui to /ui/dist directory for api server to serve along with api
13. start server: <code>npm start</code>

#### config
**server config:**  
server config is located in: /server/config, it includes config.json (common to all environment) merged with the environment specific file (dev/sdev/qa/prod/unit.json) which can overwrite or add values to config.json). Dev environment is run by default, the code looks for NODE_ENV that starts with: dev|sdev|qa|prod|unit and uses that config file. For postgres the POSTGRES_USER, POSTGRES_PASSWORD environment variables need to be set as well. If postgres is down, you can set NO_POSTGRES environment variable to "true" to bypass the postgres initialization. 
  
**ui config:**  
ui config is located in /ui/src/environment directory, with dev (default) in environment.ts and all other environments in environment.prod.ts. unit test environment is environment.unitdev.ts. There will be no difference for sdev/qa/prod as all three will have built the application which runs it out of /ui/dist directory. All 3 will run a single server for api and ui, so all the same then.
  
#### database setup
You can either use an existing database:  
 /server/config/env.js will have a mongo.uri property each environment will use or, initialize a local or remote database

##### initializing a database
<code>npm run seedbat/seedsh</code> will run a shell script that initializes a local or remote database, bat for windows, sh for unix.  
This script depends on host/port/database sent in by the npm script. Another script: npm run seedbatdev/seedshdev will do the same for the shared dev environment (sdev). The shell script uses the sent in host/port/database to run mongo scripts and imports. 


#### webstorm
we need two node runners to debug the server and tests  

##### serve  
node runner:  
**working directory:** somepath/fin-dfa/dist/server  
**javascript file:** server.js  
**environment variables:** POSTGRES_USER, POSTGRES_PASSWORD  
** use with <code>npm run build</code>

##### test
node runner:  
**working directory:** somepath/fin-dfa  
**javascript file:** node_modules/jasmine/bin/jasmine.js  
**environment variabls:** NODE_ENV=unit (for e2e tests when we have a unit testing database)  
** use with <code>npm run watch</code>



