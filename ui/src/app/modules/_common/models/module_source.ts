
export class ModuleSource {
  moduleId: number;
  sources: number[] = [];
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;

  constructor(moduleId?: number, sources?: number[]) {
    this.moduleId = moduleId;
    this.sources = sources;
  }
}

