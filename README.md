## fin-dfa
#### Digital Finance Allocations  
  
### setup
assume site root unless specified otherwise
1. git clone https://dakahle@gitscm.cisco.com/scm/it-cvc-ciscocommerce-findfaapp/fin-dfa.git
2. creates a fin-dfa directory >> cd fin-dfa
3. npm install
4. cd ui
5. npm install (separate install for ui)
6. npm run seedbat for windows and seedsh for max/linux (creates the fin-dfa database locally) OR npm run seedbatdev/seedshdev for our shared dev database. I haven't tested mac or either dev versions. Windows version works
7. npm start // starts server on http://localhost:3002 (configurable in server/config/dev.json)
8. cd ui, ng serve // starts the ui on http://localhost:4200
9. enter http://localhost:4200 in the browser to bring the landing page up



