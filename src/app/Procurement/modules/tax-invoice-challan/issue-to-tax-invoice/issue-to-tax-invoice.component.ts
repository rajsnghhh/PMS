import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../purchase/data-sharing.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';


@Component({
  selector: 'app-issue-to-tax-invoice',
  templateUrl: './issue-to-tax-invoice.component.html',
  styleUrls: ['./issue-to-tax-invoice.component.scss',
    '../../../../../assets/scss/scrollableTable.scss']
})
export class IssueToTaxInvoiceComponent {

  localStorageData: any;
  stateList: any = []
  siteList: any = []
  gstTaxlist: any = []
  workOrderList: any = []
  vendorList: any = [];
  issueItemId: any;
  storeList: any = [];
  expenseList: any = [];
  scope: any = 'itemRate'

  form: any = {
    bill_no: '',
    inv_date: '',
    from_state: '',
    gst_calculation_on: '',
    customer: '',
    buyer: '',
    address: '',
    delivery_address: '',
    customer_account_gst: '',
    buyer_state: '',
    site: [],
    is_rcm: '',
    manual_bill_no: '',
    account_contact_person: '',
    tax_type: '',
    wo: '',
    istp_no: '',
    royalty_no: '',
    name_of_work: '',
    e_way_bill_no: '',
    is_taxable: false,
    transporter: '',
    transporter_gst: '',
    distance: 0,
    carrying_vehicle_no: '',
    lr_date: '',
    lr_no: '',
    seller_address: '',
    dispatched_address: '',
    bill_to_address: '',
    items: [],
    invoice_expenses: [],
    fileData: '',
    attachments: [],
    discount_percentage: 0,
    discount_amount: 0,
    other_charges: 0,
    round_off: 0,
    total_bill_value: 0,
  };


  total_Stock_qty: any
  total_unit_rate: any
  total_item_amt: any
  total_discount_amt: any
  total_taxable_amt: any
  total_sgst_amt: any
  total_cgst_amt: any
  total_igst_amt: any
  total_net_amt: any
  total_utgst_amt: any
  total_cess_amt: any

  importData: any;

  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private procurementAPIService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private dataService: DataSharingService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.issueItemId = this.activeroute.snapshot.paramMap.get('issueIds')

