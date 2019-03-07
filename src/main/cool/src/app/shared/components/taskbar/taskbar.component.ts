import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ResolveEnd } from '@angular/router';
import { offerBuilderStepsEnum } from '@shared/enums';
import { taskBarNavConstant } from '@shared/constants/taskBarNav.constants';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.css']
})
export class TaskbarComponent implements OnInit {

  @Input() isDashboard: boolean = false;
  @Input() actionCount: { pendingActionCount: number, needImmediateActionCount: number };
  @Input() isValidToProceed: boolean = false;
  @Input() showSave: boolean = false;
  @Input() showOfferDtlsBtn: boolean = true;

  @Output() onProceedToNext = new EventEmitter();
  @Output() newBtnClick = new EventEmitter();

  taskBarNavSteps = taskBarNavConstant;
  subscribedEvents = new Array();
  currentOfferId: string;
  caseId: string;
  currentStepIndex: number = 0;
  disableBackBtn: boolean = false;
  isLastStep: boolean;
  currentPage: string = 'dashboard';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.currentPage = this.router.url.split('/')[1]
    this.currentOfferId = this.activatedRoute.snapshot.params["id"];
    this.caseId = this.activatedRoute.snapshot.params['id2'];
    this.setTaskBar();
  }

  setTaskBar() {
    if(this.currentPage != 'dashboard' && this.currentPage != "action"){
      this.currentStepIndex = offerBuilderStepsEnum[this.currentPage];
      this.disableBackBtn = this.currentStepIndex > 0 ? false : this.currentOfferId ? true : false;
      this.isLastStep = this.currentStepIndex < Object.keys(offerBuilderStepsEnum).length - 1 ? false : true;
    }
  }
  saveCurrentState() {
    this.onProceedToNext.emit('false')
  }
  proceedToNextStep() {
    this.onProceedToNext.emit('true');
  }
  goBack() {
    if (this.currentStepIndex > 0 && this.currentOfferId) {
      const prevPage = offerBuilderStepsEnum[this.currentStepIndex - 1];
      this.router.navigate(['/' + prevPage, this.currentOfferId, this.caseId]);
    } else if (!this.currentOfferId) {
      this.router.navigate(['/dashboard']);
    }
  }

  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.caseId]);
  }
}
