
export class DfaModule {
  id?: string;
  moduleId?: number;
  name: string;
  abbrev: string;
  displayOrder: number;
  status: string;

  constructor(status?) {
    this.status = status || 'I';
  }
}
