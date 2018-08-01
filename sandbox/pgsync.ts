import AnyObj from '../shared/models/any-obj';
import * as _ from 'lodash';
import {pgc} from '../server/lib/database/postgres-conn';
import {PgRepo} from './pgrepo';

const repo = new PgRepo();

const dbRecords = [
  { moduleId: 1, name: 'dank'},
  {moduleId: 1, name: 'mary', age: 20},//del
  {moduleId: 1, name: 'carl', age: 60},
  {moduleId: 2, name: 'dank', age: 50},
  {moduleId: 2, name: 'mary', age: 20},
  {moduleId: 2, name: 'carl', age: 60},//del
  {moduleId: 3, name: 'jim', age: 40},
];
dbRecords.forEach(doc => repo.addCreatedByAndUpdatedBy(doc, 'jodoe'));

const mine: AnyObj = [
  {moduleId: 1, name: 'dank', age: 51},//up
  {moduleId: 1, name: 'carl', age: 61},//up
  {moduleId: 2, name: 'dank', age: 51},//up
  {moduleId: 2, name: 'mary', age: 21},//up
  {moduleId: 3, name: 'jim', age: 41},//up
  {moduleId: 3, name: 'casey'},//add
  {moduleId: 4, name: 'goerge', age: 71},//add
  {moduleId: 4, name: 'barney',   age: 38},//add
];
/*
const mine = [
  {moduleId: 1, name: 'dank', age: 51},
  {moduleId: 1, name: 'carl', age: 61},
  {moduleId: 1, name: 'jim', age: 21},
];
*/

  const aa = pgc.promise;
pgc.promise.then(db => {
  console.log('postgres is up');

  repo.removeMany({}, false)
    .then(() => {
      repo.addMany(dbRecords, 'jodoe')
      // repo.addOne(dbRecords[0], 'jodoe')
      .then(() => repo.getMany({}, false))
      .then(dbdocs => {
        mine.forEach((item: AnyObj) => {
          const doc = _.find(dbdocs, {moduleId: item.moduleId, name: item.name});
          if (doc) {
            item.idCol = doc.idCol;
            item.updatedDate = doc.updatedDate;
            // console.log(item.moduleId, item.name, item.updatedDate);
          }
        })
        // return <any> repo.syncRecordsById({}, mine, 'jodoe');
        const predicate = (a, b) => a.moduleId === b.moduleId && a.name === b.name;
        return <any> repo.syncRecordsQueryOne({}, ['moduleId', 'name'], predicate, mine, 'jodoe');
        // return <any> repo.syncRecordsReplaceAll({moduleId: 1}, mine, 'jodoe');
        // return Promise.resolve();
      })
      .then(() => process.exit(0));
  })
    .catch(e => console.error(e));


});


