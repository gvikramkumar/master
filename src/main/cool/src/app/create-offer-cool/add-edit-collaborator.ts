export class AddEditCollaborator {
  name: string;
  businessEntity: string;
  functionName: string;

  constructor(name: string, businessEntity: string, functionName: string) {
    this.name = name;
    this.businessEntity = businessEntity;
    this.functionName = functionName;
  }
}
