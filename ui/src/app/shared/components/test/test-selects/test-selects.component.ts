import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'fin-test-selects',
  templateUrl: './test-selects.component.html',
  styleUrls: ['./test-selects.component.scss']
})
export class TestSelectsComponent implements OnInit {
@ViewChild(NgForm) form;

selectedValue: number;
items = [];
aitems = [
  {name: 'one', value: 1},
  {name: 'two', value: 2},
  {name: 'three', value: 3},
]

  constructor() {
    // this.items = this.aitems;
  }

  ngOnInit() {
    setTimeout(() => {
      this.selectedValue = 3;
    }, 1500);
    setTimeout(() => {
      this.items = this.aitems;
    }, 1000);
  }

  submit() {
    if (this.form.valid) {
      console.log('valid');
    } else {
      console.log('NOT valid');
    }
  }

}
