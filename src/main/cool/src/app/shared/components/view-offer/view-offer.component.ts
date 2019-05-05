import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-offer',
  templateUrl: './view-offer.component.html',
  styleUrls: ['./view-offer.component.scss']
})
export class ViewOfferComponent implements OnInit {

  @Input() atoNames: [];
  @Input() selectedAto: string;
  @Output() atoSelection = new Subject<string>();

  constructor(

  ) { }

  ngOnInit() {
  }

  onClick(dropDownValue: string) {
    this.selectedAto = dropDownValue;
    this.atoSelection.next(dropDownValue);
  }

}
