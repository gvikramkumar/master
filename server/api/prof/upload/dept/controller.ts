import {injectable} from 'inversify';
import DeptUploadImport from './import';
import DeptUploadRepo from '../../dept-upload/repo';
import * as _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import DeptUploadDeptTemplate from './dept-template';
import DeptUploadExludeAcctTemplate from './exclude-acct-template';
import SubmeasureRepo from '../../../common/submeasure/repo';
import PgLookupRepo from '../../../pg-lookup/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import AnyObj from '../../../../../shared/models/any-obj';
import {mgc} from '../../../../lib/database/mongoose-conn';


@injectable()
export default class DeptUploadUploadController extends UploadController {
  submeasureMode: boolean;
  submeasureName: string;

  constructor(
    repo: DeptUploadRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo,
    private pgRepo: PgLookupRepo
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
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

  upload(req, res, next) {
    this.submeasureMode = !!req.query.submeasureName;
    this.submeasureName = req.query.submeasureName;
    super.upload(req, res, next);
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_financial_account', 'financial_account_code'),
    ])
      .then(results => {
        this.data.glAccounts = results[0];
      });
  }

  validateRow1(row) {
    this.temp = new DeptUploadDeptTemplate(row);
    this.sheet1SubmeasureNames.push(this.temp.submeasureName);
    return this.getSubmeasure()
      .then(() => this.validateSubmeasure())
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        // this.validateMeasureAccess(),
        this.validateCanDeptUpload()
      ]))
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        this.validateNodeValue()
      ]))
      .then(() => this.lookForErrors());
  }

  validateRow2(row) {
    this.temp = new DeptUploadExludeAcctTemplate(row);
    if (!this.startedSheet2) {
      this.startedSheet2 = true;
      this.sheet1SubmeasureNames = _.sortBy(_.uniq(this.sheet1SubmeasureNames), _.identity);
    }
    return this.getSubmeasure()
      .then(() => this.validateSubmeasure())
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        this.validateSubmeasureNameInSheet1(),
        this.validateGlAccount(),
      ]))
      .then(() => this.lookForErrors());
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
            this.submeasureMode ? 'Y' : 'N',
            glAccount
          ));
        });
      } else {
        imports.push(new DeptUploadImport(
          dept.submeasureName,
          dept.nodeValue,
          this.submeasureMode ? 'Y' : 'N'
        ));
      }
    })

    return Promise.resolve(imports);
  }

  removeDuplicatesFromDatabase(imports: DeptUploadImport[]) {
    if (this.submeasureMode) {
      return this.repo.removeMany({submeasureName: this.submeasureName, temp: 'Y'});
    } else {
      const duplicates = _.uniqWith(imports, (a, b) => a.submeasureName === b.submeasureName && a.nodeValue === b.nodeValue)
        .map(x => _.pick(x, ['submeasureName', 'nodeValue']))
      return this.repo.bulkRemove(duplicates);
    }
  }

  validateSubmeasure() {
    if (this.submeasureMode) {
      // no submeasure if creating, so verify exists and name matches
      if (!this.temp.submeasureName) {
        this.addErrorRequired(this.PropNames.submeasureName);
      }
      if (this.temp.submeasureName !== this.submeasureName) {
        this.addError(this.PropNames.submeasureName, `Sub Measure name doesn't match current name`, this.temp.submeasureName);
      }
      return Promise.resolve();
    } else {
      return super.validateSubmeasure();
    }
  }

  validateCanDeptUpload() {
    // have to be dept upload to upload, no way to check as no submeasure if creating
    if (this.submeasureMode) {
      return Promise.resolve();
    }
    // std cogs adj and mfg overhead measures (2 & 4) AND sm has EXPSSOT MFGO source (#3)
    if (!( (this.submeasure.measureId === 2 || this.submeasure.measureId === 4) && this.submeasure.sourceId === 3) ) {
      this.addErrorMessageOnly(`Sub Measure doesn't allow department upload`);
    }
    return Promise.resolve();
  }

  validateNodeValue() {
    return this.pgRepo.verifyNodeValueInPlOrMgmtHierarchies(this.temp.nodeValue)
      .then(valid => {
        if (!valid) {
          this.addErrorInvalid(this.PropNames.nodeValue, this.temp.nodeValue);
        }
      });
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
      this.addErrorInvalid(this.PropNames.glAccount, this.temp.glAccount, 'Number 60000 - 69999');
    } else if (this.notExists(this.data.glAccounts, glAccount)) {
      this.addErrorInvalid(this.PropNames.glAccount, glAccount);
    }
    return Promise.resolve();
  }

}

