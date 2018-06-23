import {ModelBase} from './model-base';

export class Module extends ModelBase {
  moduleId: number;
  displayOrder: number;
  abbrev: string;
  name: string;
}
