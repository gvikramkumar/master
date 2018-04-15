
var users = [
  {name: 'dank', age: NumberInt(50)},
  {name: 'carl', age: NumberInt(60)},
  {name: 'jim', age: NumberInt(40)},
]


var conn;
conn = new Mongo();
var db = conn.getDB('dkcrud');
db.users.drop();
db.createCollection('users');

db.users.insertMany(users);

print('db init complete');


