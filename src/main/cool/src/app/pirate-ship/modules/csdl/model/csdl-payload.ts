export class CsdlPayload {
    offerId: string;
    offerName: string;
    csdlApplicability: string;
    productFamily: string;
    bUContact: string;
    monetizationModel: string;

    constructor( offerId: string,
        offerName: string,
        csdlApplicability: string,
        productFamily: string,
        bUContact: string,
        monetizationModel: string) {
        this.offerId = offerId;
        this.offerName = offerName;
        this.csdlApplicability = csdlApplicability;
        this.productFamily = productFamily;
        this.bUContact = bUContact;
        this.monetizationModel = monetizationModel;
    }
}