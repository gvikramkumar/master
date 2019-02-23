import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blue',
  templateUrl: './blue.component.html',
  styleUrls: ['./blue.component.css']
})
export class BlueComponent implements OnInit {
  @Input() currentOfferId: string;
  @Input() currentCaseId: string;
  @Output() proceedToNextStep = new EventEmitter<string>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/offerDimension', this.currentOfferId, this.currentCaseId]);
  }
  proceed() {
    this.proceedToNextStep.next('');
  }
  gotoOfferviewDetails() {
    this.router.navigate(['/offerDetailView', this.currentOfferId, this.currentCaseId]);
  }

}
