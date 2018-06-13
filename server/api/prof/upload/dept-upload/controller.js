const DeptUploadRepo = require('../../dept-upload/repo'),
  DeptUploadDeptTemplate = require('./dept-template'),
  DeptUploadExludeAcctTemplate = require('./exclude-acct-template'),
  DeptUploadImport = require('./import'),
  UploadController = require('../../../../lib/base-classes/upload-controller'),
  _ = require('lodash'),
  Range = require('./range');

const repo = new DeptUploadRepo();

module.exports = class DeptUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Department Upload';
    this.hasTwoSheets = true;
    this.sheet1SubmeasureNames = [];
    this.startedSheet2 = false;

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      nodeValue: 'Node Value',
      glAccount: 'GL Account'
    }
  }

  getValidationAndImportData() {
    this.data = {};
    return Promise.all([
      super.getValidationAndImportData(),
      // pgRepo.getSortedUpperListFromColumn('vw_fds_financial_department', 'department_code'),
      // pgRepo.getSortedUpperListFromColumn('vw_fds_financial_department', 'company_code'),
      // pgRepo.getSortedUpperListFromColumn('vw_fds_financial_account', 'financial_account_code'),
    ])
      .then(results => {
        this.data.userRoles = results[1];
        this.data.submeasures = results[2];
        this.data.department = {
          department_codes: [123], //results[3], //todo: fix this postgres down hack.
          company_codes: [456789] //results[4]
        };
        this.data.glAccounts = [62345, 62346, 62347];// results[5];
      })
  }

  validateRow1(row) {
    this.temp = new DeptUploadDeptTemplate(row);
    this.sheet1SubmeasureNames.push(this.temp.submeasureName);
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
      this.lookForErrors()
    ])
      .then(() => Promise.all([
        this.validateMeasureAccess(),
        this.validateCanDeptUpload(),
        this.lookForErrors()
      ]))
      .then(() => Promise.all([
        this.validateNodeValue(),
        this.lookForErrors()
      ]));
  }

  validateRow2(row) {
    this.temp = new DeptUploadExludeAcctTemplate(row);
    if (!this.startedSheet2) {
      this.startedSheet2 = true;
      this.sheet1SubmeasureNames = _.sortBy(_.uniq(this.sheet1SubmeasureNames), _.identity)
    }
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
      this.lookForErrors()
    ])
      .then(() => Promise.all([
        this.validateSubmeasureNameInSheet1(),
        this.validateGlAccount(),
        this.lookForErrors()
      ]));
  }

  validate() {
    /*
        // example of how to do validate() test results, the heading is passed in to lookForErrors
        // and the this.errors array will produce its error list via {property, error, value?}
        return Promise.all([
          this.validateTest(),
          this.lookForErrors('Test Validation Heading')
        ])
    */
    return Promise.resolve();
  }

  getRangesFromGlAccounts(accts) {
    const ranges = [];

    if (accts.length === 1) {
      const acct = accts[0];
      if (acct === 60000) {
        ranges.push({start: 60001, end: 69999})
      } else if (acct === 69999) {
        ranges.push({start: 60000, end: 69998})
      } else {
        ranges.push({start: 60000, end: acct - 1})
        ranges.push({start: acct + 1, end: 69999})
      }
      ranges[0].acct = acct;
      return ranges;
    }

    accts.forEach((acct, idx) => {

      // if first one
      if (idx === 0) {
        if (acct === 60000) {
        } else {
          ranges.push({start: 60000, end: acct - 1})
        }
      }
      // if last one
      else if (idx + 1 === accts.length) {
        if (acct === 69999) {
          if (accts[idx - 1] === 60000) {
            ranges.push({start: 60001, end: 69998})
          } else {
            ranges.push({start: accts[idx - 1] + 1, end: 69998})
          }
        } else {
          if (accts[idx - 1] === 60000) {
            ranges.push({start: 60001, end: acct - 1})
            ranges.push({start: acct + 1, end: 69999})
          } else {
            ranges.push({start: accts[idx - 1] + 1, end: acct - 1})
            ranges.push({start: acct + 1, end: 69999})
          }
        }
      }
      // middle one
      else {
        // oddly enough, handles the 60000 start case on its own
        ranges.push({start: accts[idx - 1] + 1, end: acct - 1})
      }

    })

    accts.forEach((acct, idx) => {
      ranges[idx].acct = acct;
    })
    return ranges;
  }

  getImportArray() {
    // lineup sheet1 by submeasureName, lineup sheet2 by submeasureName and ordered glAccounts
    // for each sheet1 val, insert each sheet2 matching submeasure glAccount and associated range
    // or 60000 - 69999 if no glAccount, if glAccount, last row will be remainder range with no glAccount
    // submeasure, node, null, 60000, 69999 OR
    // submeasure, node, 60010, 60000, 60009 THEN submeasure, node, null, 60011, 69999
    // with a range per each glAccount given

    const depts = _.sortBy(this.rows1.map(row => new DeptUploadDeptTemplate(row)), 'submeasureName');

    // get all sheet2 into object {submeasureName: arrayOfGlAccounts}
    const exclusions = {};
    const rows2 = _.sortBy(this.rows2.map(row => new DeptUploadExludeAcctTemplate(row)), 'submeasureName');

    rows2.forEach(exclusion => {
      if (exclusions[exclusion.submeasureName]) {
        exclusions[exclusion.submeasureName].push(exclusion.glAccount);
      } else {
        exclusions[exclusion.submeasureName] = [exclusion.glAccount];
      }
    });
    _.forEach(exclusions, (val, key) => exclusions[key] = _.sortBy(val, _.identity));

    const imports = [];

    depts.forEach(dept => {
      if (exclusions[dept.submeasureName]) {
        const ranges = this.getRangesFromGlAccounts(exclusions[dept.submeasureName]);
        ranges.forEach(range => {
          imports.push(new DeptUploadImport(
            dept.submeasureName,
            dept.nodeValue.replace('_', ''),
            range.acct,
            range.start,
            range.end
          ));
        })
      } else {
        imports.push(new DeptUploadImport(
          dept.submeasureName,
          dept.nodeValue.replace('_', ''),
          undefined,
          60000,
          69999
        ));
      }
    })

    return Promise.resolve(imports);
  }

  validateCanDeptUpload() {
    if (this.submeasure.indicators.expenseSSOT.toUpperCase() !== 'Y') {
      this.addErrorMessageOnly(`Sub Measure doesn't allow department upload`);
    }
    return Promise.resolve();
  }

  validateNodeValue() {
    const nodeValue = this.temp.nodeValue;
    const re = /^(\d{3})_(\d{6})$/;

    if (!nodeValue) {
      this.addErrorRequired(this.PropNames.nodeValue);
    } else if (!re.test(this.temp.nodeValue)) {
      this.addErrorInvalid(this.PropNames.nodeValue, this.temp.nodeValue, 'Number string: XXX_XXXXXX');
    } else {
      const arr = this.temp.nodeValue.match(re);
      let deptCode = Number(arr[1]);
      let companyCode = Number(arr[2]);
      if (this.notExists(this.data.department.department_codes, deptCode)) {
        this.addError(this.PropNames.nodeValue, 'Invalid department code', nodeValue);
      }
      if (this.notExists(this.data.department.company_codes, companyCode)) {
        this.addError(this.PropNames.nodeValue, 'Invalid company code', nodeValue);
      }
    }
    return Promise.resolve();
  }

  validateSubmeasureNameInSheet1() {
    if (_.sortedIndexOf(this.sheet1SubmeasureNames, this.temp.submeasureName) === -1) {
      this.addError(this.PropNames.submeasureName, 'No matching submeasure in sheet1', this.temp.submeasureName);
    }
    return Promise.resolve();
  }

  validateGlAccount() {
    const re = /^6\d{4}$/;
    const glAccount = this.temp.glAccount;

    if (!glAccount) {
      this.addErrorRequired(this.PropNames.glAccount);
    } else if (!re.test(this.temp.glAccount)) {
      this.addErrorInvalid(this.PropNames.glAccount, this.temp.glAccount, 'Number 6XXXX');
    } else if (this.notExists(this.data.glAccounts, glAccount)) {
      this.addErrorInvalid(this.PropNames.glAccount, glAccount);
    }
    return Promise.resolve();
  }


}

