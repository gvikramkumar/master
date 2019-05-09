import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import _ from 'lodash';

@Component({
  selector: 'fin-status-choice',
  templateUrl: './status-choice.component.html',
  styleUrls: ['./status-choice.component.scss']
})
export class StatusChoiceComponent implements OnInit {
  @Input() choices: string[];
  @Output() choiceChange = new EventEmitter();
  choiceArr = [];
  choiceArrTrue = ['A', 'I', 'P', 'D'];
  all = false;

  constructor() { }

  ngOnInit() {
    this.choiceArr[0] = _.includes(this.choices, 'A') ? 'A' : '';
    this.choiceArr[1] = _.includes(this.choices, 'I') ? 'I' : '';
    this.choiceArr[2] = _.includes(this.choices, 'P') ? 'P' : '';
    this.choiceArr[3] = _.includes(this.choices, 'D') ? 'D' : '';
    this.updateAll();
  }

  checkChange() {
    this.choices.splice(0, 4, ...this.choiceArr.filter(x => !!x));
    this.choiceChange.emit();
    this.updateAll();
  }

  updateAll() {
    if (_.uniq(this.choices).length < this.choices.length) {
      throw new Error('StatusChoice: duplicates');
    }
    if (this.choices.length === 4) {
      this.all = true;
    } else {
      this.all = false;
    }
  }

  allChange() {
    this.choiceArr = this.choiceArr.map((x, i) => this.all ? this.choiceArrTrue[i] : '');
    this.checkChange();
  }

}
