import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/Shared/Services/api.service';
import * as Global from 'src/app/global';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activity-budget',
  templateUrl: './activity-budget.component.html',
  styleUrls: ['./activity-budget.component.scss'],
})
export class ActivityBudgetComponent {
  Global = Global;
  add_list: any = [
    {
      label: 'Chainage',
      value: 0,
    },
    {
      label: 'Activity',
      value: 1,
    },
    {
      label: 'Sub Acitivity',
      value: 2,
    },
  ];
  tab_content: any = 0;
  projects: any = [];
  levels: any[] = [];
  formGroup: FormGroup;
  rowFormGroup: FormGroup;
  constructor(
    private fb: FormBuilder,
    private apiService: APIService,
    private localStorage: LocalStorageService,
    private toastr: ToastrService
  ) {
    this.formGroup = this.fb.group({
      name: [null, Validators.required],
    }); 
    this.rowFormGroup = this.fb.group({
      project: [null, Validators.required],
      chainage: [null, Validators.required],
      activity: [null, Validators.required],
      sub_activity: [null, Validators.required],
    });
    this.fetchAllMaster();
    this.getProjectList();
  }
  submitRow() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.formGroup.disable();
      let formData = this.formGroup.value;
      formData.level = this.tab_content;
      formData.organization = this.localStorage.organisation_id();
      this.apiService.addBudgetCostMaster(formData).subscribe({
        next: (res: any) => {
          this.formGroup.enable();
          this.formGroup.reset();
          this.toastr.success(res?.msg);
          const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
          this.fetchAllMaster();
        },
      });
    }
  }
  addRowItem(tab_content: any) {
    this.tab_content = tab_content;
  }
  getBudgetCostMaster(lavel: any = 0) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('level', lavel);
    this.apiService.getBudgetCostMaster(params).subscribe({
      next: (res: any) => {
        this.levels[lavel] = res?.results;
      },
    });
  }
  fetchAllMaster() {
    this.getBudgetCostMaster();
    this.getBudgetCostMaster(1);
    this.getBudgetCostMaster(2);
  }
  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('list', 'true');
    this.apiService.getProjectList(params).subscribe(data => {
      this.projects = data.results;
    })
  }
}
