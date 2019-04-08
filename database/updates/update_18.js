
print('host: ' + host + ', port: ' + port + ', db: ' + _db);

const conn = new Mongo(host + ':' + port);
const db = conn.getDB(_db);
db.auth(username, password);

db.dfa_lookup.updateOne({key:'drivers'}, {$set: {value:  [
      {
        "name" : "Software POS Revenue",
        "value" : "POSREVSW"
      },
      {
        "name" : "Svc Channel Revenue",
        "value" : "MSCP"
      },
      {
        "name" : "Shipped Revenue",
        "value" : "SHIPREV"
      },
      {
        "name" : "POS Revenue",
        "value" : "REVPOS"
      },
      {
        "name" : "Partner Dev Fund",
        "value" : "PDF"
      },
      {
        "name" : "Gross Revenue CMDM",
        "value" : "GLREV"
      },
      {
        "name" : "Legacy Driver",
        "value" : "LEGACYDRVR"
      },
      {
        "name" : "2T Subscription Revenue",
        "value" : "2TSUBDIR"
      },
      {
        "name" : "Net Revenue",
        "value" : "GLREVMIX"
      },
      {
        "name" : "Shipment",
        "value" : "SHIPMENT"
      },
      {
        "name" : "Remarketing Revenue",
        "value" : "REMKTREV"
      },
      {
        "name" : "VIP Rebate",
        "value" : "VIP"
      },
      {
        "name" : "POS Revenue Disty",
        "value" : "REVPOSDIS"
      },
      {
        "name" : "Svc Map",
        "value" : "SERVMAP"
      },
      {
        "name" : "Svc Sales Split PCT Map",
        "value" : "SERVSLSMAP"
      },
      {
        "name" : "Svc Training Split PCT Map",
        "value" : "SERVTRNMAP"
      },
      {
        "name" : "Svc Revenue",
        "value" : "SVCREVT3"
      },
      {
        "name" : "Def POS Revenue SW",
        "value" : "DRPOSREVSW"
      },
      {
        "name" : "Def Shipment",
        "value" : "DRSHIPMENT"
      },
      {
        "name" : "Def Ship Revenue SW",
        "value" : "DRSHPREVSW"
      },
      {
        "name" : "Default Driver DO NOT USE",
        "value" : "DEFAULT"
      },
      {
        "name" : "Shipped Revenue with POS Adj",
        "value" : "SHREVPOS"
      }
    ]}});

db.dfa_lookup.updateOne({key:'periods'}, {$set: {value:  [
      {
        "period" : "MTD"
      },
      {
        "period" : "QTD"
      },
      {
        "period" : "ROLL3"
      },
      {
        "period" : "ROLL6"
      },
      {
        "period" : "PRIOR ROLL3",
        "abbrev" : "PROLL3"
      },
      {
        "period" : "PRIOR ROLL6",
        "abbrev" : "PROLL6"
      },
      {
        "period" : "PERCENT",
        "abbrev" : "PCT"
      }
    ]}});

