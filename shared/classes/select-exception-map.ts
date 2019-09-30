import _ from 'lodash';



export class SelectExceptionIndexMap {
  constructor(public selectArr: string[], public index) {
  }
}

export class SelectExceptionMap {
  sl1Idx = 0;
  sl2Idx = 0;
  sl3Idx = 0;
  tgIdx = 0;
  buIdx = 0;
  pfIdx = 0;
  scmsIdx = 0;
  ibeIdx = 0;
  // countryIdx = 0;
  // externalTheaterIdx = 0;
  sl1Map: SelectExceptionIndexMap[] = [];
  sl2Map: SelectExceptionIndexMap[] = [];
  sl3Map: SelectExceptionIndexMap[] = [];
  tgMap: SelectExceptionIndexMap[] = [];
  buMap: SelectExceptionIndexMap[] = [];
  pfMap: SelectExceptionIndexMap[] = [];
  scmsMap: SelectExceptionIndexMap[] = [];
  ibeMap: SelectExceptionIndexMap[] = [];
  // countryMap: SelectExceptionIndexMap[] = [];
  // externalTheaterMap: SelectExceptionIndexMap[] = [];

  getSelectArray(cond, choices) {
    return ([cond].concat(choices)).map(x => x.toUpperCase());
  }

  getSelectString(prop, cond, choices) {
    const mapArr = this[`${prop}Map`];
    const prefix = prop.toUpperCase();
    if (!cond || !choices.length) {
      return '';
    }
    const selectArr = ([cond].concat(choices)).map(x => x.toUpperCase());
    if (!selectArr.length || selectArr.length === 1) {
      throw new Error(`SelectExceptionMap.getSl1SelectString: selectArray with length < 2, ${selectArr.length}`);
    }
    const map = this.findSelectInMapArray(mapArr, selectArr);
    if (map) {
      return `${prefix}E${map.index}`;
    } else {
      mapArr.push(new SelectExceptionIndexMap(selectArr, ++this[`${prop}Idx`]));
      return `${prefix}E${this[`${prop}Idx`]}`;
    }
  }

  getExceptionsFromName(name) {
    return name.split('-').filter(x => x.match(/([A-Z]|[1-9])+E\d+/));
  }

  parseRules(rules) {
    rules.forEach(rule => {
      const exceptions = this.getExceptionsFromName(rule.name);
      exceptions.forEach(ex => {
        const prefix = ex.substring(0, ex.lastIndexOf('E')).toLowerCase();
        if (!_.includes(['sl1', 'sl2', 'sl3', 'tg', 'bu', 'pf', 'scms', 'ibe'], prefix)) {
          throw new Error(`SelectExceptionMap.parseRules: bad prefix, exception: ${ex}, rule name: ${rule.name}`);
        }
        const idx = Number(ex.substring(ex.lastIndexOf('E') + 1));
        const map = this[`${prefix}Map`];
        const entry = _.find(map, {index: idx});
        const selectArr = this.getSelectArrayFromRule(prefix, rule);
        if (entry) {
          if (!this.verifyEntryInMapArray(entry, selectArr)) {
            throw new Error(`Duplicate rule select exception for rule: ${rule.name}, exception: ${ex}.`);
          }
        } else {
          map.push(new SelectExceptionIndexMap(selectArr, idx));
          if (idx > this[`${prefix}Idx`]) {
            this[`${prefix}Idx`] = idx;
          }
        }
      });
    });
  }

  getSelectArrayFromRule(prefix, rule) {
    try {
      switch (prefix) {
        case 'sl1':
          return ([rule.salesSL1CritCond].concat(rule.salesSL1CritChoices)).map(x => x.toUpperCase());
        case 'sl2':
          return ([rule.salesSL2CritCond].concat(rule.salesSL2CritChoices)).map(x => x.toUpperCase());
        case 'sl3':
          return ([rule.salesSL3CritCond].concat(rule.salesSL3CritChoices)).map(x => x.toUpperCase());
        case 'tg':
          return ([rule.prodTGCritCond].concat(rule.prodTGCritChoices)).map(x => x.toUpperCase());
        case 'bu':
          return ([rule.prodBUCritCond].concat(rule.prodBUCritChoices)).map(x => x.toUpperCase());
        case 'pf':
          return ([rule.prodPFCritCond].concat(rule.prodPFCritChoices)).map(x => x.toUpperCase());
        case 'scms':
          return ([rule.scmsCritCond].concat(rule.scmsCritChoices)).map(x => x.toUpperCase());
        case 'ibe':
          return ([rule.beCritCond].concat(rule.beCritChoices)).map(x => x.toUpperCase());
        // case 'country':
        //   return ([rule.countryCritCond].concat(rule.countryCritChoices)).map(x => x.toUpperCase());
        // case 'externalTheater':
        //   return ([rule.externalTheaterCritCond].concat(rule.externalTheaterCritChoices)).map(x => x.toUpperCase());
        default:
          throw Error(`SelectExceptionMap.getSelectArray: no case for prefix: ${prefix} for rule name: ${rule.name}`);
      }
    } catch (err) {
      if (err.message.indexOf('SelectExceptionMap') === 0) {
        throw err;
      }
      throw Error(`SelectExceptionMap.getSelectArray: error buiding selectArray: ${prefix} for rule name: ${rule.name}`);
    }
  }

  verifyEntryInMapArray(entry, selectArr) {
    const bool =  entry.selectArr.length === selectArr.length && _.union(entry.selectArr, selectArr).length === entry.selectArr.length;
    return bool;
  }

  findSelectInMapArray(mapArr, selectArr): SelectExceptionIndexMap {
    if (!mapArr.length) {
      return;
    }
    let found: SelectExceptionIndexMap;
    _.each(mapArr, map => {
      if (map.selectArr.length === selectArr.length && _.union(map.selectArr, selectArr).length === map.selectArr.length) {
        found = map;
        return false; // get out
      }
    });
    return found;
  }



}
