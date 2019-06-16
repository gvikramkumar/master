
/*
  {
    host: {type: String, required: true},
    url: {type: String, required: true},
    primary: {type: Boolean, required: true},
    syncing: Boolean,
    uploading: Boolean,
    startupDate: {type: Date, default: new Date()},
    timestamp: {type: Date, default: new Date()}
  },
 */
export class DfaServer {
  id?: string;
  host: string;
  url: string;
  primary: boolean;
  syncing: boolean;
  uploading: boolean;
  startupDate: Date;
  timestamp: Date;

  constructor(data = {}) {
    Object.assign(this, data);
  }
}

