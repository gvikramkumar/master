import {injector} from '../../../lib/common/inversify.config';
import MappingUploadUploadController from './mapping/controller';
import DeptUploadUploadController from './dept/controller';
import SalesSplitUploadUploadController from './sales-split/controller';
import ProductClassUploadUploadController from './product-class/controller';
import {Router} from 'express';
import {upload} from '../../../lib/middleware/multer';
import DollarUploadUploadController from './dollar/controller';

const dollarUploadCtrl = injector.get(DollarUploadUploadController);
const mappingUploadCtrl = injector.get(MappingUploadUploadController);
const deptUploadCtrl = injector.get(DeptUploadUploadController);
const salesSplitUploadCtrl = injector.get(SalesSplitUploadUploadController);
const productClassUploadCtrl = injector.get(ProductClassUploadUploadController);

export default Router()
  .post('/dollar', upload.single('fileUploadField'), dollarUploadCtrl.upload.bind(dollarUploadCtrl))
  .post('/mapping', upload.single('fileUploadField'), mappingUploadCtrl.upload.bind(mappingUploadCtrl))
  .post('/dept', upload.single('fileUploadField'), deptUploadCtrl.upload.bind(deptUploadCtrl))
  .post('/sales-split', upload.single('fileUploadField'), salesSplitUploadCtrl.upload.bind(salesSplitUploadCtrl))
  .post('/product-class', upload.single('fileUploadField'), productClassUploadCtrl.upload.bind(productClassUploadCtrl));
