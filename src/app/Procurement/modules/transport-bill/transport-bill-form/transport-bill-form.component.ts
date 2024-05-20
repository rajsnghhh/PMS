import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';

@Component({
  selector: 'app-transport-bill-form',
  templateUrl: './transport-bill-form.component.html',
  styleUrls: ['./transport-bill-form.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class TransportBillFormComponent implements OnInit {


  localStorageData: any;
  vendorList: any = [];
  siteList:any=[];
  stateList: any
  gstTaxlist:any
  importData:any;
  prevData: any;
  procurementIssueList: any;
  expenseList:any;

  form: any = {
    organization: '',
    financialyear:'',
    invoice_no: '',
    date: (new Date()).toISOString().substring(0,10),
    rate_to_fill: '',
    bill_no: '',
    bill_date:(new Date()).toISOString().substring(0,10),
    hsn_sac_code: '',
    transporter: '',
    site:[],
    siteName:'',
    site_state: '',
    transporter_state: '',
    items: [],
    expense_details:[],
    tax:[]
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
    this.viewVendorList()
    this.getStateList()
    this.addMoreExpenseItems()
    this.addMoreTaxData()
    this.prevData = this.datasharedservice.getSharedData();
    if (this.prevData?.transporter_bill_to) {
      this.form.transporter = this.prevData.transporter_bill_to
    }
    this.getGRNlist()
    this.expanceList();
    this.getTaxHeadData();
    this.getSiteList()
  }

  uploadFile(eve: any) {
    this.form.attachments = [];
    this.importData = eve.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.importData);
    reader.onload = (event) => {

      let obj = {
        organization: this.localStorageData.organisation_details[0].id,
        file_data: event.target!.result,
        mime_type: eve.target.files[0].type
      }
      this.form.attachments.push(obj);
    }
  }


  onSubmit() {

    this.form.organization = this.localStorageData.organisation_details[0].id;
    this.form.financialyear = this.localStorageData.financial_year[0].id;
    this.form.site = this.localStorageData?.site_data.id;

    this.procurementAPIService.createTransportBill(this.form).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessAdd, '', {
        timeOut: 2000,
      });
      this.router.navigateByUrl('/pms/store/procurement/transport-bill/list');
    })

  }
  getGRNlist() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('date__gt', this.prevData.from_date);
    params.set('date__lt', this.prevData.to_date);
    params.set('transporter__in', this.prevData.transporter);
    params.set('vendor__in', this.prevData.vendor);
    params.set('site__in', this.prevData.site);
    params.set('procurement_grn_item__item__material_type__in', this.prevData.group);
    params.set('procurement_grn_item__item__in', this.prevData.item);
    params.set('store', this.prevData.to_location);

    this.procurementAPIService.getGRNList(params).subscribe(data => {
      for (let val of data.results) {
        for (let item of val.grn_items) {
          item.from = 'GRN'
          item.lrNo = val.lr_no;
          item.challanNo = val.challan_no;
          item.km_run=1;
          if (val?.purchase_details) {
            item.pbNo = val?.purchase_details[0]?.request_code;
          } else {
            item.pbNo = '';
          }

          if (val?.purchase_order_details) {
            item.poNo = val?.purchase_order_details[0]?.request_code;
          } else {
            item.poNo = '';
          }

          if (val?.vendor_details) {
            item.vendorName = val?.vendor_details?.data?.vendor_name;
          } else {
            item.vendorName = '';
          }

          if (item?.hsn_details) {
            item.hsn_code = item?.hsn_details[0].hsn_code;
          } else {
            item.hsn_code = '';
          }

          if (item?.unit_of_mesurement_details) {
            item.uom = item?.unit_of_mesurement_details[0].id;
          } else {
            item.uom = '';
          }

          if (item?.material_details) {
            item.tolerance = item?.material_details[0].material_tolerance;
          } else {
            item.tolerance = 0;
          }

          if(item.quantity>=item.received_quantity){
            item.short_age_qty=item.quantity-item.received_quantity;
            item.excess_qty=0;
          }
          
          if(item.received_quantity>=item.quantity){
            item.excess_qty=item.received_quantity-item.quantity;
            item.short_age_qty=0;
          }

          this.form.items.push(item)
        }
      }
      this.getIssueList()
    })
  }

  getIssueList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('created_at__gt', this.prevData.from_date);
    params.set('created_at__lt', this.prevData.to_date);
    params.set('transporter__in', this.prevData.transporter_bill_to);
    params.set('vendor__in', this.prevData.vendor);
    params.set('site__in', this.prevData.site);
    params.set('procurement_material_issue_item__requested_material__material_type__in',this.prevData.group);
    params.set('procurement_material_issue_item__requested_material__in',this.prevData.item);
    params.set('store',this.prevData.from_location);
    this.procurementAPIService.getMaterialIssueDetails(params).subscribe(data => {
      for (let val of data.results) {
        for (let item of val.issue_items) {
          item.from = 'Issue';
          item.lrNo = val.lr_number;
          item.challanNo = '';
          item.km_run=1;
          item.pbNo = '';
          item.poNo = ''
          if (val?.vendor_details) {
            item.vendorName = val?.vendor_details?.data?.vendor_name;
          } else {
            item.vendorName = '';
          }

          if (item?.hsn_details) {
            item.hsn_code = item?.hsn_details[0].hsn_code;
          } else {
            item.hsn_code = '';
          }

          
          if (item?.unit_of_mesurement_details) {
            item.uom = item?.unit_of_mesurement_details[0].id;
          } else {
            item.uom = '';
          }
          
          if (item?.material_details) {
            item.tolerance = item?.material_details[0].material_tolerance;
          } else {
            item.tolerance = 0;
          }

          if(item.quantity>=item.received_quantity){
            item.short_age_qty=item.quantity-item.received_quantity;
            item.excess_qty=0;
          }

          if(item.received_quantity>=item.quantity){
            item.excess_qty=item.received_quantity-item.quantity;
            item.short_age_qty=0;
          }

          this.form.items.push(item)
        }
      }
      this.calculateOnAmount()
    })
  }

  calculateOnAmount(){
    this.form.expense_details[0].calculate_on_amount=0;
    for(let data of this.form.items){
      this.form.expense_details[0].calculate_on_amount=Number(this.form.expense_details[0].calculate_on_amount) + Number(data.amount)
    }

    this.form.tax[0].total_calculate_amount=this.form.expense_details[0].calculate_on_amount;

    this.calculateInvoiceAmount();

  }

  calculateAmount(index:any){
    this.form.items[index].amount= this.form.items[index].quantity *  this.form.items[index].rate *  this.form.items[index].km_run;


    if(this.form.items[index].quantity>=this.form.items[index].received_quantity){
      this.form.items[index].short_age_qty=this.form.items[index].quantity-this.form.items[index].received_quantity;
      this.form.items[index].excess_qty=0;
    }
    
    if(this.form.items[index].received_quantity>=this.form.items[index].quantity){
      this.form.items[index].excess_qty=this.form.items[index].received_quantity-this.form.items[index].quantity;
      this.form.items[index].short_age_qty=0;
    }
    this.calculateOnAmount()

  }

  calculateTotalAmount(index: number): void {
    const item = this.form.expense_details[index];

    item.sgst_amount = item.expense_amount * item.sgst_percentage / 100
    item.cgst_amount = item.expense_amount * item.cgst_percentage / 100
    item.igst_amount = item.expense_amount * item.igst_percentage / 100
    item.utgst_amount = item.expense_amount * item.utgst_percentage / 100
    item.cess_amount = item.expense_amount * item.cess_percentage / 100
    item.total_expense_amount = (item.sgst_amount + item.cgst_amount + item.igst_amount + item.utgst_amount + item.cess_amount).toFixed(2)
  }

  calculateGrossAmount(index: number): void {
    const item = this.form.expense_details[index];
    item.expense_amount = item.calculate_on_amount * item.expense_percentage / 100
  }

  taxMaterialExpense(tax: any, index: any) {
    const item = this.form.expense_details[index];
    const taxItemId = tax.target.value;

    const selectedTaxData = this.gstTaxlist.find((item: any) => item.id === parseInt(taxItemId));
    if (selectedTaxData) {

      item.sgst_percentage = selectedTaxData.sgst_rate;
      item.cgst_percentage = selectedTaxData.cgst_rate;
      item.igst_percentage = selectedTaxData.igst_rate;
      item.utgst_percentage = selectedTaxData.utgst_rate;
      item.cess_percentage = selectedTaxData.cess;
      item.sgst_amount = item.expense_amount * item.sgst_percentage / 100
      item.cgst_amount = item.expense_amount * item.cgst_percentage / 100
      item.igst_amount = item.expense_amount * item.igst_percentage / 100
      item.utgst_amount = item.expense_amount * item.utgst_percentage / 100
      item.cess_amount = item.expense_amount * item.cess_percentage / 100


      item.total_expense_amount = (item.sgst_amount + item.cgst_amount + item.igst_amount + item.utgst_amount + item.cess_amount).toFixed(2)

    }
    //this.calculateFinalBillvalue()
  }

  taxChangeMaterial(tax: any, index: any) {
    const item = this.form.tax[index];
    const taxItemId = tax.target.value;

    const selectedTaxData = this.gstTaxlist.find((item: any) => item.id === parseInt(taxItemId));
    if (selectedTaxData) {

      item.sgst_percentage = selectedTaxData.sgst_rate;
      item.cgst_percentage = selectedTaxData.cgst_rate;
      item.igst_percentage = selectedTaxData.igst_rate;
      item.utgst_percentage = selectedTaxData.utgst_rate;
      item.cess_percentage = selectedTaxData.cess;
      item.sgst_amount = item.total_calculate_amount * item.sgst_percentage / 100
      item.cgst_amount = item.total_calculate_amount * item.cgst_percentage / 100
      item.igst_amount = item.total_calculate_amount * item.igst_percentage / 100
      item.utgst_amount = item.total_calculate_amount * item.utgst_percentage / 100
      item.cess_amount = item.total_calculate_amount * item.cess_percentage / 100

    }
    this.calculateInvoiceAmount();
  }

  calculateInvoiceAmount(){
    if(this.form.tax[0].tax_head==''){
      this.form.tax[0].invoice_amount=this.form.tax[0].total_calculate_amount;
      this.form.tax[0].final_balance= (Number(this.form.tax[0].invoice_amount) + Number(this.form.tax[0].advance_amount)).toFixed(2)
    }else{
      this.form.tax[0].invoice_amount= Number(this.form.tax[0].total_calculate_amount) + 
      Number(this.form.tax[0].sgst_amount) + Number(this.form.tax[0].cgst_amount) +
      Number(this.form.tax[0].igst_amount) + Number(this.form.tax[0].utgst_amount) +
      Number(this.form.tax[0].cess_amount) + Number(this.form.tax[0].round_off);

      this.form.tax[0].final_balance= (Number(this.form.tax[0].invoice_amount) + Number(this.form.tax[0].advance_amount)).toFixed(2)

    }
  }

  addMoreExpenseItems() {
    this.form.expense_details.push({
      organization: this.localStorageData?.organisation_details[0]?.id,
      expense_head: '',
      sac_code: '',
      calculate_on_amount: 0,
      expense_percentage: 0,
      expense_amount: 0,
      tax_head: '',
      sgst_percentage: 0,
      cgst_percentage: 0,
      igst_percentage: 0,
      utgst_percentage: 0,
      cess_percentage: 0,
      sgst_amount: 0,
      cgst_amount: 0,
      igst_amount: 0,
      utgst_amount: 0,
      cess_amount: 0,
      total_expense_amount: 0
    })
  }
  addMoreTaxData() {
    this.form.tax.push({
      organization: this.localStorageData?.organisation_details[0]?.id,
      tax_head: '',
      sgst_percentage: 0,
      cgst_percentage: 0,
      igst_percentage: 0,
      utgst_percentage: 0,
      cess_percentage: 0,
      sgst_amount: 0,
      cgst_amount: 0,
      igst_amount: 0,
      utgst_amount: 0,
      cess_amount: 0,
      total_calculate_amount: 0,
      on_applicable_gst:'onItem',
      shortage_charge:0,
      round_off:0,
      invoice_amount:0,
      advance_amount:0,
      final_balance:0,
      repair_maintenance_amount:0
    })
  }
  
  delete(index: any) {
    this.form.items.splice(index, 1);
    this.calculateOnAmount()
  }

  gstRadioChange(value:any){
    
    if(value=='afterDeduction'){
      this.form.tax[0].total_calculate_amount=Number(this.form.expense_details[0].calculate_on_amount) + Number(this.form.expense_details[0].total_expense_amount) - this.form.tax[0].shortage_charge -this.form.tax[0].repair_maintenance_amount;
      this.form.tax[0].tax_head='';
      this.form.tax[0].sgst_percentage=0;
      this.form.tax[0].cgst_percentage=0;
      this.form.tax[0].igst_percentage=0;
      this.form.tax[0].utgst_percentage=0;
      this.form.tax[0].cess_percentage=0;
      this.form.tax[0].sgst_amount=0;
      this.form.tax[0].cgst_amount=0;
      this.form.tax[0].igst_amount=0;
      this.form.tax[0].utgst_amount=0;
      this.form.tax[0].cess_amount=0;
    }else{
      this.calculateOnAmount()
      this.form.tax[0].tax_head='';
      this.form.tax[0].sgst_percentage=0;
      this.form.tax[0].cgst_percentage=0;
      this.form.tax[0].igst_percentage=0;
      this.form.tax[0].utgst_percentage=0;
      this.form.tax[0].cess_percentage=0;
      this.form.tax[0].sgst_amount=0;
      this.form.tax[0].cgst_amount=0;
      this.form.tax[0].igst_amount=0;
      this.form.tax[0].utgst_amount=0;
      this.form.tax[0].cess_amount=0;
    }

    this.calculateInvoiceAmount();

  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    params.set('tax_type', 'gst_tax');

    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      this.gstTaxlist = data.results
    });
  }

  expanceList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getExpenseMasterList(params).subscribe(data => {
      this.expenseList = data.results;
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
  getStateList() {
    let countryId = new URLSearchParams();
    countryId.set('country_id', '102')
    this.apiservice.getStateList(countryId).subscribe(data => {
      this.stateList = data;
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

}
