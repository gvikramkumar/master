export interface PirateShipModule {

    rowNum: number;
    colNum: number;
    status: string;
    readOnly: boolean;
    groupName: string;
    moduleName: string;
    poc: Array<string>;
    dependantModules: Array<string>;


}
