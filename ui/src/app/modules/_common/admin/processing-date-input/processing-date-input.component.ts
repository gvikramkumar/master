import { Component, OnInit } from '@angular/core';
import { RoutingComponentBase } from '../../../../core/base-classes/routing-component-base';
import { AppStore } from '../../../../app/app-store';
import { ActivatedRoute, Router } from '@angular/router';
import { UiUtil } from '../../../../core/services/ui-util';
import { ProcessDateInput } from '../../models/process-date-input';
import { Observable, of } from 'rxjs';
import { ProcessDateInputService } from '../../services/processdateinput.service';

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



  ngOnInit() {
  }

  save() {
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
