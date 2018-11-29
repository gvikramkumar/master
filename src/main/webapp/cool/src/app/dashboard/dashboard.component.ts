import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Offer } from '../models/offer';
import { Router } from '@angular/router';
import { CreateOfferService } from '../services/create-offer.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {
  config = {
  };
  recentOfferList:Offer[];
  cols: any[];
  agentSearchInput: string = '';
  myActionsList;
  myOffersList;
  userInfo;
  loggedInUserId;

  constructor(private dashboardService: DashboardService, 
    private router: Router, private createOfferService: CreateOfferService, private userService: UserService) {
    dashboardService.getRecentOffer().subscribe(data => {
      this.recentOfferList = <any>data;
    });
  }

  ngOnInit() {

    this.dashboardService.getMyActionsList()
    .subscribe(data => {
      this.myActionsList = data;
      console.log(this.myActionsList);
    });

    this.dashboardService.getMyOffersList()
      .subscribe(data => {
        this.myOffersList = data;
        console.log(this.myOffersList);
      });

  }

  identify(data){
    console.log(data)
  }

  ddStatus = "";
  flagStatus = false;

  ddProgress = "";
  flagProgress = false;

  ddTaskname = "";
  flagTaskname = false;

  ddStatus2 = "";
  flagStatus2 = false;



  public lineChartData: Array<any> = [
    { data: [0, 20, 10, 50, 40], label: 'Offer Owned' },
    { data: [0, 45, 30, 30, 75], label: 'Offer Co-Owned' }
  ];
  public lineChartLabels: Array<any> = ['Ideate', 'Plan', 'Execute', 'Sustain', 'EOL'];
  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      'position': 'top',
      'display' : true,
      'labels': {
        'boxWidth': 15
      }
    }
  };
  public lineChartColors: Array<any> = [
    { // lightblue
      // backgroundColor: 'rgba(174, 217, 236,0.8)',
      backgroundColor: 'rgba(100, 189, 228,0.8)',
      borderColor: 'rgba(100, 189, 228,0.8)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      //l ineTension : 0
    },
    { // blue
      backgroundColor: 'rgba(100, 189, 228,0.5)',
      borderColor: 'rgba(100, 189, 228,0.5)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
      // lineTension : 0
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';



  chartClicked(event) {

  }

  chartHovered(event) {

  }

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;



  scrollToBottom() {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 200)

  }

  openMM(offerId){
    this.createOfferService.coolOffer.offerId = offerId;
    this.createOfferService.currenTOffer.next(offerId);
    this.router.navigate(['/mmassesment/'+offerId])
  }


}
