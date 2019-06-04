const ObjectId = require('bson');
const MongoClient = require('mongodb').MongoClient;
const args = process.argv;

const baseUrl = 'http://localhost:4200';
const dbName = args[4];

let uri;
if (args[5] && args[6]) { // user/pass
  uri = `mongodb://${args[5]}:${args[6]}@${args[2]}:${args[3]}`;
} else {
  uri = `mongodb://${args[2]}:${args[3]}`;
}

const client = new MongoClient(uri, {useNewUrlParser: true});

client.connect(function (err) {
  if (err) {
    console.log(`Error connecting to the database: ${dbName}`, err);
  } else {
    console.log(`Connected to database: ${dbName}, adding test data...`);
    const db = client.db(dbName);

    db.collection('dfa_user').insertMany([{
      "roles" : [
        "it administrator"
      ],
      "userId" : "jodoe",
      "fullName" : "John Doe",
      "email" : "jodoe@cisco.com",
      "updatedDate" : new Date("2019-04-14T21:11:26.366Z"),
    }
    ]);
     db.collection('dfa_lookup').findOneAndUpdate({key: 'drivers'},
       {
         $push: {
           value: {
             $each: [
               {
                 "name": "Test Driver 1 - E2ETEST",
                 "value": "E2ETESTDRV1"
               }, {
                 "name": "Test Driver 2 - E2ETEST",
                 "value": "E2ETESTDRV2"
               }
             ]
           }
         }
       });

        db.collection('dfa_lookup').findOneAndUpdate({key: 'periods'},
          {
            $push: {
              value: {
                $each: [
                  {
                    "period": "ROLL7 E2ETEST",
                    "abbrev": "ROLL7"
                  }, {
                    "period": "ROLL8 E2ETEST",
                    "abbrev": "ROLL8"
                  }
                ]
              }
            }
          });

        db.collection('dfa_allocation_rule').insertMany([
          {
            "_id": ObjectId("5cf6e9c16a334e4550e5a472"),
            "name": "E2ETESTDRV1-ROLL7",
            "oldName": "RULE7",
            "desc": "Name:  E2ETESTDRV1-ROLL7\nOld Name:  RULE7\nDriver:  Test Driver 1 - E2ETEST\nPeriod:  ROLL7 E2ETEST",
            "moduleId": 1,
            "activeStatus": "A",
            "status": "A",
            "approvedOnce": "Y",
            "driverName": "E2ETESTDRV1",
            "period": "ROLL7",
            "glSegmentsMatch": [],
            "createdBy": "jodoe",
            "createdDate": new Date("2019-05-01T19:42:44.327Z"),
            "updatedBy": "jodoe",
            "updatedDate": new Date("2019-05-01T19:42:44.327Z"),
            "approvedBy": "jodoe",
            "approvedDate": new Date("2018-12-01T00:11:48.460Z"),
            "approvalReminderTime": new Date("2019-05-09T15:25:05.926Z"),
            "approvalUrl" : `${baseUrl}/prof/rule-management/edit/5cf6e9c16a334e4550e5a472;mode=view`
          },
          {
            "_id": ObjectId("5cf6e9c16a334e4550e5a473"),
            "name": "E2ETESTDRV2-ROLL8",
            "oldName": "RULE8",
            "desc": "Name:  E2ETESTDRV2-ROLL8\nOld Name:  RULE8\nDriver:  Test Driver 2 - E2ETEST\nPeriod:  ROLL8 E2ETEST",
            "moduleId": 1,
            "activeStatus": "A",
            "status": "A",
            "approvedOnce": "Y",
            "driverName": "E2ETESTDRV2",
            "period": "ROLL8",
            "glSegmentsMatch": [],
            "createdBy": "jodoe",
            "createdDate": new Date("2019-05-01T19:42:44.327Z"),
            "updatedBy": "jodoe",
            "updatedDate": new Date("2019-05-01T19:42:44.327Z"),
            "approvedBy": "jodoe",
            "approvedDate": new Date("2018-12-01T00:11:48.460Z"),
            "approvalReminderTime": new Date("2019-05-09T15:25:05.926Z"),
            "approvalUrl" : `${baseUrl}/prof/rule-management/edit/5cf6e9c16a334e4550e5a473;mode=view`
          }
        ]);

        db.collection('dfa_submeasure').insertMany([
          {
            "_id": ObjectId("5cf6e9c16a334e4550e5a474"),
            "submeasureId": 6,
            "submeasureKey": 6,
            "moduleId": 1,
            "name": "2 Tier Adjustment E2ETEST",
            "desc": "2 Tier Adjustment E2ETEST",
            "sourceId": 4,
            "measureId": 1,
            "startFiscalMonth": 201905,
            "endFiscalMonth": 204012,
            "processingTime": "Monthly",
            "pnlnodeGrouping": "Indirect Adjustments",
            "categoryType": "HW",
            "inputFilterLevel": {
              "salesLevel": "LEVEL1",
              "scmsLevel": "SCMS",
              "internalBELevel": "INTERNAL BE",
              "entityLevel": "BE"
            },
            "manualMapping": {},
            "reportingLevels": [
              null,
              "Indirect Revenue Adjustments",
              null
            ],
            "indicators": {
              "dollarUploadFlag": "Y",
              "manualMapping": "N",
              "groupFlag": "N",
              "retainedEarnings": "N",
              "transition": "N",
              "corpRevenue": "Y",
              "dualGaap": "N",
              "twoTier": "N",
              "deptAcct": "N",
              "service": "N",
              "allocationRequired": "N",
              "passThrough": "N"
            },
            "rules": [
              "E2ETESTDRV1-ROLL7",
              "E2ETESTDRV2-ROLL8"
            ],
            "activeStatus": "A",
            "status": "A",
            "approvedOnce": "Y",
            "createdBy": "jodoe",
            "createdDate": new Date("2018-12-01T00:11:48.440Z"),
            "updatedBy": "jodoe",
            "updatedDate": new Date("2018-12-01T00:11:48.450Z"),
            "approvedBy": "jodoe",
            "approvedDate": new Date("2018-12-01T00:11:48.460Z"),
            "approvalReminderTime": new Date("2019-05-09T15:25:05.926Z"),
            "approvalUrl" : `${baseUrl}/prof/submeasure/edit/5cf6e9c16a334e4550e5a474;mode=view`
          },
          {
            "_id": ObjectId("5cf6e9c16a334e4550e5a475"),
            "submeasureId": 7,
            "submeasureKey": 7,
            "moduleId": 1,
            "name": "2 Tier Adjustment2 E2ETEST",
            "desc": "2 Tier Adjustment2 E2ETEST",
            "sourceId": 4,
            "measureId": 1,
            "startFiscalMonth": 201905,
            "endFiscalMonth": 204012,
            "processingTime": "Monthly",
            "pnlnodeGrouping": "Indirect Adjustments",
            "categoryType": "HW",
            "inputFilterLevel": {
              "salesLevel": "LEVEL1",
              "scmsLevel": "SCMS",
              "internalBELevel": "INTERNAL BE",
              "entityLevel": "BE"
            },
            "manualMapping": {},
            "reportingLevels": [
              null,
              "Indirect Revenue Adjustments",
              null
            ],
            "indicators": {
              "dollarUploadFlag": "Y",
              "manualMapping": "N",
              "groupFlag": "N",
              "retainedEarnings": "N",
              "transition": "N",
              "corpRevenue": "Y",
              "dualGaap": "N",
              "twoTier": "N",
              "deptAcct": "N",
              "service": "N",
              "allocationRequired": "N",
              "passThrough": "N"
            },
            "rules": [
              "E2ETESTDRV1-ROLL7",
              "E2ETESTDRV2-ROLL8"
            ],
            "activeStatus": "A",
            "status": "A",
            "approvedOnce": "Y",
            "createdBy": "jodoe",
            "createdDate": new Date("2018-12-01T00:11:48.440Z"),
            "updatedBy": "jodoe",
            "updatedDate": new Date("2018-12-01T00:11:48.450Z"),
            "approvedBy": "jodoe",
            "approvedDate": new Date("2018-12-01T00:11:48.460Z"),
            "approvalReminderTime": new Date("2019-05-09T15:25:05.926Z"),
            "approvalUrl" : `${baseUrl}/prof/submeasure/edit/5cf6e9c16a334e4550e5a475;mode=view`
          },
          {
            "_id" : ObjectId("5ce43d36282898d0c0ce8133"),
            "submeasureId": 3,
            "submeasureKey": 3,
            "moduleId": 2,
            "name": "Submeasure For Module 2 E2ETEST",
            "desc": "Submeasure For Module 2 E2ETEST",
            "sourceId": 4,
            "measureId": 1, // for manual upload
            "startFiscalMonth": 201905,
            "endFiscalMonth": 204012,
            "processingTime": "Monthly",
            "pnlnodeGrouping": "Indirect Adjustments",
            "categoryType": "HW",
            "inputFilterLevel": {
              "salesLevel": "LEVEL1",
              "scmsLevel": "SCMS",
              "internalBELevel": "INTERNAL BE",
              "entityLevel": "BE"
            },
            "manualMapping": {},
            "reportingLevels": [null, "Indirect Revenue Adjustments", null],
            "indicators": {
              "dollarUploadFlag": "Y",
              "manualMapping": "N",
              "groupFlag": 'N',
              "retainedEarnings": 'N',
              "transition": 'N',
              "corpRevenue": 'Y',
              "dualGaap": 'N',
              "twoTier": 'N',
              "deptAcct": 'N',
              "service": 'N',
              "allocationRequired": 'N',
              "passThrough": 'N'
            },
            "rules": [],
            "activeStatus": "A",
            "status": "A",
            "approvedOnce": "Y",
            "createdBy" : "jodoe",
            "createdDate" : new Date("2018-12-01T00:11:48.440Z"),
            "updatedBy" : "jodoe",
            "updatedDate" : new Date("2018-12-01T00:11:48.450Z"),
            "approvedBy" : "jodoe",
            "approvedDate" : new Date("2018-12-01T00:11:48.460Z"),
            "approvalReminderTime" : new Date("2019-05-09T15:25:05.926Z"),
            "approvalUrl" : `${baseUrl}/prof/submeasure/edit/5ce43d36282898d0c0ce8133;mode=view`
          }
        ]);

    client.close().then(err => {
      console.log('>>>>>>>load-test-data-complete');
    });
  }
});