    this.getStateList()
    this.getSiteList()
    this.getTaxHeadData()
    this.getWOList()
    this.viewVendorList()
    this.getStoreList()
    this.expanceList()
    this.getProcurementIssueList()
    this.addMoreExpenseItems()
  }
  changeWO(woId: any) {
    this.form.name_of_work = this.workOrderList.find((data: any) => data.id == woId).work_description
  }
  changeVendor(vendorId: any) {
    this.form.transporter_gst = this.vendorList.find((data: any) => data.id == vendorId).vendor_master_data?.state;
  }

  changeBuyer(vendorId: any) {
    this.form.buyer_state = this.vendorList.find((data: any) => data.id == vendorId).vendor_master_data?.state;
  }

  changeCustomer(vendorId: any) {
    this.form.customer_account_gst = this.vendorList.find((data: any) => data.id == vendorId).vendor_master_data?.state;
  }

 

  calculateFinalBillvalue() {
    this.form.total_bill_value = (Number(this.total_net_amt) + Number(this.form.invoice_expenses[0].total_expense_amount) + Number(this.form.other_charges) +
      Number(this.form.round_off) - Number(this.form.discount_amount)).toFixed(2)

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
    this.procurementAPIService.createTaxInvoice(this.form).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessAdd, '', {
        timeOut: 2000,
      });
      this.router.navigateByUrl('/pms/store/procurement/tax-invoice-challan/list');
    })
  }


  addMoreExpenseItems() {
    this.form.invoice_expenses.push({
      organization: this.localStorageData?.organisation_details[0]?.id,
      expense_head: '',
      sac_code: '',
      calculate_on_amount: 0,
      expense_percentage: 0,
      expense_amount: 0,
      gst_type: '',
      sgst_percentage_expense: 0,
      cgst_percentage_expense: 0,
      igst_percentage_expense: 0,
      utgst_percentage_expense: 0,
      cess_percentage_expense: 0,
      sgst_amount_expense: 0,
      cgst_amount_expense: 0,
      igst_amount_expense: 0,
      utgst_amount_expense: 0,
      cess_amount_expense: 0,
      total_expense_amount: 0
    })
  }

  buttonChange(tableScope: any) {
    this.scope = tableScope;
  }

  discountChange(discountvalue: any) {
    this.form.discount_amount = (((Number(this.total_net_amt) + Number(this.form.invoice_expenses[0].total_expense_amount)) * discountvalue) / 100).toFixed(2)
    this.calculateFinalBillvalue()
  }

  showMaterialsCalculatedAmt(index: number): void {
    const item = this.form.items[index];
    item.item_amount = item.quantity * item.unit_rate;

    const discount_amt = item.item_amount * item.discount_percentage / 100
    item.discount_amount = discount_amt
    item.tax_amount = item.item_amount - discount_amt

    item.sgst_amount = item.tax_amount * item.sgst_percentage / 100
    item.cgst_amount = item.tax_amount * item.cgst_percentage / 100
    item.igst_amount = item.tax_amount * item.igst_percentage / 100
    item.utgst_amount = item.tax_amount * item.utgst_percentage / 100
    item.cess_amount = item.tax_amount * item.cess_percentage / 100
    item.total_amount = (item.tax_amount + item.sgst_amount + item.cgst_amount + item.igst_amount + item.utgst_amount + item.cess_amount).toFixed(2)
    this.calculateTotals()

  }

  calculateTotalAmount(index: number): void {
    const item = this.form.invoice_expenses[index];

    item.sgst_amount_expense = item.expense_amount * item.sgst_percentage_expense / 100
    item.cgst_amount_expense = item.expense_amount * item.cgst_percentage_expense / 100
    item.igst_amount_expense = item.expense_amount * item.igst_percentage_expense / 100
    item.utgst_amount_expense = item.expense_amount * item.utgst_percentage_expense / 100
    item.cess_amount_expense = item.expense_amount * item.cess_percentage_expense / 100
    item.total_expense_amount = (item.sgst_amount_expense + item.cgst_amount_expense + item.igst_amount_expense + item.utgst_amount_expense + item.cess_amount_expense).toFixed(2)
  }

  calculateGrossAmount(index: number): void {
    const item = this.form.invoice_expenses[index];
    item.expense_amount = item.calculate_on_amount * item.expense_percentage / 100
  }

  taxMaterialExpense(tax: any, index: any) {
    const item = this.form.invoice_expenses[index];
    const taxItemId = tax.target.value;

    const selectedTaxData = this.gstTaxlist.find((item: any) => item.id === parseInt(taxItemId));
    if (selectedTaxData) {

      item.sgst_percentage_expense = selectedTaxData.sgst_rate;
      item.cgst_percentage_expense = selectedTaxData.cgst_rate;
      item.igst_percentage_expense = selectedTaxData.igst_rate;
      item.utgst_percentage_expense = selectedTaxData.utgst_rate;
      item.cess_percentage_expense = selectedTaxData.cess;
      item.sgst_amount_expense = item.expense_amount * item.sgst_percentage_expense / 100
      item.cgst_amount_expense = item.expense_amount * item.cgst_percentage_expense / 100
      item.igst_amount_expense = item.expense_amount * item.igst_percentage_expense / 100
      item.utgst_amount_expense = item.expense_amount * item.utgst_percentage_expense / 100
      item.cess_amount_expense = item.expense_amount * item.cess_percentage_expense / 100


      item.total_expense_amount = (item.sgst_amount_expense + item.cgst_amount_expense + item.igst_amount_expense + item.utgst_amount_expense + item.cess_amount_expense).toFixed(2)

    }
    this.calculateFinalBillvalue()
  }

  taxMaterialsAutoFilled(tax: any, index: any) {
    const item = this.form.items[index];
    const taxItemId = tax.target.value;

    const selectedTaxData = this.gstTaxlist.find((item: any) => item.id === parseInt(taxItemId));
    if (selectedTaxData) {

      item.sgst_percentage = selectedTaxData.sgst_rate;
      item.cgst_percentage = selectedTaxData.cgst_rate;
      item.igst_percentage = selectedTaxData.igst_rate;
      item.utgst_percentage = selectedTaxData.utgst_rate;
      item.cess_percentage = selectedTaxData.cess;
      item.sgst_amount = item.tax_amount * item.sgst_percentage / 100
      item.cgst_amount = item.tax_amount * item.cgst_percentage / 100
      item.igst_amount = item.tax_amount * item.igst_percentage / 100
      item.utgst_amount = item.tax_amount * item.utgst_percentage / 100
      item.cess_amount = item.tax_amount * item.cess_percentage / 100


      item.total_amount = (item.tax_amount + item.sgst_amount + item.cgst_amount + item.igst_amount + item.utgst_amount + item.cess_amount).toFixed(2)

    }
    this.calculateTotals()
    this.calculateFinalBillvalue()
  }

  set_discount_pecentage_blanck(index: number) {
    const item = this.form.items[index];
    item.discount_percentage = ''

    item.tax_amount = item.item_amount - item.discount_amount

    item.sgst_amount = item.tax_amount * item.sgst_percentage / 100
    item.cgst_amount = item.tax_amount * item.cgst_percentage / 100
    item.igst_amount = item.tax_amount * item.igst_percentage / 100
    item.utgst_amount = item.tax_amount * item.utgst_percentage / 100
    item.cess_amount = item.tax_amount * item.cess_percentage / 100
    item.total_amount = (item.tax_amount + item.sgst_amount + item.cgst_amount + item.igst_amount + item.utgst_amount + item.cess_amount).toFixed(2)
    this.calculateTotals()
  }
  calculateTotals() {
    this.total_Stock_qty = 0;
    this.total_unit_rate = 0;
    this.total_item_amt = 0;
    this.total_discount_amt = 0;
    this.total_taxable_amt = 0;
    this.total_sgst_amt = 0;
    this.total_cgst_amt = 0;
    this.total_igst_amt = 0;
    this.total_net_amt = 0;
    this.total_utgst_amt = 0;
    this.total_cess_amt = 0;

    for (let i = 0; i < this.form.items.length; i++) {
      this.total_Stock_qty += +this.form.items[i].quantity;
      this.total_unit_rate += +this.form.items[i].unit_rate;
      this.total_item_amt += +this.form.items[i].item_amount;
      this.total_discount_amt += +this.form.items[i].discount_amount;
      this.total_taxable_amt += +this.form.items[i].tax_amount;
      this.total_sgst_amt += +this.form.items[i].sgst_amount;
      this.total_cgst_amt += +this.form.items[i].cgst_amount;
      this.total_igst_amt += +this.form.items[i].igst_amount;
      this.total_net_amt += +this.form.items[i].total_amount;
      this.total_utgst_amt += +this.form.items[i].utgst_amount;
      this.total_cess_amt += +this.form.items[i].cess_amount;
      this.updateTotalNetAmt(this.total_net_amt)
    }
  }

  updateTotalNetAmt(newValue: number) {
    // ... your logic to update total_net_amt
    this.dataService.updateTotalNetAmt(newValue);
  }

  expanceList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getExpenseMasterList(params).subscribe(data => {
      this.expenseList = data.results;
    })
  }

  getStoreList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.storeList = data.results;
    })

  }
  getProcurementIssueList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('material_issue__project', this.localStorageData?.project_data?.id)
    params.set('material_issue__site', this.localStorageData?.site_data?.id);
    params.set('material_issue__financialyear', this.localStorageData.financial_year[0].id);
    params.set('id__in', this.issueItemId)
    this.procurementAPIService.getProcurementIssueList(params).subscribe(data => {
      this.form.items = data.results?.Data;
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
  getWOList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getWorkOrderList(params).subscribe(data => {
      this.workOrderList = data.results;
    })
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
