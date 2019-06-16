import {DfaJobConfig} from './job-config';


export type DfaJobFunction = (startup?: boolean, data?, req?) => Promise<any>;

export interface DfaPeriodicJob {
  name: string;
  timerId: number;
}

export interface DfaPeriodicJobInstance {
  job: DfaJobConfig;
  timerId: number;
}
