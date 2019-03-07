import { Component, OnInit, Input } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { ActivatedRoute } from '@angular/router';
import { ExitCriteriaValidationService } from 'src/app/services/exit-criteria-validation.service';
import { LocalStorageService } from 'ngx-webstorage';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-design-review-exit-criteria',
  templateUrl: './design-review-exit-criteria.component.html',
  styleUrls: ['./design-review-exit-criteria.component.css'],
  providers: [HeaderService]
})
export class DesignReviewExitCriteriaComponent implements OnInit {
  @Input() stakeData: object;
  @Input() offerBuilderdata;
  currentOfferId;
  currentCaseId;
  exitCriteriaData;
  ideate = [];
  plan = [];
  offerOwner: String = '';
  requestApprovalAvailable: Boolean = true;
  approvedOfferId;

  constructor(private activatedRoute: ActivatedRoute,
    private exitCriteriaValidationService: ExitCriteriaValidationService,
    private headerService: HeaderService,
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

    this.exitCriteriaValidationService.getExitCriteriaData(this.currentCaseId).subscribe(data => {
      const canRequestUsers = [];
      this.exitCriteriaData = data;
      this.ideate = data['ideate'][3];
      this.plan = data['plan'];

      for (let i = 0; i < this.ideate.length-1; i++) {
        if (this.ideate[i]['status'] !== 'Completed') {
          this.requestApprovalAvailable = false;
          break;
        }
      }

      for (let i = 0; i < this.plan.length-1; i++) {
        if (this.plan[i]['status'] !== 'Completed') {
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
    if (status === 'Completed') {
      return 'GREEN';
    } else if (status === 'Not Applicable') {
      return 'GREEN';
    } else if (status === 'pending') {
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
        // this.messageService.sendMessage('Strategy Review');
        this.localStorage.store('approvedOfferId', this.currentOfferId);
        this.requestApprovalAvailable = false;
      });
    });
  }

}
