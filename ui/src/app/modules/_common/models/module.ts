
export class DfaModule {
  id?: string;
  moduleId?: number;
  name: string;
  abbrev: string;
  displayOrder: number;
  status = 'I';
  roles?: string;
  desc?: string;
  constructor(status?) {
    this.status = status || 'I';
  }

  setAuthorizations() {

  }

}
