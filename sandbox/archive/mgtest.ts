
import {mgc} from '../../server/lib/database/mongoose-conn';


mgc.promise.then(({db, mongo}) => {

  db.rules.count()
    .then(c => console.log(c));


});


