import { FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static confirmPasswordValidator(group: FormGroup): ValidationErrors {
    const controls = group.controls
    const keys: string[] = Object.keys(controls);
    var fieldValues: string[] = [controls[keys[0]].value, controls[keys[1]].value];
    if (fieldValues[0] === fieldValues[1]) {
      return null;
    } else {
      return { 'confirmPassword': { value: fieldValues[0] } };
    }
  }
  static atLeastOneValidator(group: FormGroup): ValidationErrors {
    let controls = group.controls;
    if (controls) {
      let theOne = Object.keys(controls).find(key => controls[key].value);
      if (!theOne) {
        return { atLeastOneRequired: { text: 'At least one should be selected.' } }
      }
    }
    return null;
  };

}
