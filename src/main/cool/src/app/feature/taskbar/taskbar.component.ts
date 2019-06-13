import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { offerBuilderStepsEnum } from '@shared/enums';
import { taskBarNavConstant } from '@shared/constants/taskBarNav.constants';
import { ActionsService } from '@app/services/actions.service';
import { ConfigurationService } from '../../core/services/configuration.service';
import { AccessManagementService } from '@app/services/access-management.service';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.css']
})
export class TaskbarComponent implements OnInit {

  @Input() isDashboard = false;
  @Input() showOfferDtlsBtn = true;
  @Input() isValidToProceed: boolean;
  @Input() pirateShipModuleName: string;
  @Input() isPirateShipSubModule: boolean;
  @Input() selectedATO: string;
  @Input() actionCount: { pendingActionCount: number, needImmediateActionCount: number };
  @Output() newBtnClick = new EventEmitter();
  @Output() onProceedToNext = new EventEmitter();

  caseId: string;
  offerId: string;
  selectedAto: string;

  userName: string;
  userRole: boolean;
  isLastStep: boolean;
  currentStepIndex = 0;
  disableBackBtn = false;

  currentPage = 'dashboard';
  taskBarNavSteps = taskBarNavConstant;
  proceedToOfferSetup: Boolean = true;
  public readShowFlag = false;
  role: string;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private actionsService: ActionsService,
    private configService: ConfigurationService,
    private accesMgmtServ: AccessManagementService
  ) { }


  ngOnInit() {

    this.currentPage = this.router.url.split('/')[1];
    this.caseId = this.activatedRoute.snapshot.params['caseId'];
    this.offerId = this.activatedRoute.snapshot.params['offerId'];

    this.setTaskBar();

    this.accesMgmtServ.sendfunctionalRolRaw
      .subscribe((selectedRole: string) => {

        if (selectedRole.substring(0, 7) === 'COOL - ') {
          this.role = selectedRole.substring(7);
        } else {
          this.role = selectedRole;
        }

        if (this.role) {
          this.accesMgmtServ.sendReadOnlyRoles.subscribe((roles: any) => {
            const CEPMreadOnlyRoles = roles;
            const rolesToUppercase = [];
            for (const item of CEPMreadOnlyRoles) {
              rolesToUppercase.push(item.toUpperCase());
            }
            if (this.role) {
              if (rolesToUppercase.indexOf(this.role.toUpperCase()) !== -1) {
                this.readShowFlag = true;
              } else {
                this.readShowFlag = false;
              }
            }
          });
        }
      });

    this.userName = this.configService.startupData.userName.split(' ')[0];


  }

  setTaskBar() {

    if (this.isPirateShipSubModule) {
      this.currentPage = 'pirate-ship-module';
    } else if (this.currentPage !== 'dashboard' && this.currentPage !== 'action') {
      this.currentStepIndex = offerBuilderStepsEnum[this.currentPage];
      this.disableBackBtn = this.currentStepIndex > 0 ? false : this.offerId ? true : false;
      this.isLastStep = this.currentStepIndex < Object.keys(offerBuilderStepsEnum).length - 1 ? false : true;
    }

    if (this.taskBarNavSteps[this.currentStepIndex].nxtBtnTitle === 'Offer Setup Workflow') {
      this.actionsService.getMilestones(this.caseId).subscribe(data => {

        // Enable offer setup only when Strategy Review is Complete
        data['ideate'].forEach(element => {
          if (element['subMilestone'] === 'Strategy Review' && element['status'] === 'Completed') {
            this.proceedToOfferSetup = false;
          }
        });

      });
    } else {
      this.proceedToOfferSetup = false;
    }

    if (this.taskBarNavSteps[this.currentStepIndex].nxtBtnTitle === 'Readiness Review') {
      this.proceedToOfferSetup = true;
    }
  }

  proceedToNextStep() {
    this.onProceedToNext.emit('true');
  }

  goBack() {
    if (this.currentStepIndex > 0 && this.offerId) {
      const prevPage = offerBuilderStepsEnum[this.currentStepIndex - 1];
      this.router.navigate(['/' + prevPage, this.offerId, this.caseId]);
    } else if (!this.offerId) {
      this.router.navigate(['/dashboard']);
    }
  }

  goToPirateShip() {
    this.router.navigate(['/offerSetup', this.offerId, this.caseId, this.selectedATO]);
  }

  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.offerId, this.caseId]);
  }

}
