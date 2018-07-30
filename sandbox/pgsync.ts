import AnyObj from '../shared/models/any-obj';
import * as _ from 'lodash';
import {pgc} from '../server/lib/database/postgres-conn';
import {PgRepo} from './pgrepo';

const repo = new PgRepo();

const dbRecords = [
  {idCol: 1, moduleId: 1, name: 'dank', age: 50},
  {idCol: 2, moduleId: 1, name: 'mary', age: 20},//del
  {idCol: 3, moduleId: 1, name: 'carl', age: 60},
  {idCol: 4, moduleId: 2, name: 'dank', age: 50},
  {idCol: 5, moduleId: 2, name: 'mary', age: 20},
  {idCol: 6, moduleId: 2, name: 'carl', age: 60},//del
  {idCol: 7, moduleId: 3, name: 'jim', age: 40},
];
dbRecords.forEach(doc => repo.addCreatedByAndUpdatedBy(doc, 'jodoe'));

const mine: AnyObj = [
  {idCol: 1, moduleId: 1, name: 'dank', age: 51},//up
  {idCol: 3, moduleId: 1, name: 'carl', age: 61},//up
  {idCol: 4, moduleId: 2, name: 'dank', age: 51},//up
  {idCol: 5, moduleId: 2, name: 'mary', age: 21},//up
  {idCol: 7, moduleId: 3, name: 'jim', age: 41},//up
  {idCol: 10, moduleId: 3, name: 'casey', age: 37},//add
  {idCol: 11, moduleId: 4, name: 'goerge', age: 71},//add
  {idCol: 12, moduleId: 4, name: 'barney', age: 38},//add
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

  repo.removeMany()
    .then(() => {
    repo.addMany(dbRecords, 'jodoe')
      .then(() => repo.getMany({}))
      .then(dbdocs => {
        mine.forEach(item => {
          const doc = _.find(dbdocs, {moduleId: item.moduleId, name: item.name});
          if (doc) {
            // console.log('>>>>>>>', item.idCol, doc.idCol);
            // item.idCol = doc.idCol;
          }
        })
        const predicate = (a, b) => a.moduleId === b.moduleId && a.name === b.name;
        return <any> repo.syncRecords({}, predicate, mine, 'jodoe');
      })
      .then(() => process.exit(0));
  })
    .catch(e => console.error(e));


});


