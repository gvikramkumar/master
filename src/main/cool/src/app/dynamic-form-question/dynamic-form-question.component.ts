import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css']
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: any;
  @Input() questionForm: FormGroup;
  @Input() headerName: FormGroup;
  @Input() isLast: any;

  constructor() { }

  ngOnInit() {
    let item = document.getElementById('addDetailsSection');

    console.log(item);

    console.log("isLast", this.isLast);

  }

}
