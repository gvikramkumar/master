import { Component, OnInit,Input } from '@angular/core';
import { OfferPhaseService } from '../services/offer-phase.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import  {TurbotaxService} from '../services/turbotax.service';
import { MenuBarService } from '../services/menu-bar.service'
@Component({
  selector: 'app-turbotaxview',
  templateUrl: './turbotaxview.component.html',
  styleUrls: ['./turbotaxview.component.css']
})
export class TurbotaxviewComponent implements OnInit {
  @Input() caseId:string

  public mStoneCntInAllPhases:any[]=['ideate','plan','execute','launch'];
  
  public mileStoneStatus:any[]= [];
  public currentOfferId:any;
 // public caseId:any;
  public offerPhaseDetailsList:any;
  public phaseProcessingCompleted = false;


  constructor( private offerPhaseService: OfferPhaseService,private menuBarService:MenuBarService,
    private activatedRoute: ActivatedRoute,private turbotax:TurbotaxService) {
      // this.activatedRoute.params.subscribe(params => {
      //   this.currentOfferId = 'COOL_101';
      //   this.caseId = 'CASE-0000000151';
      // });
      // if (!this.currentOfferId) {
      //  this.currentOfferId = this.createOfferService.coolOffer.offerId;
      // }
      // this.offerPhaseDetailsList = this.activatedRoute.snapshot.data['offerData'];
     // console.log("turbotax caseId",this.caseId);

   }

  ngOnInit() {
    console.log("actionCaseId",this.caseId);
    //  this.turbotax.getTurboTaxDetails().subscribe(data=>{
    //    if(data){
    //    console.log("turbotaxData",data);
    //    } else{
    //     console.log("nodata");
    //    }
    //  })
   // console.log("turbotax caseId",this.caseId);
   this.menuBarService.getRubboTaxMenu(this.caseId).subscribe(data=>{
    this.offerPhaseDetailsList = data;
    console.log("teuboTaxDetails",data);
  })

  this.offerPhaseService.getCurrentOfferPhaseInfo(this.caseId).subscribe(data => {
    this.processCurrentPhaseInfo(data);
});

  }


 
  


  processCurrentPhaseInfo(phaseInfo) {
    this.mStoneCntInAllPhases.forEach(element => {
      const obj = {};
      let count = 0;
      const phase = phaseInfo[element];
        if (phase !== undefined) {
          phase.forEach(element => {
            if(element.status === 'Completed') {
              count = count + 1;
            }
          });
          obj['phase'] = element;
          if ( count > 0 && count < 4) {
            obj['status'] = 'active';
          } else if ( count === 4) {
            obj['status'] = 'visited';
          } else if (count === 0) {
            obj['status'] = '';
          }
        } else {
          obj['phase'] = element;
          obj['status'] = '';
        }
        this.mileStoneStatus.push(obj);
    });
    this.phaseProcessingCompleted = true;
  }


}
