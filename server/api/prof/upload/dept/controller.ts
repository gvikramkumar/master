import {injectable} from 'inversify';
import DeptUploadImport from './import';
import DeptUploadRepo from '../../dept-upload/repo';
import * as _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import DeptUploadDeptTemplate from './dept-template';
import DeptUploadExludeAcctTemplate from './exclude-acct-template';
import {Modules} from '../../../../../shared/enums';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodPgRepo from '../../../common/open-period/repo';
import UserRoleRepo from '../../../../lib/database/repos/user-role-repo';
import PostgresRepo from '../../../../lib/database/repos/postgres-repo';


@injectable()
export default class DeptUploadUploadController extends UploadController {

  constructor(
    repo: DeptUploadRepo,
    openPeriodRepo: OpenPeriodPgRepo,
    submeasureRepo: SubmeasureRepo,
    userRoleRepo: UserRoleRepo,
    private pgRepo: PostgresRepo
  ) {
    super(
      Modules.prof,
      repo,
      openPeriodRepo,
      submeasureRepo,
      userRoleRepo
    );
    this.uploadName = 'Department Upload';
    this.hasTwoSheets = true;
    this.sheet1SubmeasureNames = [];
    this.startedSheet2 = false;

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      nodeValue: 'Node Value',
      glAccount: 'GL Account'
    };
  }

  getValidationAndImportData() {
    this.data = {};
    return Promise.all([
      super.getValidationAndImportData(),
      // pgRepo.getSortedUpperListFromColumn('fpacon.vw_fds_financial_department', 'department_code'),
      // pgRepo.getSortedUpperListFromColumn('fpacon.vw_fds_financial_department', 'company_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fds_financial_account', 'financial_account_code'),
    ])
      .then(results => {
        this.data.glAccounts = results[1];
      });
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
      this.sheet1SubmeasureNames = _.sortBy(_.uniq(this.sheet1SubmeasureNames), _.identity);
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
        return Promise.all([
          this.validateTest(),
          this.lookForErrors('Test Validation Heading')
        ])
    */
    return Promise.resolve();
  }

  getImportArray() {
    // lineup sheet1 by submeasureName, lineup sheet2 by submeasureName and ordered glAccounts
    // for each sheet1 val, insert each sheet2 matching submeasure glAccount

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
        exclusions[dept.submeasureName].forEach(glAccount => {
          imports.push(new DeptUploadImport(
            dept.submeasureName,
            dept.nodeValue,
            glAccount
          ));
        });
      } else {
        imports.push(new DeptUploadImport(
          dept.submeasureName,
          dept.nodeValue.replace('_', '')
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
      const deptCode = Number(arr[1]);
      const companyCode = Number(arr[2]);
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

