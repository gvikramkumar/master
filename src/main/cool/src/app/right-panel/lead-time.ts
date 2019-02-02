export class LeadTime {

    AverageWeeks: number;
    expectedLaunchDate: string;
    noOfWeeksDifference: string;

constructor(expectedLaunchDate:string, noOfWeeksDifference:string) {
    this.expectedLaunchDate = expectedLaunchDate;
    this.noOfWeeksDifference = noOfWeeksDifference;
}

}
