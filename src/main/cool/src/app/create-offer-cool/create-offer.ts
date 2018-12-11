export class CreateOffer {
  userId: string;
  offerName: string;
  offerDesc: string;
  primaryBUList: string[];
  primaryBEList: string[];
  secondaryBUList: string;
  secondaryBEList: string;
  strategyReviewDate: string;
  designReviewDate: string;
  readinessReviewDate: string;
  expectedLaunchDate: string;
  offerOwner:string;
  offerCreatedBy:string;
  offerCreationDate:string;

  constructor(userId: string,
              offerOwner:string,
              offerName: string,
              offerDesc: string,
              primaryBUList: string[],
              primaryBEList: string[],
              secondaryBUList: string,
              secondaryBEList: string,
              strategyReviewDate: string,
              designReviewDate: string,
              readinessReviewDate: string,
              expectedLaunchDate: string,
              offerCreatedBy: string,
              offerCreationDate: string) {
    this.userId = userId;
    this.offerOwner = offerOwner;
    this.offerName = offerName;
    this.offerDesc = offerDesc;
    this.primaryBUList = primaryBUList;
    this.primaryBEList = primaryBEList;
    this.secondaryBUList = secondaryBUList;
    this.secondaryBEList = secondaryBEList;
    this.strategyReviewDate = strategyReviewDate;
    this.designReviewDate = designReviewDate;
    this.readinessReviewDate = readinessReviewDate;
    this.expectedLaunchDate = expectedLaunchDate;
    this.offerCreationDate = offerCreationDate;
    this.offerCreatedBy = offerCreatedBy;
  }
}
