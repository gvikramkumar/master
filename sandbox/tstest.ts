


/*
const repo = new OpenPeriodPostgresRepo();

const date = new Date().toISOString();

const one = {
  moduleId: 5,
  fiscalMonth: 201809,
  openFlag: 'Y',
  createdBy: 'system',
  createdDate: date,
  updatedBy: 'system',
  updatedDate: date,
}
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

  try {
    repo.getMany({moduleId: 1, openFlag: 'Y'})
    // repo.getOne({moduleId: 1})
    // repo.addOne(one)
    // repo.addMany([one, two])
    // repo.updateOne(one, {moduleId: 1})
    // repo.deleteAll()
    // repo.deleteMany({moduleId: 1})
    // repo.deleteOne({moduleId: 1})
      .then(docs => {
        console.log(docs);
        process.exit();
      });

  } catch (e) {
    console.log(JSON.stringify(e));
    process.exit(1);
  }







  process.exit();
})
  .catch(err => {
    console.log('postgres is down');
    console.error(err);
    process.exit();
  });



*/
