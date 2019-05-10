const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.dfa_submeasure.updateOne({name: "2 Tier Adjustment"}, {$set: {
    approvalUrl : 'http://localhost:4200/prof/submeasure/edit/5cd5c201b2db8208c0cb4c2f;mode=view',
    approvalReminderTime : ISODate("2019-05-09T15:25:05.926Z"),
    status: 'P'
  }});
print('>>>>>>>>>> post-data-load-khizer complete');
