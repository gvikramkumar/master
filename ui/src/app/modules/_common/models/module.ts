
export class DfaModule {
  id?: string;
  moduleId?: number;
  name: string;
  abbrev: string;
  displayOrder: number;
  status = 'I';
  authorization?: '';

  constructor(status?) {
    this.status = status || 'I';
  }

  setAuthorizations() {

  }

}
