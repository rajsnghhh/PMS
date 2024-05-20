'use strict';

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
export const BACKEND_URL = environment.API_URL1;
export const CURRENT_TIME = moment(new Date()).format('HH:mm:ss');
export const TODAY = moment(new Date()).format('YYYY-MM-DD');
export function resetForm(formGroup: FormGroup) {
  formGroup.reset();
  for (const key in formGroup.controls) {
    if (Object.prototype.hasOwnProperty.call(formGroup.controls, key)) {
      const element = formGroup.controls[key];

      element.markAsUntouched();
      element.markAsPristine();
    }
  }
}

export function isFormValidationAvailable(
  formGroup: FormGroup,
  control: any,
  rules: any
) {
  const formControl: any = formGroup.get(control);
  if (formControl) {
    const validator =
      formControl.validator && formControl.validator(new FormControl());
    if (validator && validator[rules]) {
      return true;
    }
  }

  return false;
}

export function isInputValid(formGroup: FormGroup, control: any) {
  let valid: boolean = true;

  let cntrls = control.split('.');
  let fgroupcontrols: any = formGroup;
  if (cntrls.length > 1) {
    cntrls.forEach((c: any) => {
      fgroupcontrols = fgroupcontrols.controls[c];
    });
  } else {
    fgroupcontrols = fgroupcontrols.controls[control];
  }

  if (
    !['VALID', 'DISABLED'].includes(fgroupcontrols.status) &&
    (fgroupcontrols.touched || fgroupcontrols.dirty)
  ) {
    valid = false;
  }

  return valid;
}

export function isInputRuleValid(
  formGroup: FormGroup,
  control: any,
  rule: any
) {
  let valid: boolean = true;

  let cntrls = control.split('.');
  let fgroupcontrols: any = formGroup;
  if (cntrls.length > 1) {
    cntrls.forEach((c: any) => {
      fgroupcontrols = fgroupcontrols.controls[c];
    });
  } else {
    fgroupcontrols = fgroupcontrols.controls[control];
  }

  if (rule instanceof Array) {
    rule.forEach((r) => {
      if (
        fgroupcontrols.hasError(r) &&
        (fgroupcontrols.touched || fgroupcontrols.dirty)
      ) {
        valid = false;
      }
    });
  } else {
    if (
      fgroupcontrols.hasError(rule) &&
      (fgroupcontrols.touched || fgroupcontrols.dirty)
    ) {
      valid = false;
    }
  }

  return valid;
}

export function isInputRuleAvailable(
  formGroup: FormGroup,
  control: any,
  rule: any
) {
  const formControl: any = formGroup.get(control);
  if (formControl) {
    const validator =
      formControl.validator && formControl.validator(new FormControl());
    if (validator && validator[rule]) {
      return true;
    }
  }

  return false;
}

export function onFileUploaded(
  formGroup: FormGroup,
  event: any,
  sourceKey: any,
  type: any = 'single'
) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    formGroup.patchValue({
      [sourceKey]: file,
    });
  } else {
    formGroup.patchValue({
      [sourceKey]: null,
    });
  }
}

export function getFormGroupArray(formGroup: FormGroup, type: any) {
  return (formGroup.get(type) as FormArray).controls;
}

export function removeFormGroupArrRow(
  formGroup: FormGroup,
  type: any,
  index: number
) {
  const control = <FormArray>formGroup.get(type);
  control.removeAt(index);
}

export function resetFormGroupArrRow(formGroup: FormGroup, type: any) {
  const control = <FormArray>formGroup.get(type);
  control.clear();
}

export function fetchFormGroupIndexOfControl(
  formGroup: FormGroup,
  type: any,
  s_key: any,
  s_value: any
) {
  let arr: any[] = formGroup.value?.[type];
  if (Array.isArray(arr)) {
    let index: any = arr.findIndex((x) => x[s_key] == s_value);
    return index;
  }

  return false;
}
export function applyValidatorsAndUpdate(
  formGroup: FormGroup,
  controlNames: string[]
) {
  controlNames.forEach((controlName) => {
    const control = formGroup.get(controlName);
    if (control) {
      control.setValidators(Validators.required);
      control.markAsUntouched();
      control.updateValueAndValidity();
    }
  });
}
export function removeValidatorsAndUpdate(
  formGroup: FormGroup,
  controlNames: string[]
) {
  controlNames.forEach((controlName) => {
    const control = formGroup.get(controlName);
    if (control) {
      control.clearValidators();
      control.markAsUntouched();
      control.updateValueAndValidity();
    }
  });
}
export function humanize(str: string) {
  var i,
    frags = str.split('_');
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}
