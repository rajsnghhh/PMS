import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';


@Component({
  selector: 'app-import-grn',
  templateUrl: './import-grn.component.html',
  styleUrls: ['./import-grn.component.scss',
  '../../../../../assets/scss/from-coomon.scss'
]
})
export class ImportGrnComponent {

  isLoading = false;
  activefrom = 'importuser';
  importData: any;
  filen = "";
  excelIcon: boolean = false;
  displayStyle = "none";
  userData: any;
  localStorageData: any;
  importForm!: FormGroup;
  date: any = ''
  manual_slip_no: any = ''
  loaded_via: any = ''
  job_site: any = ''
  party_bill_amt: any = ''
  e_way_bill_no: any = ''
  party_bill_no: any = ''
  vendor: any = ''
  challan_no: any = ''
  rst_no: any = ''
  transporter: any = ''
  lr_no: any = ''
  lr_date: any = ''
  carrying_vehicle_no: any = ''
  driver_name: any = ''
  rate: any = ''
  remarks: any = ''
  royalty_bk: any = ''
  item: any = ''
  received_quantity: any = ''
  received_weight: any = ''
  istp_royalty_no: any = ''
  amount:any='';
  royalty_date:any='';
  royalty_no:any='';
  royalty_quantity:any='';
  royalty_rate:any='';
  istp_date:any='';
  challan_quantity:any='';
  change_reason:any='';
  party_bill_date:any='';
  site_id: any = ''


  siteList :any = []


  constructor(
    private importService: APIService,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService,
    private formBuilder: FormBuilder
  ) {
    this.importForm = formBuilder.group({
      site_id: ["", Validators.required],
      date: ["", Validators.required],
      manual_slip_no: ["", Validators.required],
      loaded_via: ["", Validators.required],
      job_site: ["", Validators.required],
      party_bill_amt: ["", Validators.required],
      e_way_bill_no: ["", Validators.required],
      party_bill_no: ["", Validators.required],
      vendor: ["", Validators.required],
      challan_no: ["", Validators.required],
      rst_no: ["", Validators.required],
      transporter: ["", Validators.required],
      lr_no: ["", Validators.required],
      lr_date: ["", Validators.required],
      carrying_vehicle_no: ["", Validators.required],
      driver_name: ["", Validators.required],
      rate: ["", Validators.required],
      remarks: ["", Validators.required],
      royalty_bk: ["", Validators.required],
      item: ["", Validators.required],
      received_quantity: ["", Validators.required],
      received_weight: ["", Validators.required],
      istp_royalty_no: ["", Validators.required],
      amount: ["", Validators.required],
      royalty_date: ["", Validators.required],
      royalty_no: ["", Validators.required],
      royalty_quantity: ["", Validators.required],
      istp_date: ["", Validators.required],
      challan_quantity: ["", Validators.required],
      change_reason: ["", Validators.required],
      party_bill_date: ["", Validators.required],
      royalty_rate: ["", Validators.required],

    })
  }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSiteList();
  }


  
  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('project', this.selectedMRDetails.project);
    params.set('all', 'true');
    this.importService.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })

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
        date: this.importForm.value.date,
        manual_slip_no: this.importForm.value.manual_slip_no,
        loaded_via: this.importForm.value.loaded_via,
        job_site: this.importForm.value.job_site,
        party_bill_amt: this.importForm.value.party_bill_amt,
        e_way_bill_no: this.importForm.value.e_way_bill_no,
        party_bill_no: this.importForm.value.party_bill_no,
        vendor: this.importForm.value.vendor,
        challan_no: this.importForm.value.challan_no,
        rst_no: this.importForm.value.rst_no,
        transporter: this.importForm.value.transporter,
        lr_no: this.importForm.value.lr_no,
        lr_date: this.importForm.value.lr_date,
        carrying_vehicle_no: this.importForm.value.carrying_vehicle_no,
        driver_name: this.importForm.value.driver_name,
        rate: this.importForm.value.rate,
        remarks: this.importForm.value.remarks,
        royalty_bk: this.importForm.value.royalty_bk,
        item: this.importForm.value.item,
        received_quantity: this.importForm.value.received_quantity,
        received_weight: this.importForm.value.received_weight,
        istp_royalty_no: this.importForm.value.istp_royalty_no,
        amount: this.importForm.value.amount,
        royalty_date: this.importForm.value.royalty_date,
        royalty_no: this.importForm.value.royalty_no,
        royalty_quantity: this.importForm.value.royalty_quantity,
        istp_date: this.importForm.value.istp_date,
        challan_quantity: this.importForm.value.challan_quantity,
        change_reason: this.importForm.value.change_reason,
        party_bill_date: this.importForm.value.party_bill_date,
        site_id: this.importForm.value.site_id,
        royalty_rate:this.importForm.value.royalty_rate

      }

      this.importService.mapMaterialGRN(body, this.localStorageData.organisation_details[0].id).subscribe(data => {
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

}
