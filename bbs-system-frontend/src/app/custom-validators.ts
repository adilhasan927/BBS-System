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
}
