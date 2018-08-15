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
  exportAs: 'finInput',
  templateUrl: './validation-input.component.html',
  styleUrls: ['./validation-input.component.scss']
})
export class ValidationInputComponent {
  validations: InputValidation[] = [];
  opts = new ValidationInputOptions();
  // @Input() form: NgForm;
  @ViewChild('input') input: ElementRef; // HTMLInputElement
  @ViewChild('texta') texta: ElementRef; // HTMLTextAreaElement
  @ViewChild('ngm') ngm: NgModel;
  @Input() name: string;
  @Input() model;
  @Output() modelChange = new EventEmitter();
  @Input() label = '';
  @Input() autocomplete = 'on';
  @Input() autofocus = false;
  @Input() ngModelOptions = {};
  @Input() options: ValidationInputOptions = {};
  @Input() disabled = false;
  @Input() required = false;
  @Input('minlength') minLength = 0;
  @Input('maxlength') maxLength = 5;
  @Input() email = false;
  @Input() pattern: string | RegExp;
  @Input() compressed = false;
  // textarea
  @Input() textarea = false;
  @Input() rows: number;
  @Input() cols: number;
  @Input() debug = false;
  // @Input('maxlength') maxLength: number; // restricts size and validates for textarea

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elemRef: ElementRef,
    public form: NgForm) {
  }

  ngAfterViewInit() {
    if (!this.name) {
      console.error('fin-input: name is required');
      return;
    }

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
    this.addAsteriskToRequiredLabel();
  }

  addAsteriskToRequiredLabel() {
    if (this.required && this.label && this.label[this.label.length - 1] !== '*') {
      this.label += '*';
    }
  }

  ngOnChanges(changes) {
    if (changes.label) {
      this.addAsteriskToRequiredLabel();
    }
  }

  setFocus() {
    const elem = (this.textarea ? this.texta : this.input).nativeElement;
    elem.focus();
  }

}
