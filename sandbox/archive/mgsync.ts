import {mgc} from '../../server/lib/database/mongoose-conn';
import MgRepo from './mgrepo';
import AnyObj from '../../shared/models/any-obj';
import _ from 'lodash';

const repo = new MgRepo();

const dbRecords = [
  {moduleId: 1, name: 'dank', age: 50},
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
  {moduleId: 3, name: 'casey', age: 37},//add
  {moduleId: 4, name: 'goerge', age: 71},//add
  {moduleId: 4, name: 'barney', age: 38},//add
];
/*
const mine = [
  {moduleId: 1, name: 'dank', age: 51},
  {moduleId: 1, name: 'carl', age: 61},
  {moduleId: 1, name: 'jim', age: 21},
];
*/

  /*
  * test with filter, say by moduleId
  * test with moduleId repo (getmany etc will force a moduleId, but... that may or may not be in the filter
   */



mgc.promise.then(({db, mongo}) => {

  repo.removeMany({})
    .then(() => {
    repo.addMany(dbRecords, 'jodoe')
      .then(() => repo.getMany({}))
      .then(dbdocs => {
        mine.forEach((item: AnyObj) => {
          const doc = _.find(dbdocs, {moduleId: item.moduleId, name: item.name});
          if (doc) {
            item.id = doc.id;
          }
        })
        // return <any> repo.syncRecordsById({}, mine, 'jodoe');
        return <any> repo.syncRecordsQueryOne({}, ['moduleId', 'name'], mine, 'jodoe');
        // return <any> repo.syncRecordsReplaceAll({}, mine, 'jodoe');
        // return Promise.resolve();
      })
      .then(() => process.exit(0));
  })
    .catch(e => console.error(e));


});


