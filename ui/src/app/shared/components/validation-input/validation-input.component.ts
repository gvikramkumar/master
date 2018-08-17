import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, forwardRef,
  Input,
  OnInit, Optional,
  Output,
  Renderer2, Self,
  ViewChild
} from '@angular/core';
import {
  AsyncValidatorFn,
  ControlValueAccessor, FormControl,
  NG_VALUE_ACCESSOR, NgControl,
  NgForm,
  NgModel,
  ValidatorFn,
  Validators
} from '@angular/forms';
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
export class ValidationInputComponent implements ControlValueAccessor {
  validations: InputValidation[] = [];
  opts = new ValidationInputOptions();
  value;
  // @Input() form: NgForm;
  @ViewChild('input') input: ElementRef; // HTMLInputElement
  @Input() options: ValidationInputOptions = {};
  @Input() debug = false;
  @Input() id: string;
  @Input() name: string;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Input() autofocus = false;
  @Input() ngModelOptions: AnyObj = {};
  @Input() disabled = false;
  @Input() required = false;
  @Input() minLength = 0;
  @Input() maxLength = 10000;
  @Input() email = false;
  @Input() pattern: string | RegExp;
  @Input() compressed = false;
  @Input() stringToArray = false; // you have an array in model and comma sep values in textbox
  // textarea
  @Input() textarea = false;
  @Input() rows: number;
  @Input() cols: number;

  // @Input('maxlength') maxLength: number; // restricts size and validates for textarea

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elemRef: ElementRef,
    private renderer: Renderer2,
    public form: NgForm,
    @Self() public ngm: NgModel
    ) {

    // Note: we provide the value accessor through here, instead of
    // the `providers` to avoid running into a circular import.
    this.ngm.valueAccessor = this;

  }

  // ControlValueAccessor interface
  _onChange = (_: any) => {
  }

  _onTouched = () => {
  }

  writeValue(value: any): void {
    let normalizedValue: string;
    if (value instanceof Array) {
      normalizedValue = (<any[]>value).join(', ');
    } else {
      normalizedValue = value == null ? '' : value;
    }
    this.renderer.setProperty(this.input.nativeElement, 'value', normalizedValue);
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.input, 'disabled', isDisabled);
  }

  // End ControlValueAccessor interface

  handleChange() {
    let val = this.input.nativeElement.value;
    if (this.stringToArray) {
      val = val ? val.split(',').map(x => x.trim()) : [];
    }
    this._onChange(val);
  }

  onInput(event) {
    if (this.ngModelOptions.updatedOn !== 'blur') {
    }
  }

  onChange(event) {
  }

  onBlur(event) {
  }

  onKeyup(event) {
    this._onTouched();
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
        fcn: Validators.minLength(this.minLength)
      });
    }

    if (this.maxLength) {
      this.validations.push({
        name: 'maxlength',
        message: `Maximum of ${this.maxLength} characters allowed`,
        fcn: Validators.maxLength(this.maxLength)
      });
    }

    if (this.email) {
      this.validations.push({
        name: 'email',
        message: `Invalid email address`,
        fcn: Validators.email
      });
    }

    if (this.pattern) {
      this.validations.push({
        name: 'pattern',
        message: `Invalid pattern address`,
        fcn: Validators.pattern(this.pattern)
      });
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
    this.input.nativeElement.focus();
  }

}
