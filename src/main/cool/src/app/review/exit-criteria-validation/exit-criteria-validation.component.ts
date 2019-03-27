import { Component, OnInit, Input } from '@angular/core';
import { ExitCriteriaValidationService } from '@app/services/exit-criteria-validation.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { HeaderService, UserService, ConfigurationService } from '@shared/services';
import { MessageService } from '@app/services/message.service';

@Component({
  selector: 'app-exit-criteria-validation',
  templateUrl: './exit-criteria-validation.component.html',
  styleUrls: ['./exit-criteria-validation.component.css'],
  providers: [HeaderService]
})

export class ExitCriteriaValidationComponent implements OnInit {
  @Input() stakeData: object;
  @Input() offerBuilderdata;
  currentOfferId;
  currentCaseId;
  exitCriteriaData;
  ideate = [];
  offerOwner: String = '';
  requestApprovalAvailable: Boolean = true;
  readOnly = false;
  approvedOfferId;


  constructor(private activatedRoute: ActivatedRoute,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private headerService: HeaderService,
    private configurationService: ConfigurationService,
    private messageService: MessageService,
    private localStorage: LocalStorageService,
    private userService: UserService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.currentOfferId = params['id'];
      this.currentCaseId = params['id2'];
    });
  }

  ngOnInit() {
    this.approvedOfferId = this.localStorage.retrieve('approvedOfferId');
    if (this.approvedOfferId === this.currentOfferId) {
      this.requestApprovalAvailable = false;
    }
   
    this.readOnly = this.configurationService.startupData.readOnly;
    this.readOnlyMode();
   

    this.exitCriteriaValidationService.getExitCriteriaData(this.currentCaseId).subscribe(data => {
      const canRequestUsers = [];
      this.exitCriteriaData = data;
      this.ideate = data['ideate'];

      for (let i = 0; i < this.ideate.length - 1; i++) {
        if (this.ideate[i]['status'] !== 'Completed') {
          this.requestApprovalAvailable = false;
          break;
        }
      }
      for (let prop in this.stakeData) {
        if (prop === 'Co-Owner' || prop === 'Owner') {
          this.stakeData[prop].forEach(holder => {
            canRequestUsers.push(holder['_id']);
          });
        }
      }

      this.headerService.getCurrentUser().subscribe(user => {
        if (!canRequestUsers.includes(user)) {
          this.requestApprovalAvailable = false;
        }
      });
    });
  }

  actionStatusColor(status) {
    if (status.toLowerCase() === 'completed') {
      return 'GREEN';
    } else if (status.toLowerCase() === 'pending') {
      return 'RED';
    } else {
      return 'grey';
    }
  }

  requestForApproval() {
    const payload = {};
    payload['offerName'] = this.offerBuilderdata['offerName'];
    payload['owner'] = this.offerBuilderdata['offerOwner'];
    const userId = this.userService.getUserId();
    this.exitCriteriaValidationService.updateOwbController(this.currentOfferId, userId).subscribe(data => {
      console.log(data);
    },
      error => {
        console.log('error occured');
      });
    this.exitCriteriaValidationService.requestApproval(this.currentOfferId).subscribe(data => {
      this.exitCriteriaValidationService.postForNewAction(this.currentOfferId, this.currentCaseId, payload).subscribe(response => {
        this.messageService.sendMessage('Strategy Review');
        this.localStorage.store('approvedOfferId', this.currentOfferId);
        this.requestApprovalAvailable = false;
      });
    });
  }
readOnlyMode(){
 if (this.readOnly = false) {
      this.requestApprovalAvailable = true;
    } else {
      this.requestApprovalAvailable = false;
    }
  }
}
