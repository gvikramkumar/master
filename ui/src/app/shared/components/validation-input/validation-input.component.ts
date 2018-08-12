import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
  @Input('name') name: string;
  @Input('model') model;
  @Output('modelChange') modelChange = new EventEmitter();
  @Input('label') label: string;
  @Input ('autocomplete') autocomplete: string;
  @Input('ngModelOptions') ngModelOptions;
  @Input('options') options: ValidationInputOptions;
  @Input('disabled') disabled: boolean;
  @Input ('required') required: boolean;
  @Input ('minlength') minLength: number;
  @Input ('maxlength') maxLength: number;
  @Input ('email') email: boolean;
  @Input ('pattern') pattern: string | RegExp;
  @Input('form') form: NgForm;
  @ViewChild('ngm') ngm: NgModel;
  opts = new ValidationInputOptions();

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

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
