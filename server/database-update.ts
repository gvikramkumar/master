import config from './config/get-config';
import {mgc} from './lib/database/mongoose-conn';
import {ChildProcess} from 'child_process';
import * as fs from 'fs';
import * as Q from 'q';
import * as _ from 'lodash';

export function databaseUpdate() {

  return new Promise((resolve, reject) => {

    let files = fs.readdirSync('../../database/updates').filter(file => /update_\d{1,3}.js/i.test(file));
    files = _.sortBy(files, x => Number(/^.*_(\d{1,3}).js$/i.exec(x)[1]));
    // console.log(files);
    // ChildProcess.exec();
    resolve();
  });

}



