### fin-dfa4
### Digital Finance Allocation
  
#### database setup
You can either use an existing database:  
 /server/config/env.js will have a mongoUri property each environment will use  
or, initialize a local or remote database

#### initializing a database
<code>npm run seedbat/seedsh</code> will run a shell script that initializes a local or remote database, bat for windows, sh for unix.  
This script depends on host/port/database sent in by the npm script. Another script: npm run seedbatdev/seedshdev will do the same for the shared dev environment (sdev). The shell script uses the sent in host/port/database to run mongo scripts and imports. Another node script runs in the shell script that loads template files into the database. That script relies on the /server/config/env.js mongoUri property. If you're initializing a remote mongodb, the appropriate env.js file (sdev.js for sdev), will have to have the correct mongoUri for that environment.


#### build and run                                     
assume site root unless specified otherwise
1. git clone https://gitscm.cisco.com/scm/it-cvc-ciscocommerce-findfaapp/fin-dfa.git
2. creates a fin-dfa directory >> cd fin-dfa  
3. "npm set registry http://swtg-npm.cisco.com" // change npm registry to point to cisco internal npm registry
4. npm install
5. cd ui
6. npm install (separate install for ui)
7. "npm run uibuildprod" // if not running locally, builds ui to /ui/dist directory for api server to serve along with api
8. npm run seedbat for windows and seedsh for max/linux (creates the fin-dfa database locally) OR npm run seedbatdev/seedshdev for our shared dev database.
9. npm start // starts server on http://localhost:3002 (configurable in server/config/dev.json)
10. cd ui, "ng serve" if running on your own box // starts the ui on http://localhost:4200  
11. enter http://localhost:4200 in the browser to bring the landing page up

#### config
**server config:**  
server config is located in: /server/config, it includes config.json (common to all environment) merged with the environment specific file (dev/sdev/qa/prod/unit.json) which can overwrite or add values to config.json). Dev environment is run by default, the code looks for NODE_ENV that starts with: dev|sdev|qa|prod|unit and uses that config file.  
  
**ui config:**  
ui config is located in /ui/src/environment directory, with dev (default) in environment.ts and all other environments in environment.prod.ts. unit test environment is environment.unit.ts. There will be no difference for sdev/qa/prod as all three will have built the application which runs it out of /ui/dist directory. All 3 will run a single server for api and ui, so all the same then.  
  
**servers:**  
dev/unit: api and ui have separate servers  
sdev/qa/prod: api and ui share the same server.  
  
**mimic production setup**  
 (run same server with ui in minimized code):  
"npm run uibuildprod", this will build and minimize app, place it at /ui/dist directory then just start the server: "npm start" and it will run the api and ui together. Another option is: cd ui >> ng build, which won't minimize and such, but will still place in /ui/dist for running with the same server.




