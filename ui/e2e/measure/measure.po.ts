import {CommonPO} from '../common.po';
import {browser, by, element, protractor} from 'protractor';

const pageUrl = '/prof/admin/measure';

export class MeasurePO extends CommonPO {
  constructor() {
    super(pageUrl);
  }

 }
