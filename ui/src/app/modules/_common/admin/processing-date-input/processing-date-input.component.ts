import { Component, OnInit } from '@angular/core';
import { RoutingComponentBase } from '../../../../core/base-classes/routing-component-base';
import { AppStore } from '../../../../app/app-store';
import { ActivatedRoute, Router } from '@angular/router';
import { UiUtil } from '../../../../core/services/ui-util';
import { ProcessDateInput } from '../../models/process-date-input';
import { Observable, of } from 'rxjs';
import { ProcessDateInputService } from '../../services/processdateinput.service';
import moment from 'moment';
@Component({
  selector: 'fin-processing-date-input',
  templateUrl: './processing-date-input.component.html',
  styleUrls: ['./processing-date-input.component.scss']
})
export class ProcessingDateInputComponent extends RoutingComponentBase implements OnInit {

  processDateInput = new ProcessDateInput();
  constructor(private store: AppStore,
    private router: Router,
    private route: ActivatedRoute,
    private uiUtil: UiUtil,
    private processDateInputService: ProcessDateInputService) {
    super(store, route);
  }


  isValidDate:any;
  ngOnInit() {
  }

  validateDates(sDate: Date, eDate: Date){
    this.isValidDate = true;
    var startDate = new Date(sDate);
    var startDateYear = startDate.getFullYear();
    var endDate = new Date(eDate);
    var endDateYear = endDate.getFullYear();
    if(moment(sDate, 'MM/DD/YYYY',false).isValid() || moment(eDate, 'MM/DD/YYYY',false).isValid()){
      this.uiUtil.errorDialog('Date is not valid');
    }else if(startDateYear.toString().length>4 || endDateYear.toString().length>4){
      this.uiUtil.errorDialog('Date is not valid');  
    } 
    else if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      //this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDate = false;
      //throw new Error('End date should be grater then start date');

      this.uiUtil.errorDialog('End date should be greater then start date');
    }
    return this.isValidDate;
  }

  save() {

    this.isValidDate = this.validateDates(this.processDateInput.bkgm_process_start_date, this.processDateInput.bkgm_process_end_date);
    if(this.isValidDate){
    this.uiUtil.confirmSave()
      .subscribe(resp => {
        if (resp) {
          let obs: Observable<ProcessDateInput>;
          //if (this.editMode) {
          //obs = this.processDateInputService.update(this.measure);
          //} else {
          obs = this.processDateInputService.add(this.processDateInput);
          //this.uiUtil.genericDialog('This is not a valid scenario as it falls within already inputted range');
          //}
          obs.subscribe(response => {
            if (response.CREATE_OWNER) {
              this.uiUtil.genericDialog('This is not a valid scenario as it falls within already inputted range');
            } else {
              this.uiUtil.toast('Process Dates saved.');
              console.log(response);
            }
          });

        }
      });
  }
}

}
