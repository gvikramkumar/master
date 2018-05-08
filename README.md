## fin-dfa
#### Digital Finance Allocations  
  
### setup
* unix: add to your .bashrc or .bash_profile: "export PATH=./node_modules/.bin:$PATH"  
windows: add to your PATH variable: ".\node_modules\\.bin"  
this makes your node_modules executables available to you if you're in the site root. Npm scripts will do that for you when you run them, say "npm run watch" will run nodemon, but if you tried running nodemon without npm at site route (without this change), it wouldn't find it.
* put mongodb on your machine (unless you're pointing elsewhere, if pointing elsewhere, then you'll have to update the appropriate environment config file in /server/config directory mongoUri property.
                                     
assume site root unless specified otherwise
1. git clone https://gitscm.cisco.com/scm/it-cvc-ciscocommerce-findfaapp/fin-dfa.git
2. creates a fin-dfa directory >> cd fin-dfa  
3. "npm set registry http://swtg-npm.cisco.com" // change npm registry to point to cisco internal npm registry
4. npm install
5. cd ui
6. npm install (separate install for ui)
7. npm run seedbat for windows and seedsh for max/linux (creates the fin-dfa database locally) OR npm run seedbatdev/seedshdev for our shared dev database. I haven't tested mac or either dev versions. Windows version works
8. npm start // starts server on http://localhost:3002 (configurable in server/config/dev.json)
9. cd ui, ng serve // starts the ui on http://localhost:4200
10. enter http://localhost:4200 in the browser to bring the landing page up

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




