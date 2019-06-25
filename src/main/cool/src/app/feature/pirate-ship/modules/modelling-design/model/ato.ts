
import { Task } from './task';

export interface Ato {

    'itemName': string;
    'itemStatus': string;
    'owbPunchOut': boolean;
    'modelTasks': Array<Task>;
    'provisionTasks': Array<Task>;

}
