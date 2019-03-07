import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CreateOfferService } from '@app/services/create-offer.service';
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

  taskBarNavSteps = taskBarNavConstant;
  subscribedEvents = new Array();
  currentOfferId: string;
  caseId: string;
  currentStepIndex: number = 0;
  disableBackBtn: boolean = false;
  isLastStep: boolean;
  currentPage: string;

  constructor(
    private router: Router,
    private createOfferService: CreateOfferService,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.currentOfferId = this.activatedRoute.snapshot.params["id"];
    this.caseId = this.activatedRoute.snapshot.params['id2'];
    this.setTaskBar(this.router.url.split('/')[1]);
  }

  setTaskBar(currentPage: string) {
    this.currentStepIndex = offerBuilderStepsEnum[currentPage];
    this.disableBackBtn = this.currentStepIndex == 0 && this.currentOfferId ? true : false;
    this.isLastStep = this.currentStepIndex < Object.keys(offerBuilderStepsEnum).length - 1 ? false : true;
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
  createNewOffer() {
    this.createOfferService.disablePrBEList = false;
    this.createOfferService.coolOffer = this.createOfferService.coolOfferCopy;
    this.createOfferService.currenTOffer.next('');
    this.router.navigate(['/coolOffer']);
  }
}
