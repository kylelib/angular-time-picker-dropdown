import { Injectable } from '@angular/core';
import { ControlValueAccessor, FormControl, Validator } from '@angular/forms';
import { SubscriptionComponent } from '../subscription-component/subscription.component';

@Injectable()
export abstract class CustomControl<InputType> extends SubscriptionComponent implements ControlValueAccessor, Validator {
  public errors: any = null;
  abstract writeValueCallback(value: InputType);

  writeValue(value: InputType) {
    this.writeValueCallback(value);
  }

  propagateChange = (_: any) => { };
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  propagateTouched = () => { };
  registerOnTouched(fn: () => void) {
    this.propagateTouched = fn;
  }

  // returns null when valid else the validation object
  // in this case we're checking if the json parsing has
  // passed or failed from the onChange method
  public validate(c: FormControl) {
    return this.errors;
  }
}
