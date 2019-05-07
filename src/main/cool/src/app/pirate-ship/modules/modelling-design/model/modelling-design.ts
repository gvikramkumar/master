import { Ato } from './ato';

export interface ModellingDesign {

    'action': string;
    'module': string;

    'planId': string;
    'planStatus': string;

    'requestId': string;
    'coolOfferId': string;

    'tasks': Array<Ato>;

}
