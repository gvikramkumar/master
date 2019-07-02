import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@ Component({
  selector: 'fin-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() name: string;
  @Input() label: string;
  @Input() trueVal: any;
  @Input() falseVal: any;
  @Input() model;
  @Output() modelChange = new EventEmitter<any>();
  @Input() disabled;
  @Input() inline = false;
  bool: boolean;

  constructor() { }

  ngOnInit() {
    if (this.trueVal === undefined) {
      this.trueVal = true;
    }
    if (this.falseVal === undefined) {
      this.falseVal = false;
    } else if (this.falseVal === 'undefined') {
      this.falseVal = undefined;
    }
    this.bool = this.model === this.trueVal;
  }

  ngOnChanges(changes) {
    this.bool = this.model === this.trueVal;
  }

  ngAfterViewChecked() {
    this.bool = this.model === this.trueVal;
  }

  change() {
    this.modelChange.emit(this.bool ? this.trueVal : this.falseVal);
  }
}
