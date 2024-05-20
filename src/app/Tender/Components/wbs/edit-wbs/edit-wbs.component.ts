import { Component, EventEmitter, Input, Output } from '@angular/core';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';


@Component({
  selector: 'app-edit-wbs',
  templateUrl: './edit-wbs.component.html',
  styleUrls: ['./edit-wbs.component.scss',
    '../../../../../assets/scss/from-coomon.scss']
})
export class EditWbsComponent {

  @Output()
  parentFun = new EventEmitter<string>();
  wbsForm!: FormGroup;
  selectedGroupForDND = '';
  wbsName: any = '';
  wbsCategory:any = '';
  
  @Input()
  tenderId!: any;
  localStorageData: any;
  editedId: any;
  afterAdd: boolean = false;
  uomList: any = [];

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder


  ) {
    this.wbsForm = formBuilder.group({
      wbsName: ['', [Validators.required]],
      wbsCategory: ['', [Validators.required]],
    })
  }



  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.uomDropdownList();
  }

  getData(editid: any) {
    this.editedId = editid;
    let params = new URLSearchParams();
    if(this.tenderId) {
      params.set('tender_id', this.tenderId);
    } else {
      params.set('is_master', '1');
    }
    params.set('id', editid);

    this.apiservice.getWbsList(params).subscribe(data => {
      this.wbsName = data.wbs_name;
      this.wbsCategory = data.category
    })
  }


  uomDropdownList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  updateWBS() {
    this.afterAdd = true;
    if (this.wbsForm.valid) {

      let params = new URLSearchParams();
      params.set('method', 'edit');
      params.set('wbs_id', this.editedId);

      let request:any = {
        "wbs_name": this.wbsName,
        "category" : this.wbsCategory,
      }

      let valid = true
      if(valid) {
        if(this.tenderId) {
          request.tender_id = this.tenderId;
        } else {
          params.set('is_master', '1');
        }
        this.apiservice.editWBSData(params, request).subscribe(data => {
          this.toastrService.success('WBS Updated Successfully', '', {
            timeOut: 2000,
          });
          this.parentFun.emit();
          this.wbsForm.reset();
          this.afterAdd = false;
        })
      }
    }
    else {
      this.markFormGroupTouched(this.wbsForm);
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
