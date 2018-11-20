import * as _ from 'lodash';
import AnyObj from './any-obj';

export class SyncMap {
  // common
  dfa_data_sources = false;
  dfa_measure = false;
  dfa_module = false;
  dfa_open_period = false;
  dfa_sub_measure = false;
  // module based
  dfa_prof_dept_acct_map_upld = false;
  dfa_prof_input_amnt_upld = false;
  dfa_prof_manual_map_upld = false;
  dfa_prof_sales_split_pctmap_upld = false;
  dfa_prof_scms_triang_altsl2_map_upld = false;
  dfa_prof_scms_triang_corpadj_map_upld = false;
  dfa_prof_swalloc_manualmix_upld = false;

  constructor(data?: AnyObj) {
    if (data) {
      Object.keys(data).forEach(key => this[key] = data[key]);
    }
  }

  setSyncAll(): SyncMap {
    Object.keys(this).forEach(key => {
      this[key] = true;
    });
    return this;
  }

  hasUploadSync() {
    let found = false;
    Object.keys(this).forEach(key => {
      if (/_upld$/.test(key) && this[key]) {
        found = true;
      }
    })
    return found;
  }

  hasSelections() {
    let found = false;
    Object.keys(this).forEach(key => {
      if (this[key]) {
        found = true;
      }
    })
    return found;
  }

}

