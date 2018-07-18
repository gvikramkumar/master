import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'fin-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input('trueVal') trueVal: any;
  @Input('falseVal') falseVal: any;
  @Input('model') model;
  @Output('modelChange') modelChange = new EventEmitter<any>();
  bool: boolean;

  constructor() { }

  ngOnInit() {
    this.bool = this.model === this.trueVal;
  }

  change() {
    this.modelChange.emit(this.bool ? this.trueVal : this.falseVal);
    console.log('chk emit', this.bool ? this.trueVal : this.falseVal);
  }
}
