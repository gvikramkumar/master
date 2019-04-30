import * as _ from 'lodash';



class SelectExceptionIndexMap {
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
  sl1Map: SelectExceptionIndexMap[] = [];
  sl2Map: SelectExceptionIndexMap[] = [];
  sl3Map: SelectExceptionIndexMap[] = [];
  tgMap: SelectExceptionIndexMap[] = [];
  buMap: SelectExceptionIndexMap[] = [];
  pfMap: SelectExceptionIndexMap[] = [];
  scmsMap: SelectExceptionIndexMap[] = [];
  ibeMap: SelectExceptionIndexMap[] = [];

  getSelectArray(cond, choices) {
    return ([cond].concat(choices)).map(x => x.toUpperCase());
  }

  getSelectString(prop, cond, choices) {
    const mapArr = this[`${prop}Map`];
    const prefix = prop.toUpperCase();
    if (!cond || !choices.length) {
      return;
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

  parseRules(rules) {
    rules.forEach(rule => {
      const exceptions = rule.name.split('-').filter(x => x.match(/([A-Z]|[1-9])+E\d+/));
      exceptions.forEach(ex => {
        const prefix = ex.substring(0, ex.lastIndexOf('E')).toLowerCase();
        if (!_.includes(['sl1', 'sl2', 'sl3', 'tg', 'bu', 'pf', 'scms', 'ibe'], prefix)) {
          throw new Error(`SelectExceptionMap.parseRules: bad prefix: ${prefix}, exception: ${ex}, name: ${rule.name}`);
        }
        const idx = Number(ex.substring(ex.lastIndexOf('E') + 1));
        if (!idx || _.isNaN(idx)) {
          throw new Error(`SelectExceptionMap.parseRules: bad index: ${idx}, exception: ${ex}, name: ${rule.name}`);
        }
        const map = this[`${prefix}Map`];
        const entry = _.find(map, {index: idx});
        const selectArr = this.getSelectArrayFromRule(prefix, rule);
        if (entry) {
          if (!this.verifyEntryInMapArray(entry, selectArr)) {
            throw new Error(`SelectExceptionMap.parseRuleName: Bad selectArr in ${prefix}Map: ${selectArr}, index: ${idx}`);
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
      default:
        throw Error(`SelectExceptionMap.getSelectArray: no case for prefix: ${prefix} for rule name: ${rule.name}`);
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
