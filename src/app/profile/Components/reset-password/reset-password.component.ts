import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { Error_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  newpassForm: FormGroup;
  showoldpassword = false;
  shownewpassword = false;
  showconfirmpassword = false;
  sameError = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiservice: APIService,
    private toastrService: ToastrService
  ) {
    this.newpassForm = formBuilder.group({
      newpassword: ['', [Validators.required, Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@#$!%*?&])(?=[^A-Z]*[A-Z]).{8,16}$/)]],
      confirmPassword: ['', [Validators.required]],
      oldPassword: ['', [Validators.required]]

    })
  }

  ngOnInit(): void {
  }

  confirmPass() {
    if (this.newpassForm.value.newpassword == this.newpassForm.value.confirmPassword) {
      this.sameError = false;
    }
    else {
      this.sameError = true;
    }
  }
  saveNewPassword() {
    if (this.newpassForm.valid) {

      if (this.sameError == false) {
        let req = {
          old_password: this.newpassForm.value.oldPassword,
          new_password: this.newpassForm.value.newpassword
        }
        this.apiservice.profileUpdatePassword(req).subscribe(data => {

          if (data.request_status == '0') {
            this.toastrService.success("Password Updated Successfully!", '', {
              timeOut: 2000,
            });
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          } else {
            this.toastrService.error(Error_Messages.Failed_HTTP, '', {
              timeOut: 2000,
            });
          }
        }, err => {
          this.toastrService.error(err.error.msg, '', {
            timeOut: 2000,
          });
        });

      } else {
        this.sameError = true;
      }
    } else {
      this.markFormGroupTouched(this.newpassForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: { markAsTouched: () => void; controls: any[]; }) => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach((c: FormGroup) => this.markFormGroupTouched(c));
      }
    });
  }

  toggleoldPasswordView() {
    this.showoldpassword = !this.showoldpassword
  }
  togglenewPasswordView() {
    this.shownewpassword = !this.shownewpassword
  }
  toggleconfirmPasswordView() {
    this.showconfirmpassword = !this.showconfirmpassword
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
      'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    };
  }
}
