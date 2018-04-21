export interface UpdatePostInterface {
  updatePost: {
    id:string,
    name: string | null,
    period: string | null,
    driverName: string | null,
    salesMatch: string | null,
    productMatch: string | null,
    scmsMatch: string | null,
    legalEntityMatch: string | null,
    beMatch: string | null,
    sl1Select: string | null,
    scmsSelect: string | null,
    beSelect: string | null,
    createdBy: string | null,
    createdDate: string | null,
    updatedBy: string | null,
    updatedDate: string | null
  }
}


export interface DeletePostInterface {
  removePost: {
    id:string,
    name: string | null
  }
}

export interface RulesInterface {
  rules: Array<{
    id: string, //test
    name: string | null,
    period: string | null,
    driverName: string | null,
    salesMatch: string | null,
    productMatch: string | null,
    scmsMatch: string | null,
    legalEntityMatch: string | null,
    beMatch: string | null,
    sl1Select: string | null,
    scmsSelect: string | null,
    beSelect: string | null,
    createdBy: string | null,
    createdDate: string | null,
    updatedBy: string | null,
    updatedDate: string | null
  }> | null;
}

export interface RuleByIdInterface {
    rule:{
      id: string,
      name: string | null,
      period: string | null,
      driverName: string | null,
      salesMatch: string | null,
      productMatch: string | null,
      scmsMatch: string | null,
      legalEntityMatch: string | null,
      beMatch: string | null,
      sl1Select: string | null,
      scmsSelect: string | null,
      beSelect: string | null,
      createdBy: string | null,
      createdDate: string | null,
      updatedBy: string | null,
      updatedDate: string | null
  }
}
