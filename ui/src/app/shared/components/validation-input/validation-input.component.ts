import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AsyncValidatorFn, NgForm, NgModel, ValidatorFn, Validators} from '@angular/forms';
import AnyObj from '../../../../../../shared/models/any-obj';

export interface InputValidation {
  name: string;
  message: string;
  fcn: ValidatorFn;
}

export interface InputAsyncValidation {
  name: string;
  message: string;
  fcn: AsyncValidatorFn;
}

export class ValidationInputOptions {
  validations?: InputValidation[] = [];
  asyncValidations?: InputAsyncValidation[] = [];
}

@Component({
  selector: 'fin-input',
  templateUrl: './validation-input.component.html',
  styleUrls: ['./validation-input.component.scss']
})
export class ValidationInputComponent {
  validations: InputValidation[] = [];
  opts = new ValidationInputOptions();
  @Input() form: NgForm;
  @ViewChild('input') input: HTMLInputElement;
  @ViewChild('ngm') ngm: NgModel;
  @Input() name: string;
  @Input() model;
  @Output() modelChange = new EventEmitter();
  @Input() label: string;
  @Input() autocomplete: 'on' | 'off';
  @Input() autofocus: boolean;
  @Input() ngModelOptions;
  @Input() options: ValidationInputOptions;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input('minlength') minLength: number;
  @Input('maxlength') maxLength: number;
  @Input() email: boolean;
  @Input() pattern: string | RegExp;

  constructor(private changeDetectorRef: ChangeDetectorRef, private elemRef: ElementRef) { }

  ngAfterViewInit() {
    Object.assign(this.opts, this.options);

    if (this.required) {
      this.validations.push({name: 'required', message: null, fcn: Validators.required});
    }

    if (this.minLength !== undefined) {
      this.validations.push({
        name: 'minlength',
        message: `Minimum of ${this.minLength} characters required`,
        fcn: Validators.minLength(this.minLength)});
    }

    if (this.maxLength) {
      this.validations.push({
        name: 'maxlength',
        message: `Maximum of ${this.maxLength} characters allowed`,
        fcn: Validators.maxLength(this.maxLength)});
    }

    if (this.email) {
      this.validations.push({
        name: 'email',
        message: `Invalid email address`,
        fcn: Validators.email});
    }

    if (this.pattern) {
      this.validations.push({
        name: 'pattern',
        message: `Invalid pattern address`,
        fcn: Validators.pattern(this.pattern)});
    }

    this.validations = this.validations.concat(this.opts.validations);
    const asyncValidators = this.opts.asyncValidations.map(v => v.fcn);
    if (this.validations.length) {
      this.ngm.control.setValidators(this.validations.map(v => v.fcn));
    }
    if (asyncValidators.length) {
      this.ngm.control.setAsyncValidators(asyncValidators);
    }

    this.changeDetectorRef.detectChanges();
  }

}
