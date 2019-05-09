
import { Task } from './task';

export interface Ato {

    'itemName': string;
    'itemStatus': string;

    modelTasks: Array<Task>;
    provisionTasks: Array<Task>;

}
