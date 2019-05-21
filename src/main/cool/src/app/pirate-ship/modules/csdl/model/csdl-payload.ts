export class CsdlPayload {
  offerId: string;
  offerName: string;
  csdlApplicability: string;
  productFamily: string;
  bUContact: string;
  monetizationModel: string;
  csdlProjectSelected: string;
  offerManagerInformation: string;
  projectId: string;
  projectType: string;
  reason: string;
  csdlActivityStatusAvailable: string;
  stopShipStatus: string;
  enforcementType: string;
  latestUpdatedDate: string;
  csdlOverAllstatus: string;
  history: string;

  constructor(
    offerId: string,
    offerName: string,
    csdlApplicability: string,
    productFamily: string,
    bUContact: string,
    monetizationModel: string,
    csdlProjectSelected: string,
    offerManagerInformation: string,
    projectId: string,
    projectType: string,
    reason: string,
    csdlActivityStatusAvailable: string,
    stopShipStatus: string,
    enforcementType: string,
    latestUpdatedDate: string,
    csdlOverAllstatus: string,
    history: string
  ) {
    this.offerId = offerId;
    this.offerName = offerName;
    this.csdlApplicability = csdlApplicability;
    this.productFamily = productFamily;
    this.bUContact = bUContact;
    this.monetizationModel = monetizationModel;
    this.csdlProjectSelected = csdlProjectSelected;
    this.offerManagerInformation = offerManagerInformation;
    this.projectId = projectId;
    this.projectType = projectType;
    this.reason = reason;
    this.csdlActivityStatusAvailable = csdlActivityStatusAvailable;
    this.stopShipStatus = stopShipStatus;
    this.enforcementType = enforcementType;
    this.latestUpdatedDate = latestUpdatedDate;
    this.csdlOverAllstatus = csdlOverAllstatus;
    this.history = history;
  }
}
