export class OfferPhaseDate {

    caseId: string;
    launchDate: string;
    designReviewDate: string;
    strategyReviewDate: string;
    readinessReviewDate: string;

    constructor(caseId: string, launchDate: string, designReviewDate: string, strategyReviewDate: string, readinessReviewDate: string) {
        this.caseId = caseId;
        this.launchDate = launchDate;
        this.designReviewDate = designReviewDate;
        this.strategyReviewDate = strategyReviewDate;
        this.readinessReviewDate = readinessReviewDate;
    }

}
