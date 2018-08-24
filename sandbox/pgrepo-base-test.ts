import {PostgresRepoBase} from '../server/lib/base-classes/pg-repo-base';
import {OrmMap} from '../server/lib/base-classes/Orm';
import {pgc} from '../server/lib/database/postgres-conn';
import OpenPeriodPgRepo from '../server/api/common/open-period/pgrepo';

const repo = new OpenPeriodPgRepo();

const date = new Date(1957, 5, 29);

const one = {
  moduleId: 1,
  fiscalMonth: 201809,
  openFlag: 'Y'
}
/*
const one = {
  moduleId: 1,
  fiscalMonth: 201809,
  openFlag: 'Y',
  createdBy: 'systemx',
  createdDate: date,
  updatedBy: 'systemy',
  updatedDate: date,
}
*/
const two = {
  moduleId: 6,
  fiscalMonth: 201810,
  openFlag: 'N',
  createdBy: 'system',
  createdDate: date,
  updatedBy: 'system',
  updatedDate: date,
}


const a = pgc.promise;
pgc.promise.then(db => {
  console.log('postgres is up');

  console.log()


  try {
    // repo.test()
    // repo.getMany()
    // repo.getMany({openFlag: 'Y'})
    // repo.getOne(1, false)
    // repo.addOne(one, 'joedo')
    // repo.addMany([one, two], 'jodoe')
    // repo.updateOne(one, 'jodoe')
    // repo.removeAll()
    // repo.removeMany({moduleId: 6})
    repo.removeOne(1)
      .then(docs => {
        console.log(docs);
        process.exit();
      })
      .catch((e) => {
      console.log(e);
      process.exit(1);
    });

  } catch (e) {
    console.log(JSON.stringify(e));
    process.exit(1);
  }
})
  .catch(err => {
    console.log('postgres is down');
    console.error(err);
    process.exit();
  });



