import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-add-update-general-administration-expenses',
  templateUrl: './add-update-general-administration-expenses.component.html',
  styleUrls: [
    './add-update-general-administration-expenses.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class AddUpdateGeneralAdministrationExpensesComponent implements OnInit{
  localStorageData:any;
  siteList:any;
  itemList:any;
  vendorList:any;
  workOrderList:any;
  laborsMasterList:any;
  importData: any;
  uomList: any
  stateList: any = []
  accountList:any = []
  HSN_List :any = []
  prefieldData: any = {}

  form: any = {
    organization:'',

    voucher_no: '',
    date: '',
    party_bill_no: '',
    p_b_date: '',
    vendor: '',
    vendor_state: '',
    vendor_state_gstin: '',
    site_state: '',
    site_state_gstin: '',
    sale_pur_trans_type: '',
    apply_forcefully_rcm: false,
    is_place_of_supply_different: false,
    
    items: [],
    
    narration:'',
    fileData:'',
    attachments:[],
  };

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getHsnList()
    this.getAccountHeadList()
    this.getStateList()
    this.viewVendorList();
    
    if (this.router.url.indexOf('/procurement/general-administration-expenses/edit') > -1) {
      // this.scope = 'update'
      this.getPrefieldData()
    }

    // this.getUomList()
    // this.getSiteList();
    // this.getWOList();
    // this.getlaborsMasterList();
    // this.viewItemList();
    
    this.form.items.push({
      "organization": this.localStorageData.organisation_details[0].id,

      "account": '',
      "account_hsn_code": '',
      "remarks":'',

      "amount":0,
      "debit_credit":'',

      "sgst_percentage":0,
      "sgst_amount":0,
      "utgst_percentage":0,
      "utgst_amount":0,

      "cgst_percentage":0,
      "cgst_amount":0,

      "igst_percentage":0,
      "igst_amount":0,
      "cess_percentage":0,
      "cess_amount":0,
    })
    
  }

  generatePrepopulateData(){

    if(this.prefieldData.id){
      
      this.form.organization = this.localStorageData.organisation_details[0].id,

      this.form.voucher_no = this.prefieldData.voucher_no
      this.form.date = this.prefieldData.date
      this.form.party_bill_no = this.prefieldData.party_bill_no
      this.form.p_b_date = this.prefieldData.p_b_date
      this.form.vendor = this.prefieldData.vendor
      this.form.vendor_state = this.prefieldData.vendor_state
      this.form.vendor_state_gstin = this.prefieldData.vendor_state_gstin
      this.form.site_state = this.prefieldData.site_state
      this.form.site_state_gstin = this.prefieldData.site_state_gstin
      this.form.sale_pur_trans_type = this.prefieldData.sale_pur_trans_type
      this.form.apply_forcefully_rcm = this.prefieldData.apply_forcefully_rcm
      this.form.is_place_of_supply_different = this.prefieldData.is_place_of_supply_different

      this.form.items = []
      for(let i = 0; i<this.prefieldData.items.length; i++){
        let obj = {
          organization: this.localStorageData.organisation_details[0].id,

          general_admin_expense: this.prefieldData.id,
          account : this.prefieldData.items[i].account,
          account_hsn_code : this.prefieldData.items[i].account_hsn_code,
          remarks : this.prefieldData.items[i].remarks,
          amount : this.prefieldData.items[i].amount,
          debit_credit : this.prefieldData.items[i].debit_credit,
          sgst_percentage : this.prefieldData.items[i].sgst_percentage,
          sgst_amount : this.prefieldData.items[i].sgst_amount,
          utgst_percentage : this.prefieldData.items[i].utgst_percentage,
          utgst_amount : this.prefieldData.items[i].utgst_amount,
          cgst_percentage : this.prefieldData.items[i].cgst_percentage,
          cgst_amount : this.prefieldData.items[i].cgst_amount,
          igst_percentage : this.prefieldData.items[i].igst_percentage,
          igst_amount : this.prefieldData.items[i].igst_amount,
          cess_percentage : this.prefieldData.items[i].cess_percentage,
          cess_amount : this.prefieldData.items[i].cess_amount,
        }

        this.form.items.push(obj)
      }

      this.form.total_amount = this.prefieldData.total_amount
      this.form.total_sgst_amount = this.prefieldData.total_sgst_amount
      this.form.total_utgst_amount = this.prefieldData.total_utgst_amount
      this.form.total_cgst_amount = this.prefieldData.total_cgst_amount
      this.form.total_igst_amount = this.prefieldData.total_igst_amount
      this.form.total_cess_amount = this.prefieldData.total_cess_amount
      this.form.total_with_tax = this.prefieldData.total_amount_with_all_taxes

      this.form.narration = this.prefieldData.narration
    }
  }

  addRawMaterial() {
    this.form.items.push({
      "organization": this.localStorageData.organisation_details[0].id,

      "account": '',
      "account_hsn_code": '',
      "remarks":'',

      "amount":0,

      "debit_credit":'',

      "sgst_percentage":0,
      "sgst_amount":0,
      "utgst_percentage":0,
      "utgst_amount":0,

      "cgst_percentage":0,
      "cgst_amount":0,

      "igst_percentage":0,
      "igst_amount":0,
      "cess_percentage":0,
      "cess_amount":0,
    })
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }

  changeItem(i:any) {
    let filter =  this.itemList.filter((item: { id: any; }) => item.id == this.form.items[i].material)
    
    if(filter.length > 0) {
      this.form.items[i].unit_of_mesurement = filter[0].unit_of_mesurement
    }
  }

  changeFinishItem(i:any) {
    let filter =  this.itemList.filter((item: { id: any; }) => item.id == this.form.finish_goods[i].material)
    
    if(filter.length > 0) {
      this.form.finish_goods[i].unit_of_mesurement = filter[0].unit_of_mesurement
    }
  }

  deleteRawMaterial(index: any) {
    this.form.items.splice(index, 1);
  }
  // deleteFinishGoods(index: any) {
  //   this.form.finish_goods.splice(index, 1);
  // }
  // deletelabors(index: any) {
  //   this.form.labors.splice(index, 1);
  // }

  getHsnList() {
    let params = new URLSearchParams();
    this.apiservice.getHSNList(params).subscribe(data => {
      this.HSN_List = data.results;
    })
  }
  getAccountHeadList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getAccountHeads(params).subscribe(data => {
      this.accountList = data.results
    })
  }
  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102')
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.stateList = data;
    })
  }
  viewItemList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.itemList = data.results;
    })
  }
  getlaborsMasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getLabourMasterList(params).subscribe(data => {
      this.laborsMasterList = data.results;
    })
  }
  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }
  
  getWOList(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getWorkOrderList(params).subscribe(data => {
      this.workOrderList = data.results;
    })
  }

  calculateAllTaxes(i: any){
    this.calculateSgstAmount(i)
    this.calculateUtgstAmount(i)
    this.calculateCgstAmount(i)
    this.calculateIgstAmount(i)
    this.calculateCessAmount(i)

    this.calculateTotalAmount()
  }
  calculateSgstAmount(i: any){
    let amountWithoutTax = Number(this.form.items[i].amount)
    let rate = Number(this.form.items[i].sgst_percentage)

    let amount = 0

    amount = Number((amountWithoutTax * rate) / 100)

    this.form.items[i].sgst_amount = amount
  }
  calculateUtgstAmount(i: any){
    let amountWithoutTax = Number(this.form.items[i].amount)
    let rate = Number(this.form.items[i].utgst_percentage)

    let amount = 0

    amount = Number((amountWithoutTax * rate) / 100)

    this.form.items[i].utgst_amount = amount
  }
  calculateCgstAmount(i: any){
    let amountWithoutTax = Number(this.form.items[i].amount)
    let rate = Number(this.form.items[i].cgst_percentage)

    let amount = 0

    amount = Number((amountWithoutTax * rate) / 100)

    this.form.items[i].cgst_amount = amount
  }
  calculateIgstAmount(i: any){
    let amountWithoutTax = Number(this.form.items[i].amount)
    let rate = Number(this.form.items[i].igst_percentage)

    let amount = 0

    amount = Number((amountWithoutTax * rate) / 100)

    this.form.items[i].igst_amount = amount
  }
  calculateCessAmount(i: any){
    let amountWithoutTax = Number(this.form.items[i].amount)
    let rate = Number(this.form.items[i].cess_percentage)

    let amount = 0

    amount = Number((amountWithoutTax * rate) / 100)

    this.form.items[i].cess_amount = amount
  }
  calculateTotalAmount(){
    let totalAmount = 0
    let totalSgstAmount = 0
    let totalUtgstAmount = 0
    let totalCgstAmount = 0
    let totalIgstAmount = 0
    let totalCessAmount = 0
    let totalWithTax = 0

    for(let i = 0; i<this.form.items.length; i++){
      totalAmount += Number(this.form.items[i].amount)

      totalSgstAmount += Number(this.form.items[i].sgst_amount)
      totalUtgstAmount += Number(this.form.items[i].utgst_amount)
      totalCgstAmount += Number(this.form.items[i].cgst_amount)
      totalIgstAmount += Number(this.form.items[i].igst_amount)
      totalCessAmount += Number(this.form.items[i].cess_amount)
      
    }
    this.form.total_amount = totalAmount

    this.form.total_sgst_amount = totalSgstAmount
    this.form.total_utgst_amount = totalUtgstAmount
    this.form.total_cgst_amount = totalCgstAmount
    this.form.total_igst_amount = totalIgstAmount
    this.form.total_cess_amount = totalCessAmount
    
    this.form.total_with_tax = Number(totalAmount + totalSgstAmount + totalUtgstAmount + totalCgstAmount + totalIgstAmount + totalCessAmount)

  }

  uploadFile(eve: any) {
    this.form.attachments=[];
    this.importData = eve.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.importData); 
    reader.onload = (event) => { 

      let obj={
        organization:this.localStorageData.organisation_details[0].id,
        file_data:event.target!.result,
        mime_type:eve.target.files[0].type
      }
      this.form.attachments.push(obj);
    }
  }
  

  onSubmit(){
    if(!this.prefieldData.id){
      this.form.organization=this.localStorageData.organisation_details[0].id;
      
      this.procurementAPIService.addGeneralAdminExpenses(this.form).subscribe(data=>{
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });

        this.router.navigateByUrl('/pms/store/procurement/general-administration-expenses/list');
      })
    } else {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
      params.set('method', 'edit');
      params.set('id', this.prefieldData.id);
      
      for(let i = 0; i<this.form.items.length; i++){
        this.form.items[i].general_admin_expense = this.prefieldData.id ? this.prefieldData.id : ''
        
      }

      this.procurementAPIService.updateGeneralAdminExpenses(params, this.form).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        
        this.router.navigateByUrl('/pms/store/procurement/general-administration-expenses/list');
      })
    }
  }

  getPrefieldData() {
    let params = new URLSearchParams();
    let id = JSON.parse(this.activeroute.snapshot.paramMap.get('id') || '{}')
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', id);
    this.procurementAPIService.getGeneralAdminExpenses(params).subscribe(data => {
      this.prefieldData = data
      
      this.generatePrepopulateData()
    });
  }
}
