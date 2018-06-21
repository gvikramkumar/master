import {injectable} from 'inversify';
import * as _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import ProductClassUploadRepo from '../../product-class-upload/repo';
import ProductClassUploadTemplate from './template';
import ProductClassUploadImport from './import';
import {NamedApiError} from '../../../../lib/common/named-api-error';

@injectable()
export default class ProductClassUploadUploadController extends UploadController {
imports: any[];

  constructor(repo: ProductClassUploadRepo) {
    super(repo);
    this.uploadName = 'Product Classification Upload';

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      splitCategory: 'Split Category',
      splitPercentage: 'Split Percentage'
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData()
    ]);
  }

  validateRow1(row) {
    this.temp = new ProductClassUploadTemplate(row);
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
      this.lookForErrors()
    ])
      .then(() => Promise.all([
        // this.validateMeasureAccess(), // todo: verify you don't need this
        this.validateCanProductClassUpload(),
        this.lookForErrors()
      ]))
      .then(() => Promise.all([
        this.validateSplitCategory(),
        this.validateSplitPercentage(),
        this.lookForErrors()
      ]));
  }

  validate() {
    // sort by submeasureName, add up splitPercentage, error if not 1.0
    this.imports =
      _.sortBy(this.rows1.map(row => new ProductClassUploadImport(row, this.fiscalMonth)), 'submeasureName');
    const obj = {};
    this.imports.forEach(val => {
      if (obj[val.submeasureName]) {
        obj[val.submeasureName] += val.splitPercentage;
      } else {
        obj[val.submeasureName] = val.splitPercentage;
      }
    });
    _.forEach(obj, (val, key) => {
      if (val !== 1.0) {
        this.addError(key, val); // resuse (prop, error) error list for (submeasureName, total)
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Submeasure percentage values not 100%', this.errors));
    }
    return Promise.resolve();
  }

  getImportArray() {
    // we already put the imports together in validate() so just use them
    return Promise.resolve(this.imports);
  }

  validateCanProductClassUpload() {
    if (this.submeasure.indicators.manualMix.toUpperCase() !== 'Y') {
      this.addErrorMessageOnly(`Sub Measure doesn't allow product classification upload`);
    }
    return Promise.resolve();
  }

  validateSplitCategory() {
    if (!this.temp.splitCategory) {
      this.addErrorRequired(this.PropNames.splitCategory);
    } else if (!_.includes(['HARDWARE', 'SOFTWARE'], this.temp.splitCategory.toUpperCase())) {
      this.addErrorInvalid(this.PropNames.splitCategory, this.temp.splitCategory, 'HARDWARE/SOFTWARE');
    }
    return Promise.resolve();
  }

  validateSplitPercentage() {
    if (this.validatePercentageValue(this.PropNames.splitPercentage, this.temp.splitPercentage, true)) {
      this.temp.splitPercentage = Number(this.temp.splitPercentage);
    }
    return Promise.resolve();
  }

}

