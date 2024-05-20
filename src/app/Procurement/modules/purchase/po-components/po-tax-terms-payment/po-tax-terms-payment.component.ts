import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../data-sharing.service';

@Component({
  selector: 'app-po-tax-terms-payment',
  templateUrl: './po-tax-terms-payment.component.html',
  styleUrls: ['./po-tax-terms-payment.component.scss']
})
export class PoTaxTermsPaymentComponent implements OnInit, OnChanges {
  event: any;
  termsFromMaster: Array<any> = [];
  localStorageData: any;

  importData:any;
  form: any = {}
  taxHeads: any = []
  activeTab: boolean[] = []
  purchase_tax: any = []
  disabledEdit = false
  setTotalNetAmt: number = 0

  payment_total_percent: any
  payment_total_amt: any

  @Input() prefieldData: any;
  @Input() reload: any;
  @Input() scope: any;
  @Input() disableEdit: any;

  @Output() parrentAction = new EventEmitter<any>();
  @Output() actionButton = new EventEmitter<any>();

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;


  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService


  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if(this.prefieldData.id) {
      this.setPrefieldData()
    }
  }

  setPrefieldData() {
    this.form.po_expense = this.prefieldData.po_expense
    this.form.terms_and_conditions = this.prefieldData.terms_and_conditions
    this.form.payment_schedule = this.prefieldData.payment_schedule


    this.setUpTax()
    for(let i=0;i<this.purchase_tax.length;i++) {      
      this.purchase_tax[i].included = this.prefieldData.po_tax[i].included
      this.purchase_tax[i].choice = this.prefieldData.po_tax[i].choice        
      this.purchase_tax[i].tax_percentage = this.prefieldData.po_tax[i].tax_percentage
      this.purchase_tax[i].tax_amount = this.prefieldData.po_tax[i].tax_amount
      this.purchase_tax[i].tax_head = this.prefieldData.po_tax[i].tax_head
    }

    // this.totalItemAmt = this.prefieldData.total_item_taxable_amount    
    this.calculateTaxes()

  }

  ngOnInit() {
    this.activeTab[1] = true
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.setUpTax()
    

    if(this.scope == 'create') {
      this.getTermsFromMaster();
    }
    

    this.getTaxHeadData();
    // this.calculatePaymentTotals()

    this.form = {
      po_tax_terms_payment_Valid: false,
      terms_and_conditions: [],
    };
    if(this.scope == 'create') {
      this.form.payment_schedule = 
      [
        { 
          percent: 100, 
          percent_type: '', 
          payment_credit_days: 0, 
          notify_days: 0, 
          description: '', 
          amount: 0 ,
          organization : this.localStorageData.organisation_details[0].id
        }
      ]
    }
    this.calculatePaymentTotals()
    this.dataService.totalNetAmt$.subscribe(totalNetAmt => {
      if (totalNetAmt !== null) {
        this.setTotalNetAmt = totalNetAmt
        this.form.total_item_total_amount = totalNetAmt
        this.calculateTaxes()
      }
    });
    this.dataService.totalItemAmt$.subscribe(totalItemAmt => {
      if (totalItemAmt !== null) {
        this.form.total_item_item_amount = totalItemAmt
      }
    });
    this.dataService.totalTaxAmt$.subscribe(totalTaxAmt => {
      if (totalTaxAmt !== null) {
        this.form.total_item_taxable_amount = totalTaxAmt
      }
    });

  }

  setUpTax() {
    this.purchase_tax = [
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Discount",
        "extra": null,
        "choice": null,
        "calculate_on": "[On Item Value]",
        "calculate_on_frontendReferance" : "total_item_item_amount",
        "tax_on_parent": "total_item_item_amount",
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": true,
        "included": false,
        "add": false,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
        "name": "Packing Charges",
        "extra": null,
        "choice": null,
        "calculate_on": "[On Item Value]",
        "calculate_on_frontendReferance" : "total_item_item_amount",
        "tax_on_parent": "total_item_item_amount",
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Excise",
        "extra": null,
        "choice": null,
        "calculate_on": "[On Balance]",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": true,
        "included": false,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Edu Cess.",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "SHE Cess.",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Discount after Excise",
        "extra": null,
        "choice": null,
        "calculate_on": "[After Excise]",
        "calculate_on_frontendReferance" : "afterExcise_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": "Excise",
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": false,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
        "name": "If Any Other Discount.",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": false,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "VAT",
        "extra": null,
        "choice": null,
        "calculate_on": "[On Balance]",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": true,
        "included": false,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Aditional VAT",
        "extra": null,
        "choice": null,
        "calculate_on": "[On Balance]",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": true,
        "included": false,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "ET",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Octroi",
        "extra": null,
        "choice": null,
        "calculate_on": "[On Balance after ET]",
        "calculate_on_frontendReferance" : "afterET_Amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": "ET",
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": true,
        "included": false,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Packing Charges",
        "extra": null,
        "choice": null,
        "calculate_on": "[On Balance after ET]",
        "calculate_on_frontendReferance" : "afterET_Amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": "ET",
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
        "name": "Freight",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": false,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "VAT On Freight",
        "extra": null,
        "choice": null,
        "calculate_on": "[On FREIGHT]",
        "calculate_on_frontendReferance" : "freight_Amount",
        "tax_on_parent": null,
        "tax_on_self": "Freight",
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": true,
        "included": false,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Additional VAT On Freight",
        "extra": null,
        "choice": null,
        "calculate_on": "[On FREIGHT]",
        "calculate_on_frontendReferance" : "freight_Amount",
        "tax_on_parent": null,
        "tax_on_self": "Freight",
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": true,
        "included": false,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
        "name": "Royalty Expenses",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": false,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
        "name": "If Any Other Add.",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": false,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
        "name": "Service Charges",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": false,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [
          {
            name : 'ON SERVICE CHARGE',
            value: 'serviceCharge_Amount'
          },
          {
            name : 'ON ITEM VALUE',
            value: 'total_item_item_amount'
          }
        ],
        "sac_code": null,
        "hidden" : true,
        "name": "Service Tax",
        "extra": null,
        "choice": 'serviceCharge_Amount',
        "calculate_on": "",
        "calculate_on_frontendReferance" : "serviceCharge_Amount",
        "tax_on_parent": null,
        "tax_on_self": "Service Charges",
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": true,
        "included": false,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
        "name": "Quality Deduction",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": false,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": false,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [
          {
            name : 'ON ITEM VALUE',
            value: 'total_item_item_amount'
          },
          // {
          //   name : 'ON BEFORE VAT/CST',
          //   value: 'total_item_taxable_amount'
          // },
          {
            name : 'ON AFTER ITEM DISCOUNT',
            value: 'total_item_total_amount'
          }
        ],
        "sac_code": null,
        "hidden" : false,
        "name": "Tax Collected at Source",
        "extra": null,
        "choice": 'total_item_item_amount',
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_item_amount",
        "tax_on_parent": "total_item_item_amount",
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": true,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": true,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : true,
        "name": "Other Discount",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": false,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": false,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      },
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
        "name": "Round Off",
        "extra": null,
        "choice": null,
        "calculate_on": "",
        "calculate_on_frontendReferance" : "total_item_total_amount",
        "tax_on_parent": null,
        "tax_on_self": null,
        "tax_on_self_after": null,
        "tax_condition": "",
        "tax_percentage_applicable": false,
        "tax_percentage": 0,
        "tax_amount": 0,
        "sgst_percentage": 0,
        "cgst_percentage": 0,
        "igst_percentage": 0,
        "utgst_percentage": 0,
        "cess_percentage": 0,
        "sgst_amount": 0,
        "cgst_amount": 0,
        "igst_amount": 0,
        "utgst_amount": 0,
        "cess_amount": 0,
        "total_tax_amount": 0,
        "inclided_applicable": false,
        "included": true,
        "add": true,
        "organization": this.localStorageData.organisation_details[0].id,
        "tax_head_applicable": false,
        "tax_head": null
      }
    ]
  }

  changeRadioOptions(index: any) {
    this.purchase_tax[index].calculate_on_frontendReferance = this.purchase_tax[index].choice
    this.purchase_tax[index].tax_on_parent = this.purchase_tax[index].choice

    if (this.purchase_tax[index].choice == 'serviceCharge_Amount') {
      this.purchase_tax[index].tax_on_self = 'Service Charges'
      this.purchase_tax[index].tax_on_parent = null
    } else {
      this.purchase_tax[index].tax_on_self = null
    }
    this.calculateTaxes()
  }


  changeamount(i: any) {
    this.purchase_tax[i].tax_percentage = 0
    if (this.purchase_tax[i].tax_amount == '') {
      this.purchase_tax[i].tax_amount = 0
    }
    this.calculateTaxes()
  }

  taxHeadChange(index: any, scope: any) {
    if (scope == '') {
      let filter = this.taxHeads.filter((item: { id: any; }) => item.id == this.purchase_tax[index].tax_head)
      if (filter[0].amount != 0) {
        this.purchase_tax[index].tax_amount = filter[0].amount
        this.purchase_tax[index].tax_percentage = 0
      } else {
        this.purchase_tax[index].tax_percentage = filter[0].percentage
      }
      this.calculateTaxes()
    }
    if (scope == 'exc') {
      let filter = this.taxHeads.filter((item: { id: any; }) => item.id == this.form.items[index].excise_tax_head)
      if (filter[0].amount != 0) {
        this.form.items[index].excise_tax_amount = filter[0].amount
        this.form.items[index].excise_tax_percentage = 0
      } else {
        this.form.items[index].excise_tax_percentage = filter[0].percentage
      }
      this.changeInputValue('')
    }
    if (scope == 'tax') {
      let filter = this.taxHeads.filter((item: { id: any; }) => item.id == this.form.items[index].tax_head)
      if (filter[0].amount != 0) {
        this.form.items[index].tax_amount = filter[0].amount
        this.form.items[index].tax_percentage = 0
      } else {
        this.form.items[index].tax_percentage = filter[0].percentage
      }
      this.changeInputValue('')
    }

  }

  changeInputValue(scope: any) {
    this.form.total_item_item_quantity = 0
    this.form.total_item_item_weight = 0
    this.form.total_item_item_amount = 0
    this.form.total_item_taxable_amount = 0
    this.form.total_item_disc_amount = 0

    this.form.total_item_taxable_amount = 0
    this.form.total_item_excise_tax_amount = 0
    this.form.total_item_tax_amount = 0
    this.form.total_item_total_amount = 0


    for (let i = 0; i < this.form.items?.length; i++) {
      if (!this.form.items[i]?.quantity) {
        this.form.items[i].quantity = 0
      }
      if (!this.form.items[i]?.weight) {
        this.form.items[i].weight = 0
      }
      if (!this.form.items[i]?.rate) {
        this.form.items[i].rate = 0
      }
      if (!this.form.items[i]?.disc_percentage) {
        this.form.items[i].disc_percentage = 0
      }
      if (!this.form.items[i]?.disc_amount) {
        this.form.items[i].disc_amount = 0
      }
      if (!this.form.items[i]?.excise_tax_percentage) {
        this.form.items[i].excise_tax_percentage = 0
      }
      if (!this.form.items[i]?.excise_tax_amount) {
        this.form.items[i].excise_tax_amount = 0
      }
      if (!this.form.items[i]?.tax_amount) {
        this.form.items[i].tax_amount = 0
      }
      if (!this.form.items[i]?.tax_percentage) {
        this.form.items[i].tax_percentage = 0
      }
      if (!this.form.items[i]?.total_amount) {
        this.form.items[i].total_amount = 0
      }

      this.form.items[i].item_amount = (this.form.items[i].rate * this.form.items[i].quantity).toFixed(2);


      if (this.form.items[i].item_amount && scope == 'discountA') {
        this.form.items[i].disc_percentage = 0;
      }
      this.form.items[i].disc_amount = ((this.form.items[i].item_amount * this.form.items[i].disc_percentage) / 100).toFixed(2);

      this.form.items[i].taxable_amount = this.form.items[i].item_amount - this.form.items[i].disc_amount

      if (this.form.items[i].item_amount && scope == 'exciseA') {
        this.form.items[i].excise_tax_percentage = 0;
      }
      this.form.items[i].excise_tax_amount = ((this.form.items[i].taxable_amount * this.form.items[i].excise_tax_percentage) / 100).toFixed(2);

      if (this.form.items[i].item_amount && scope == 'taxA') {
        this.form.items[i].tax_percentage = 0;
      }
      this.form.items[i].tax_amount = ((this.form.items[i].taxable_amount * this.form.items[i].tax_percentage) / 100).toFixed(2);


      this.form.items[i].total_amount = (parseFloat(this.form.items[i].item_amount) - parseFloat(this.form.items[i].disc_amount) + parseFloat(this.form.items[i].tax_amount) + parseFloat(this.form.items[i].excise_tax_amount)).toFixed(2);
      this.form.total_item_taxable_amount = parseFloat(this.form.total_item_taxable_amount) + parseFloat(this.form.items[i].taxable_amount)
      this.form.total_item_item_quantity = parseFloat(this.form.total_item_item_quantity) + parseFloat(this.form.items[i].quantity)
      this.form.total_item_item_weight = parseFloat(this.form.total_item_item_weight) + parseFloat(this.form.items[i].weight)
      this.form.total_item_item_amount = parseFloat(this.form.total_item_item_amount) + parseFloat(this.form.items[i].item_amount)
      this.form.total_item_disc_amount = parseFloat(this.form.total_item_disc_amount) + parseFloat(this.form.items[i].disc_amount)

      this.form.total_item_excise_tax_amount = parseFloat(this.form.total_item_excise_tax_amount) + parseFloat(this.form.items[i].excise_tax_amount)
      this.form.total_item_tax_amount = parseFloat(this.form.total_item_tax_amount) + parseFloat(this.form.items[i].tax_amount)
      this.form.total_item_total_amount = parseFloat(this.form.total_item_total_amount) + parseFloat(this.form.items[i].total_amount)

      // if(!this.form.items[i]?.quantity) {
      //   this.form.items[i].quantity = 0
      // }
      this.calculateTaxes()
    }

  }

  calculateTaxes() {
    //   [
    //     "total_item_item_amount",
    //     "total_item_taxable_amount",
    //     "total_item_total_amount",
    //     "afterExcise_amount",
    //     "afterET_Amount",
    //     "freight_Amount",
    //     "serviceCharge_Amount",
    //     "afterAll_tax_Amount"
    // ]



    if (this.form.total_item_total_amount) {
      for (let i = 0; i < this.purchase_tax.length; i++) {
        if (this.purchase_tax[i].tax_percentage == "") {
          this.purchase_tax[i].tax_percentage = 0
        }
        if (this.purchase_tax[i].tax_amount == "") {
          this.purchase_tax[i].tax_amount = 0
        }
        if (this.purchase_tax[i].tax_percentage != 0) {
          this.purchase_tax[i].tax_amount = ((parseFloat(this.form[this.purchase_tax[i].calculate_on_frontendReferance]) * parseFloat(this.purchase_tax[i].tax_percentage)) / 100).toFixed(2);
        }

        if (this.purchase_tax[i].name == 'Excise') {
          this.form.afterExcise_amount = this.getExciseEmount()
        }
        if (this.purchase_tax[i].name == 'ET') {
          this.form.afterET_Amount = this.getETamount()
        }
        if (this.purchase_tax[i].name == 'Freight') {
          this.form.freight_Amount = this.getEreightamount()
        }
        if (this.purchase_tax[i].name == 'Service Charges') {
          this.form.serviceCharge_Amount = this.getServiceamount()
        }

        if (this.purchase_tax[i].name == 'Round Off') {
          this.form.afterAll_tax_Amount = this.getafterAllTax()
        }


      }

    }

    for(let i=0;i<this.form.payment_schedule.length;i++) {      
      this.setPaymentScheduleAmt(i)      
    }
  }


  getafterAllTax() {
    let amount = parseFloat(this.form.total_item_total_amount)

    for (let i = 0; i < this.purchase_tax.length; i++) {
      if (this.purchase_tax[i].inclided_applicable == false || this.purchase_tax[i].included) {
        if (this.purchase_tax[i].add) {
          amount += parseFloat(this.purchase_tax[i].tax_amount)
        } else {
          amount -= parseFloat(this.purchase_tax[i].tax_amount)
        }
      }
    }
    return amount
    
  }

  getExciseEmount() {
    let amount = 0
    amount += parseFloat(this.form.total_item_total_amount)
    let obj = this.getrowDetails('Discount')
    let obj2 = this.getrowDetails('Excise')
    let obj3 = this.getrowDetails('Packing Charges')
    if (obj.included) {
      amount -= parseFloat(obj.tax_amount)
    }
    if (obj2.included) {
      amount += parseFloat(obj2.tax_amount)
    }
    amount += parseFloat(obj3.tax_amount)
    return amount
  }

  getEreightamount() {
    let obj = this.getrowDetails('Freight')
    return parseFloat(obj.tax_amount)
  }

  getServiceamount() {
    let obj = this.getrowDetails('Service Charges')
    return parseFloat(obj.tax_amount)
  }

  getETamount() {
    let amount = 0
    amount += parseFloat(this.form.afterExcise_amount)
    let scope = ['Edu Cess.', 'SHE Cess.', 'Discount after Excise', 'If Any Other Less (like Cement)', 'VAT', 'Aditional VAT', 'ET']
    for (let i = 0; i < scope.length; i++) {
      let obj = this.getrowDetails(scope[i])
      if (obj.inclided_applicable == false || obj.included) {
        if (obj.add) {
          amount += parseFloat(obj.tax_amount)
        } else {
          amount -= parseFloat(obj.tax_amount)
        }
      }
    }
    return amount
  }

  getrowDetails(rowName: any) {
    let filter = this.purchase_tax.filter((item: { name: any; }) => item.name == rowName)
    if (filter.length > 0) {
      return filter[0]
    } else {
      return 0
    }
  }


  addPaymentSchedule() {
    if(this.payment_total_percent < 100 ) {
      if(!this.form.payment_schedule) {
        this.form.payment_schedule = []
      }
      this.form.payment_schedule.push({
        percent: ( 100 - this.payment_total_percent ),
        percent_type: '',
        payment_credit_days: 0,
        notify_days: 0,
        description: '',
        amount: this.form.afterAll_tax_Amount * ( 100 - this.payment_total_percent ) / 100,
        organization: this.localStorageData?.organisation_details[0]?.id,
      });
    }
    this.calculatePaymentTotals()
  }


  getTermsFromMaster() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    params.set('slug', 'po');
    this.procurementAPIService.getTermsFromMaster(params).subscribe(data => {
      this.termsFromMaster = data.results[0].terms_and_conditions_child

      this.form.terms_and_conditions = this.termsFromMaster.map(item => ({
        organization: item.organization,
        // key: item.key,
        description: item.description,
        order_id: item.order_id,
        //remarks: ''
        is_checked : true
      }));


    })
  }


  deletePaymentSchedule(index: any) {
    this.form.payment_schedule.splice(index, 1);
    this.calculatePaymentTotals()

  }



  openTab(event: Event, tabName: string, index: number) {
    // Hide all tab content
    this.activeTab[index] = !this.activeTab[index]
    const tabContent = document.getElementsByClassName("tab-content") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }
    // Remove active class from all tabs
    const tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
      if (i == index) {
        this.activeTab[index] = true
      }
      else {
        this.activeTab[i] = false
      }
    }

    // Show the selected tab content and add active class to the clicked tab
    const selectedTabContent = document.getElementById(tabName) as HTMLElement | null;
    if (selectedTabContent) {
      selectedTabContent.style.display = "block";
    }

    // Ensure the event object is defined before accessing its properties
    if (event && event.currentTarget) {
      (event.currentTarget as HTMLDivElement).classList.add("active");
    }
  }



  getTaxHeadData() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }


  setPaymentScheduleAmt(index: number) {
    const item = this.form.payment_schedule[index];
    item.amount = this.form.afterAll_tax_Amount * item.percent / 100;
    this.calculatePaymentTotals()
  }

  calculatePaymentTotals() {
    this.payment_total_percent = 0;
    this.payment_total_amt = 0;

    if (this.form.payment_schedule && this.form.payment_schedule.length > 0) {
      for (let i = 0; i < this.form.payment_schedule.length; i++) {
        const item = this.form.payment_schedule[i];
        if (item) {
          this.payment_total_percent += +item.percent || 0;
          this.payment_total_amt += +item.amount || 0;
        }
      }
    }

    if(this.payment_total_percent == 100 ) {
      this.actionButton.emit(false);
    } else {
      this.actionButton.emit(true);
    }
    if(this.payment_total_percent < 100) {
      this.addPaymentSchedule()
    }
  }

  save() {

    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  uploadFile(eve: any,index:any) {
    this.form.payment_schedule[index].attachments=[];
    this.importData = eve.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.importData); 
    reader.onload = (event) => { 

      let obj={
        organization:this.localStorageData.organisation_details[0].id,
        file_data:event.target!.result,
        mime_type:eve.target.files[0].type
      }
      this.form.payment_schedule[index].attachments.push(obj);
    }
  }


  onSubmit() {
    this.form.po_tax = this.purchase_tax
    this.form.po_tax_terms_payment_Valid = true
    this.parrentAction.emit(JSON.stringify(this.form))
  }


}
