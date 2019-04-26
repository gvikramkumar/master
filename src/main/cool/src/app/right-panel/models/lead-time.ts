export class LeadTime {

    caseId: string;
    launchDate: string;
    AverageWeeks: number;
    designReviewDate: string;
    expectedLaunchDate: string;
    strategyReviewDate: string;
    readinessReviewDate: string;
    noOfWeeksDifference: string;

    constructor(caseId: string, strategyReviewDate: string, readinessReviewDate: string, designReviewDate: string, launchDate: string) {
        this.caseId = caseId;
        this.launchDate = launchDate;
        this.designReviewDate = designReviewDate;
        this.strategyReviewDate = readinessReviewDate;
        this.readinessReviewDate = readinessReviewDate;
    }

}
