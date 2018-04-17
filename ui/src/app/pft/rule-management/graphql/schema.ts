export interface UpdatePostInterface {
  updatePost: {
    id:string,
    RULE_NAME: string | null,
    PERIOD: string | null,
    DRIVER_NAME: string | null,
    SALES_MATCH: string | null,
    PRODUCT_MATCH: string | null,
    SCMS_MATCH: string | null,
    LEGAL_ENTITY_MATCH: string | null,
    BE_MATCH: string | null,
    SL1_SELECT: string | null,
    SCMS_SELECT: string | null,
    BE_SELECT: string | null,
    CREATED_BY: string | null,
    CREATE_DATE: string | null,
    UPDATED_BY: string | null,
    UPDATE_DATE: string | null
  }
}

export interface DeletePostInterface {
  removePost: {
    id:string,
    RULE_NAME: string | null
  }
}

export interface RulesInterface {
  rules: Array<{
    id: string, //test
    RULE_NAME: string | null,
    PERIOD: string | null,
    DRIVER_NAME: string | null,
    SALES_MATCH: string | null,
    PRODUCT_MATCH: string | null,
    SCMS_MATCH: string | null,
    LEGAL_ENTITY_MATCH: string | null,
    BE_MATCH: string | null,
    SL1_SELECT: string | null,
    SCMS_SELECT: string | null,
    BE_SELECT: string | null,
    CREATED_BY: string | null,
    CREATE_DATE: string | null,
    UPDATED_BY: string | null,
    UPDATE_DATE: string | null
  }> | null;
}

export interface RuleByIdInterface {
    rule:{
      id: string,
      RULE_NAME: string | null,
      PERIOD: string | null,
      DRIVER_NAME: string | null,
      SALES_MATCH: string | null,
      PRODUCT_MATCH: string | null,
      SCMS_MATCH: string | null,
      LEGAL_ENTITY_MATCH: string | null,
      BE_MATCH: string | null,
      SL1_SELECT: string | null,
      SCMS_SELECT: string | null,
      BE_SELECT: string | null,
      CREATED_BY: string | null,
      CREATE_DATE: string | null,
      UPDATED_BY: string | null,
      UPDATE_DATE: string | null
  }
}