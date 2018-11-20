import {injector} from '../../../lib/common/inversify.config';
import MappingUploadUploadController from './mapping/controller';
import DeptUploadUploadController from './dept/controller';
import SalesSplitUploadUploadController from './sales-split/controller';
import ProductClassUploadUploadController from './product-class/controller';
import {Router} from 'express';
import {upload} from '../../../lib/middleware/multer';
import DollarUploadUploadController from './dollar/controller';
import AlternateSl2UploadUploadController from './alternate-sl2/controller';

const dollarUploadCtrl = injector.get(DollarUploadUploadController);
const mappingUploadCtrl = injector.get(MappingUploadUploadController);
const deptUploadCtrl = injector.get(DeptUploadUploadController);
const salesSplitUploadCtrl = injector.get(SalesSplitUploadUploadController);
const productClassUploadCtrl = injector.get(ProductClassUploadUploadController);
const alternateSl2UploadCtrl = injector.get(AlternateSl2UploadUploadController);

export const profUploadRouter = Router()
  .post('/dollar-upload', upload.single('fileUploadField'), dollarUploadCtrl.upload.bind(dollarUploadCtrl))
  .post('/mapping-upload', upload.single('fileUploadField'), mappingUploadCtrl.upload.bind(mappingUploadCtrl))
  .post('/dept-upload', upload.single('fileUploadField'), deptUploadCtrl.upload.bind(deptUploadCtrl))
  .post('/sales-split-upload', upload.single('fileUploadField'), salesSplitUploadCtrl.upload.bind(salesSplitUploadCtrl))
  .post('/product-class-upload', upload.single('fileUploadField'), productClassUploadCtrl.upload.bind(productClassUploadCtrl))
  .post('/alternate-sl2-upload', upload.single('fileUploadField'), alternateSl2UploadCtrl.upload.bind(alternateSl2UploadCtrl));
