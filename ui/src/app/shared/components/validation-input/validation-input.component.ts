import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  Renderer2,
  Self,
  ViewChild
} from '@angular/core';
import {AsyncValidatorFn, ControlValueAccessor, NgControl, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {inListValidator} from '../../validators/in-list.validator';
import {notInListValidator} from '../../validators/not-in-list.validator';
import {numberValidator} from '../../validators/number.validator';
import {shUtil} from '../../../../../../shared/misc/shared-util';
import _ from 'lodash';

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
export class ValidationInputComponent implements OnChanges, ControlValueAccessor {
  validations: InputValidation[] = [];
  opts = new ValidationInputOptions();
  updateOn = 'change';
  delayedWriteValue: any;
  delayedSetDisabledState: boolean;
  elem: ElementRef;
  // @Input() form: NgForm;
  @ViewChild('inputElem') inputElem: ElementRef;
  @ViewChild('textareaElem') textareaElem: ElementRef;
  @Input() options: ValidationInputOptions = {};
  @Input() debug = false;
  @Input() id: string;
  @Input() name: string;
  @Input() label = '';
  @Input() type: string; // unused, but people will set it, so don't complain
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Input() autofocus = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() minLength = 0;
  @Input() maxLength = 10000;
  @Input() email = false;
  @Input() pattern: string | RegExp;
  @Input() compressed = false;
  @Input() inline = false;
  @Input() stringToArray = false; // you have an array in model and comma sep values in textbox
  @Input() requiredMessage: string;
  @Input() minLengthMessage: string;
  @Input() maxLengthMessage: string;
  @Input() emailMessage: string;
  @Input() patternMessage: string;
  @Input() inList: string[];
  @Input() inListMessage: string;
  @Input() inListProperty: string;
  @Input() notInList: string[];
  @Input() notInListMessage: string;
  @Input() notInListProperty: string;
  @Input() isNumber: boolean;
  @Input() isNumberMessage: string;
  @Output() blur = new EventEmitter();

  /*
    @Output() change = new EventEmitter();
    @Output() input = new EventEmitter();
  */

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
    @Self() @Optional() public ngc: NgControl
  ) {
    // Note: we provide the value accessor through here, instead of
    // the `providers` to avoid running into a circular import.
    this.ngc.valueAccessor = this;
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
    if (!this.elem) {
      this.delayedWriteValue = value;
    } else {
      this.renderer.setProperty(this.elem.nativeElement, 'value', normalizedValue);
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (!this.elem) {
      this.delayedSetDisabledState = isDisabled;
    } else {
      this.renderer.setProperty(this.elem, 'disabled', isDisabled);
    }
  }

  // End ControlValueAccessor interface

  handleChange() {
    let val = this.elem.nativeElement.value;
    if (this.stringToArray) {
      val = shUtil.stringToArray(val);
    }
    this._onChange(val);
  }

  onInput(event) {
    this.handleChange();
  }

  onChange(event) {
    // this.handleChange(); // not needed if calling "before" onTouched in blur, maybe checkbox/radio needs it??
  }

  onBlur(event) {
    this.handleChange();
    this._onTouched();
    this.blur.emit();
  }

  blurInput() {
    if (this.textarea) {
      this.textareaElem.nativeElement.dispatchEvent(new Event('blur'));
    } else {
      // can't just call blur()? appears to work (onBlur gets called), BUT doesn't call ngModelChanges, the whole point of this
      this.inputElem.nativeElement.dispatchEvent(new Event('blur'));
    }
  }

  init() {
    if (!this.name) {
      console.error('fin-input: name is required');
      return;
    }

    Object.assign(this.opts, this.options);

    this.validations = [];
    if (this.required) {
      this.validations.push({name: 'required', message: this.requiredMessage || null, fcn: Validators.required});
    }

    if (this.isNumber) {
      this.validations.push({
        name: 'isNumber',
        message: this.isNumberMessage || `Not a number`,
        fcn: numberValidator()
      });
    }

    if (this.minLength !== undefined && this.maxLength && this.minLength === this.maxLength) {
      const message = this.minLengthMessage || `Must be exactly ${this.minLength} characters long`;
      this.validations.push({
        name: 'minlength',
        message,
        fcn: Validators.minLength(this.minLength)
      });
      this.validations.push({
        name: 'maxlength',
        message,
        fcn: Validators.maxLength(this.maxLength)
      });
    } else {

      if (this.minLength !== undefined) {
        this.validations.push({
          name: 'minlength',
          message: this.minLengthMessage || `Minimum of ${this.minLength} characters required`,
          fcn: Validators.minLength(this.minLength)
        });
      }

      if (this.maxLength) {
        this.validations.push({
          name: 'maxlength',
          message: this.maxLengthMessage || `Maximum of ${this.maxLength} characters allowed`,
          fcn: Validators.maxLength(this.maxLength)
        });
      }
    }

    if (this.email) {
      this.validations.push({
        name: 'email',
        message: this.emailMessage || `Invalid email address`,
        fcn: Validators.email
      });
    }

    if (this.pattern) {
      this.validations.push({
        name: 'pattern',
        message: this.patternMessage || `Invalid value`,
        fcn: Validators.pattern(this.pattern)
      });
    }

    if (this.inList) {
      let list: string[];
      if (this.inListProperty) {
        list = this.inList.map(x => x[this.inListProperty]);
      } else {
        list = this.inList;
      }
      this.validations.push({
        name: 'inList',
        message: this.inListMessage || `Value doesn\'t exist`,
        fcn: inListValidator(list, true)
      });
    }

    if (this.notInList) {
      let list: string[];
      if (this.notInListProperty) {
        list = this.notInList.map(x => x[this.notInListProperty]);
      } else {
        list = this.notInList;
      }
      this.validations.push({
        name: 'notInList',
        message: this.notInListMessage || `Value already exists`,
        fcn: notInListValidator(list, true)
      });
    }

    this.validations = this.validations.concat(this.opts.validations);
    const asyncValidators = this.opts.asyncValidations.map(v => v.fcn);
    if (this.validations.length) {
      this.ngc.control.setValidators(this.validations.map(v => v.fcn));
    }
    if (asyncValidators.length) {
      this.ngc.control.setAsyncValidators(asyncValidators);
    }

    this.addAsteriskToRequiredLabel();
    this.changeDetectorRef.detectChanges();
  }

  addAsteriskToRequiredLabel() {
    if (this.required && this.label && this.label[this.label.length - 1] !== '*') {
      this.label += '*';
    }
  }

  ngOnChanges(changes) {
    this.init();
  }

  ngAfterViewInit() {
    // hack: these two functions get called "before" we have the ViewContent element (in edge browser), so we delay
    // their setting in that case.
    this.elem = this.textarea ? this.textareaElem : this.inputElem;
    if (this.delayedWriteValue !== undefined) {
      this.writeValue(this.delayedWriteValue);
    }
    if (this.delayedSetDisabledState !== undefined) {
      this.setDisabledState(this.delayedSetDisabledState);
    }
  }

  getMessage(message, value) {
    if (message.indexOf('%s') !== -1 && value !== undefined) {
      return message.replace('%s', _.isArray(value) ? value.join(', ') : value);
    } else {
      return message;
    }
  }

}
