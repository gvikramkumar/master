

/*
    name: {type: String, required: true},
    period: Number,
    startTime: String,
    runOnStartup: {type: Boolean, required: true},
    log: {type: Boolean, required: true},
    active: {type: Boolean, required: true},
    primary: {type: Boolean, required: true}, // only runs on primary server

 */
export class DfaJobConfig {
  // properties
  id?: string;
  name: string;
  period?: number;
  startTime?: string;
  runOnStartup: boolean;
  canLog: boolean;
  active: boolean;
  primary: boolean;

  constructor(data) {
    Object.assign(this, data);
  }
}
