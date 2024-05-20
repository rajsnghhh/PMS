import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-import-issue',
  templateUrl: './import-issue.component.html',
  styleUrls: [
    './import-issue.component.scss',
    '../../../../../../assets/scss/from-coomon.scss'
  ]
})
export class ImportIssueComponent {
  isLoading = false;
  activefrom = 'importuser';
  importData: any;
  filen = "";
  excelIcon: boolean = false;
  displayStyle = "none";
  userData: any;
  localStorageData: any;
  importForm!: FormGroup;


  site_id: any = ''
  request_code: any = ''
  date: any = ''
  issue_type: any = ''
  requested_for_type: any = ''
  requested_for: any = ''
  charge_type: any = ''
  issue_location: any = ''
  requested_material: any = ''
  quantity: any = ''
  rate: any = ''
  amount: any = ''
  remarks: any = ''
  transporter: any = ''
  carrying_vehicle_number: any = ''
  shift: any = ''
  material_type: any = ''
  unit_of_mesurement: any = ''
  material_nature: any = ''
  material_cost_head: any = ''
  material_sub_cost_head: any = ''
  hsn_code: any = ''
  store: any = ''

  constructor(
    private importService: APIService,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService,
    private formBuilder: FormBuilder
  ) {
    this.importForm = formBuilder.group({
      site_id: ["", Validators.required],
      request_code: ["", Validators.required],
      date: ["", Validators.required],
      issue_type: ["", Validators.required],
      requested_for_type: ["", Validators.required],
      requested_for: ["", Validators.required],
      charge_type: ["", Validators.required],
      issue_location: ["", Validators.required],
      requested_material: ["", Validators.required],
      quantity: ["", Validators.required],
      rate: ["", Validators.required],
      amount: ["", Validators.required],
      remarks: ["", Validators.required],
      transporter: ["", Validators.required],
      carrying_vehicle_number: ["", Validators.required],
      shift: ["", Validators.required],
      material_type: ["", Validators.required],
      unit_of_mesurement: ["", Validators.required],
      material_nature: ["", Validators.required],
      material_cost_head: ["", Validators.required],
      material_sub_cost_head: ["", Validators.required],
      hsn_code: ["", Validators.required],
      store: ["", Validators.required]
    })
  }

  siteList :any = []

  
  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.selectedMRDetails.project);
    params.set('all', 'true');
    this.importService.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSiteList()
  }

  uploadFile(event: any) {
    if (event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || event.target.files[0].type == "application/vnd.ms-excel") {
      this.importData = event.target.files[0];
      this.filen = event.target.files[0].name;
      this.toastrService.success("File Saved Successfully", '', {
        timeOut: 2000,
      });
      if (this.importData != null) {
        this.excelIcon = true;
      }
    } else {
      this.filen = "Choose file";
      this.toastrService.error("Please Choose a XLSX/CSV File", '', {
        timeOut: 2000,
      });
    }
  }

  importUser() {
    var formValue = new FormData();
    if (this.importData != null) {
      formValue.append('file', this.importData);
      this.importService.importUserData(formValue).subscribe((data: any) => {
        this.userData = data;
        this.activefrom = 'userlist'
        this.toastrService.success("File Uploaded Successfully", '', {
          timeOut: 2000,
        });
      }, err => {
        this.toastrService.error(Error_Messages.Failed_HTTP, '', {
          timeOut: 2000,
        });
      })
    } else {
      this.toastrService.error("Please Choose any file", '', {
        timeOut: 2000,
      });
    }
  }

  mapUser() {
    let strValue = JSON.stringify(this.userData);
    let result = strValue.replace(/"/g, "");
    let result1 = result.split('[');
    let result2 = result1[1].split(']');
    if (this.importForm.valid) {
      let body = {
        file_name: this.filen,
        fields: result2[0],
        site_id: this.importForm.value.site_id,
        request_code: this.importForm.value.request_code,
        date: this.importForm.value.date,
        issue_type: this.importForm.value.issue_type,
        requested_for_type: this.importForm.value.requested_for_type,
        requested_for: this.importForm.value.requested_for,
        charge_type: this.importForm.value.charge_type,
        issue_location: this.importForm.value.issue_location,
        requested_material: this.importForm.value.requested_material,
        quantity: this.importForm.value.quantity,
        rate: this.importForm.value.rate,
        amount: this.importForm.value.amount,
        remarks: this.importForm.value.remarks,
        transporter: this.importForm.value.transporter,
        carrying_vehicle_number: this.importForm.value.carrying_vehicle_number,
        shift: this.importForm.value.shift,
        material_type: this.importForm.value.material_type,
        unit_of_mesurement: this.importForm.value.unit_of_mesurement,
        material_nature: this.importForm.value.material_nature,
        material_cost_head: this.importForm.value.material_cost_head,
        material_sub_cost_head: this.importForm.value.material_sub_cost_head,
        hsn_code: this.importForm.value.hsn_code,
        store: this.importForm.value.store,
      }

      this.importService.mapMaterialIssue(body, this.localStorageData.organisation_details[0].id).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      })
    } else {
      this.toastrService.error("Please map all required fields", '', {
        timeOut: 2000,
      });
    }
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field)!.invalid && (form.get(field)!.dirty || form.get(field)!.touched),
      'is-valid': form.get(field)!.valid && (form.get(field)!.dirty || form.get(field)!.touched)
    };
  }
  // adddoc() {
  //   this.activefrom = 'submitupload'
  // }

  // submitfile() {
  //   this.activefrom = 'userlist'
  // }

}
