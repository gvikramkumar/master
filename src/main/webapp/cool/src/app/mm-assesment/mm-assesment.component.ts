import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { Subscription } from 'rxjs/Subscription';
import { CreateOfferService } from '../services/create-offer.service';



@Component({
  selector: 'app-mm-assesment',
  templateUrl: './mm-assesment.component.html',
  styleUrls: ['./mm-assesment.component.css']
})
export class MmAssesmentComponent implements OnInit {

  
  public model: any;
  aligned:boolean;
  proceedFlag:boolean=false;
  alignedFlag:boolean =false;
  subscription:Subscription;
  offerData:any;
  currentOfferId;
  bviewDeckData:any[];
  choiceSelected;
  constructor(private router: Router,
              private sharedService:SharedServiceService,
              private createOfferService : CreateOfferService,
              private activatedRoute:ActivatedRoute
  ) { 
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
    });
  }

  ngOnInit() {
     if(this.currentOfferId){
       this.createOfferService.getMMMapperById(this.currentOfferId).subscribe( data =>{
        this.offerData = data;
      })
     }
  }

  tabindex = 0;
  tabView = true;

  

  panels = {
    "panel1": true,
    "panel2": true
  }

  backToOfferPage(){
    this.router.navigate(['/coolOffer/'+this.currentOfferId]);
  }

  setFlagValue() {
    this.tabView = !this.tabView;
  }

  selectMMChoice(choiceName,selectedChoiceArray,failedChoiceArray) {
      if(selectedChoiceArray == null) {
        selectedChoiceArray = Array<string>();
      }
      
      if(selectedChoiceArray.indexOf(choiceName) > -1) {
        var index = selectedChoiceArray.indexOf(choiceName);
        selectedChoiceArray.splice(index, 1); 
      } else {
        selectedChoiceArray.push(choiceName);
      }

      //Removing the failed selected choice from failedArray
      if(failedChoiceArray != null && failedChoiceArray.indexOf(choiceName) > -1) {
        var index = failedChoiceArray.indexOf(choiceName);
        failedChoiceArray.splice(index, 1); 
      }
 
  }

  validateMM() {
      var requestObj = {
        "offerId": this.currentOfferId,
        "mmChoice": 'REVALIDATE',
        "mmId": this.offerData.offerObj.mmId,
        "groups": this.offerData.offerObj.groups
      };

      console.log(requestObj);
      this.createOfferService.postDataofMmMapper(requestObj).subscribe(data=>{

        this.createOfferService.subscribeMMAssessment(data);

      var response = <any> data;

      if(response.status != 'FAILED') {
        this.offerData = data;
      } else {
        alert(response.exception);
      } 

      
     });
    
  }
  
}
