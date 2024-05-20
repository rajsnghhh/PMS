import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-ad-edit-tax',
  templateUrl: './ad-edit-tax.component.html',
  styleUrls: ['./ad-edit-tax.component.scss',
  '../../../../../assets/scss/from-coomon.scss'
]
})
export class AdEditTaxComponent implements OnInit, OnChanges {

  @Input()
  scope!: any;
  @Input()
  selectedId!: any;

  @Output()
  parentFun = new EventEmitter<string>();

  addUser: any = {
    organization:'',
    name: '',
    short_name : '',
    tax_type:'',
    applicable_type :'',
    percentage :'',
    // vatax:false,
    educational_cess:'0',
    she_cess :'0',
    swachh_bharat_cess :'0',
    sbc_account :'',
    krishi_kalyan_cess :'0',
    krishi_kalyan_account :'',
    tax_rate :'0',
    remarks:'',
  }
  localStorageData: any;
  accountNameList:any;

  constructor(
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private toastrService: ToastrService
  ){}

  ngOnChanges(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.scope == 'edit' && this.selectedId) {
      this.getEditData()
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getAccount();
    
  }

  getEditData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.selectedId);

    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      
      this.addUser.educational_cess = data.educational_cess.toString();
      this.addUser.name = data.name
      this.addUser.she_cess = data.she_cess.toString();
      this.addUser.swachh_bharat_cess=data.swachh_bharat_cess.toString();
      this.addUser.sbc_account=data.sbc_account;
      this.addUser.krishi_kalyan_cess=data.krishi_kalyan_cess.toString();
      this.addUser.krishi_kalyan_account=data.krishi_kalyan_account;
      this.addUser.tax_rate=data.tax_rate.toString();
      this.addUser.remarks=data.remarks;
      this.addUser.percentage=data.percentage.toString();
      this.addUser.applicable_type=data.applicable_type;
      this.addUser.tax_type=data.tax_type;
      this.addUser.short_name=data.short_name;
    })
  }
 
  getAccount(){
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getAccountHead(params).subscribe(data => {
    this.accountNameList = data.results;
    });
  }

  onSubmit() {
    this.addUser.organization = this.localStorageData.organisation_details[0].id;

      if (this.selectedId) {
        let params = new URLSearchParams();
        params.set('id', this.selectedId);
        params.set('method', 'edit')
        params.set('organization_id', this.localStorageData.organisation_details[0].id);
        this.procurementAPIService.editTax(params, this.addUser).subscribe(data => {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          this.parentFun.emit();
        })
      } else {
        let params = new URLSearchParams();
        params.set('organization', this.localStorageData.organisation_details[0].id);
        this.procurementAPIService.addTax(params,this.addUser).subscribe(data => {
          this.toastrService.success(Success_Messages.SuccessAdd, '', {
            timeOut: 2000,
          });
          this.parentFun.emit();
        })
      }


  }

  resetADD(form: NgForm): void {
    this.parentFun.emit();
    form.reset();
  }

}
