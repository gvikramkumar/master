import {injectable} from 'inversify';
import _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import DistiDirectUploadTemplate from './template';
import DistiDirectUploadImport from './import';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import AnyObj from '../../../../../shared/models/any-obj';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import PgLookupRepo from '../../../pg-lookup/repo';
import DistiDirectUploadRepo from '../../disti-direct-upload/repo';
import DatabaseController from '../../../database/controller';
import { SyncMap } from '../../../../../shared/models/sync-map';
@injectable()
export default class DistiDirectUploadUploadController extends UploadController {
  imports: AnyObj[];

  constructor(
    repo: DistiDirectUploadRepo,
    private pgRepo: PgLookupRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo,
    private databaseController: DatabaseController
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
    );
    this.uploadName = 'Disty To Direct Upload';

    this.PropNames = {
      groupId: 'Group ID',
      nodeType: 'Node Type',
      salesFinanceHierarchy: 'Sales Finance Hierarchy',
      nodeCode: 'Node Code'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_fin_sales_theater_hier', 'level03_theater_name'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l3_sales_territory_name_code', 'l1_sales_territory_name_code = \'WW Distribution\''),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'l2_sales_territory_name_code', 'sales_territory_name_code <> \'WW Distribution\''),
    ])
      .then(results => {
        this.data.level03TheaterNames = results[0];
        this.data.distiSL3NodeCodes = results[1];
        this.data.directSL2NodeCodes = results[2];
      });
  }

  validateRow1(row) {
    this.temp = new DistiDirectUploadTemplate(row);
    return Promise.all([
      this.validateGroupId(),
      this.validateNodeType(),
      this.validateSalesFinanceHierarchy(),
      this.validateNodeCodeRequired()
    ])
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        this.validateNodeCode()
      ]))
      .then(() => this.lookForErrors());
  }

  validate() {
    this.imports = this.rows1.map(row => new DistiDirectUploadImport(row, this.fiscalMonth));
    /*
    * groupId has one disti sl3 and one or more direct sl2 (or do separately??)
    * duplicate groupId/nodeType/nodeCode
    * duplicate nodeType/nodeCode
     */
    let obj = {};
    this.imports.forEach((val: DistiDirectUploadImport) => {
      const groupId = _.get(obj, `${val.groupId}`);
      const distiSl3 = val.nodeType === 'Disti SL3';
      const directSl2 = val.nodeType === 'Direct SL2';
      if (groupId) {
        if (distiSl3) {
          groupId.distiSl3++;
        } else if (directSl2) {
          groupId.directSl2++;
        }
      } else {
        _.set(obj, `${val.groupId}`, {distiSl3: distiSl3 ? 1 : 0, directSl2: directSl2 ? 1 : 0});
      }
    });

    _.each(obj, (val, key) => {
      if (val.distiSl3 === 0 || val.directSl2 === 0) {
        this.addErrorMessageOnly(`${key}`);
      }
    })

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Group IDs not having one or more "Disti SL3" and "Direct SL2" nodes', this.errors));
    }

    obj = {};
    this.imports.forEach((val: DistiDirectUploadImport) => {
      const arr = _.get(obj, `${val.groupId.toString()}.${val.nodeType.toUpperCase()}`);
      const entry = val.nodeCode && val.nodeCode.toUpperCase();
      if (arr) {
        if (arr.indexOf(entry) !== -1) {
          this.addErrorMessageOnly(`${val.groupId} / ${val.nodeType} / ${val.nodeCode}`);
        } else {
          arr.push(entry);
        }
      } else {
        _.set(obj, `${val.groupId.toString()}.${val.nodeType.toUpperCase()}`, [entry]);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Duplicate Group ID/Node Type/NodeCode entries in your upload', this.errors));
    }

    obj = {};
    this.imports.forEach((val: DistiDirectUploadImport) => {
      const arr = _.get(obj, `${val.nodeType.toUpperCase()}`);
      const entry = val.nodeCode && val.nodeCode.toUpperCase();
      if (arr) {
        if (arr.indexOf(entry) !== -1) {
          this.addErrorMessageOnly(`${val.nodeType} / ${val.nodeCode}`);
        } else {
          arr.push(entry);
        }
      } else {
        _.set(obj, `${val.nodeType.toUpperCase()}`, [entry]);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Duplicate Node Type/Node Code entries in your upload', this.errors));
    }

    return Promise.resolve();
  }

  getImportArray() {
    // we already put the imports together in validate() so just use them
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports: DistiDirectUploadImport[]) {
    // delete all for that fiscal month, so all then
    return this.repo.removeMany({});
  }

  validateGroupId() {
    if (this.validateNumberValue(this.PropNames.groupId, this.temp.groupId, true)) {
      this.temp.groupId = Number(this.temp.groupId);
    }
    return Promise.resolve();
  }

  validateNodeType() {
    if (!this.temp.nodeType) {
      this.addErrorRequired(this.PropNames.nodeType);
    } else if (this.temp.nodeType.toLowerCase() !== 'disti sl3' && this.temp.nodeType.toLowerCase() !== 'direct sl2') {
      this.addErrorInvalid(this.PropNames.nodeType, this.temp.nodeType);
    }
    return Promise.resolve();
  }

  validateSalesFinanceHierarchy() {
    if (!this.temp.salesFinanceHierarchy) {
      this.addErrorRequired(this.PropNames.salesFinanceHierarchy);
    } else if (this.temp.salesFinanceHierarchy.toLowerCase() !== 'sales fin hierarchy' && this.notExists(this.data.level03TheaterNames, this.temp.salesFinanceHierarchy)) {
      this.addErrorInvalid(this.PropNames.salesFinanceHierarchy, this.temp.salesFinanceHierarchy);
    }
    return Promise.resolve();
  }

  validateNodeCodeRequired() {
    if (!this.temp.nodeCode) {
      this.addErrorRequired(this.PropNames.nodeCode);
    }
    return Promise.resolve();
  }

  validateNodeCode() {
    if (this.temp.nodeType.toLowerCase() === 'disti sl3' && this.notExists(this.data.distiSL3NodeCodes, this.temp.nodeCode)) {
      this.addErrorInvalid(this.PropNames.nodeCode, this.temp.nodeCode);
    } else if (this.temp.nodeType.toLowerCase() === 'direct sl2' && this.notExists(this.data.directSL2NodeCodes, this.temp.nodeCode)) {
      this.addErrorInvalid(this.PropNames.nodeCode, this.temp.nodeCode);
    }
    return Promise.resolve();
  }
  autoSync(req) {
    return this.getImportArray()
      .then(imports => {
        const syncMap = new SyncMap();
        const data = {syncMap};
        return this.databaseController.mongoToPgSyncPromise(req.dfa, data, req.user.id);
      });
  }
}

