import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-add-gst',
  templateUrl: './add-gst.component.html',
  styleUrls: ['./add-gst.component.scss',
  '../../../../../assets/scss/scrollableTable.scss',
  '../../../../../assets/scss/from-coomon.scss']
})
export class AddGstComponent implements OnInit{


  addUser: any = {
    organization:'',
    name: '',
    short_name:'',
    tax_type: 'gst_tax',
    applicable_type:'',
    sgst_account:'',
    rmc_sgst_pay_account:'',
    rmc_sgst_input_account:'',
    utgst_account:'',
    rmc_utgst_pay_account:'',
    rmc_utgst_input_account:'',
    cgst_account:'',
    rmc_cgst_pay_account:'',
    rmc_cgst_input_account:'',
    igst_account:'',
    rmc_igst_pay_account:'',
    rmc_igst_input_account:'',
    rmc_cess_pay_account:'',
    rmc_cess_input_account:'',
    remarks:'',
    gst_type:'',
    sgst_rate:'0',
    utgst_rate:'0',
    cgst_rate:'0',
    igst_rate:'0',
    total_tax_rate:'0',
    cess:'0',
    cess_account:''
  }
  localStorageData:any;
  accountList:any;
  gstTaxId:any;

  constructor(
     private apiservice:APIService,
     private datasharedservice:DataSharedService,
     private router:Router,
     private toastrService:ToastrService,
     private activatedRoute:ActivatedRoute,
     private procurementAPIService:PROCUREMENTAPIService
     ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getAccountHeadList();

    this.activatedRoute.paramMap.subscribe(params => {
      this.gstTaxId = params.get('taxId');
    });

    if(this.gstTaxId){
      this.getEditData()
    }
  }


  getEditData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.gstTaxId);

    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      
      this.addUser.educational_cess = data.educational_cess.toString();
      this.addUser.name = data.name
      this.addUser.remarks=data.remarks;
      this.addUser.applicable_type=data.applicable_type;
      this.addUser.tax_type=data.tax_type;
      this.addUser.short_name=data.short_name;
      this.addUser.applicable_type=data.applicable_type;
      this.addUser.sgst_account=data.sgst_account;
      this.addUser.rmc_sgst_pay_account=data.rmc_sgst_pay_account;
      this.addUser.rmc_sgst_input_account=data.rmc_sgst_input_account;
      this.addUser.utgst_account=data.utgst_account;
      this.addUser.rmc_utgst_pay_account=data.rmc_utgst_pay_account;
      this.addUser.rmc_utgst_input_account=data.rmc_utgst_input_account;
      this.addUser.cgst_account=data.cgst_account;
      this.addUser.rmc_cgst_pay_account=data.rmc_cgst_pay_account;
      this.addUser.rmc_cgst_input_account=data.rmc_cgst_input_account;
      this.addUser.igst_account=data.igst_account;
      this.addUser.tax_type=data.tax_type;
      this.addUser.tax_type=data.tax_type;
      this.addUser.rmc_igst_pay_account=data.rmc_igst_pay_account,
      this.addUser.rmc_igst_input_account=data.rmc_igst_input_account,
      this.addUser.rmc_cess_pay_account=data.rmc_cess_pay_account,
      this.addUser.rmc_cess_input_account=data.rmc_cess_input_account,
      this.addUser.gst_type=data.gst_type,
      this.addUser.sgst_rate=data.sgst_rate,
      this.addUser.utgst_rate=data.utgst_rate,
      this.addUser.cgst_rate=data.cgst_rate,
      this.addUser.igst_rate=data.igst_rate,
      this.addUser.total_tax_rate=data.total_tax_rate,
      this.addUser.cess=data.cess,
      this.addUser.cess_account=data.cess_account
      
    })
  }

  onSubmit(){
    this.addUser.organization = this.localStorageData.organisation_details[0].id;
    if(this.gstTaxId){
    let params = new URLSearchParams();
    params.set('id', this.gstTaxId);
    params.set('method', 'edit')
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.procurementAPIService.editTax(params,this.addUser).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      this.router.navigateByUrl('/pms/settings/tax-management');

    })
    }else{
      let params = new URLSearchParams();
      params.set('organization', this.localStorageData.organisation_details[0].id);
      this.procurementAPIService.addTax(params,this.addUser).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.router.navigateByUrl('/pms/settings/tax-management');
  
      })
    }
    
  }

  getAccountHeadList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getAccountHeads(params).subscribe(data => {
      this.accountList = data.results;
    })
  }

}
