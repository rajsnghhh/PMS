import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-quotation-table',
  templateUrl: './quotation-table.component.html',
  styleUrls: [
    './quotation-table.component.scss',
    '../../../assets/scss/from-coomon.scss',
    '../../../assets/scss/scrollableTable.scss'
  ]
})
export class QuotationTableComponent implements OnChanges, OnInit{
  localStorageData: any
  @Output() parrentAction = new EventEmitter<any>();
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  masterlist: any = []
  materialGroupList: any = []
  uomList: any = []
  disabledEdit = true
  editData: any = {}
  @Input() prefieldData: any;
  @Input() scope: any;
  @Input() isPurchase_Approver: any;
  @Input() reload: any;

  quotation_tax:any = []
  

  form: any = {
    quotation_table_data: false,
    quotation_items: []
  };

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private activeroute: ActivatedRoute
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.setUpTax()

    if (this.scope == 'add') {
      this.form.quotation_expense = []
    }

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if ( this.prefieldData ) {
      this.form.project = this.prefieldData.project
      this.form.site = this.prefieldData.site
      this.form.status = this.prefieldData.status
      this.form.quotation_expense = this.prefieldData.quotation_expense ? this.prefieldData.quotation_expense : []

      this.getmasterList1(this.prefieldData.quotation_items)
      if(this.prefieldData.quotation_tax) {
      for(let i=0;i<this.prefieldData.quotation_tax.length;i++) {
        this.quotation_tax[i].included = this.prefieldData.quotation_tax[i].included
        this.quotation_tax[i].choice = this.prefieldData.quotation_tax[i].choice        
        this.quotation_tax[i].tax_percentage = this.prefieldData.quotation_tax[i].tax_percentage
        this.quotation_tax[i].tax_amount = this.prefieldData.quotation_tax[i].tax_amount
        this.quotation_tax[i].tax_head = this.prefieldData.quotation_tax[i].tax_head
        if(this.quotation_tax[i].choice) {
          this.changeRadioOptions(i)
        }
      }
      }
    }

    if (this.scope == 'view' || this.scope == 'print') {
      this.disabledEdit = true
    } else {
      this.disabledEdit = false
    }
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getmasterList()
    this.getUomList()
    this.getTaxHeadData()
    if (this.scope == 'add') {
      this.addItem()
    }
    this.setUpTax()
  }

  setUpTax() {
    this.quotation_tax = [
      {
        "options": [],
        "sac_code": null,
        "hidden" : false,
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
        "hidden" : false,
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

  changeRadioOptions(index:any) {
    this.quotation_tax[index].calculate_on_frontendReferance = this.quotation_tax[index].choice
    this.quotation_tax[index].tax_on_parent = this.quotation_tax[index].choice

    if(this.quotation_tax[index].choice == 'serviceCharge_Amount') {
      this.quotation_tax[index].tax_on_self = 'Service Charges'
      this.quotation_tax[index].tax_on_parent = null
    } else {
      this.quotation_tax[index].tax_on_self = null
    }
    this.calculateTaxes()
  }

  changeamount(i:any){
    this.quotation_tax[i].tax_percentage = 0
    if(this.quotation_tax[i].tax_amount == '') {
      this.quotation_tax[i].tax_amount = 0
    }
    this.calculateTaxes()
  }

  taxHeadChange(index:any,scope:any){
    if(scope == '') {
      let filter = this.taxHeads.filter((item: { id: any; }) => item.id == this.quotation_tax[index].tax_head)
      if(filter[0].amount != 0) {
        this.quotation_tax[index].tax_amount = filter[0].amount
        this.quotation_tax[index].tax_percentage = 0
      } else {
        this.quotation_tax[index].tax_percentage = filter[0].percentage
      }
      this.calculateTaxes()
    }
    if(scope == 'exc') {
      let filter = this.taxHeads.filter((item: { id: any; }) => item.id == this.form.quotation_items[index].excise_tax_head)
      if(filter[0].amount != 0) {
        this.form.quotation_items[index].excise_tax_amount = filter[0].amount
        this.form.quotation_items[index].excise_tax_percentage = 0
      } else {
        this.form.quotation_items[index].excise_tax_percentage = filter[0].percentage
      }
      this.changeInputValue('')
    }
    if(scope == 'tax') {
      let filter = this.taxHeads.filter((item: { id: any; }) => item.id == this.form.quotation_items[index].tax_head)
      if(filter[0].amount != 0) {
        this.form.quotation_items[index].tax_amount = filter[0].amount
        this.form.quotation_items[index].tax_percentage = 0
      } else {
        this.form.quotation_items[index].tax_percentage = filter[0].percentage
      }
      this.changeInputValue('')
    }
    
  }
 
  generatePrepopulateData(datalist: any) {
    this.form.quotation_items = []

    for (let i = 0; i < datalist.length; i++) {
      // === parent searching =======
      let params2 = new URLSearchParams();
      params2.set('organization_id', this.localStorageData.organisation_details[0].id);
      params2.set('id', datalist[i].material_details.material_type);

      this.apiservice.getMaterialTypeList(params2).subscribe(data2 => {
        let temp :any = datalist[i]
        temp.requested_material_group = data2.parent,
        temp.requested_material_sub_group = datalist[i].material_details.material_type

        this.form.quotation_items.push(temp)
        this.changeInputValue('')
        let preFilledItemGroupId = data2.parent;

        let preFilledSubItemGroupId = datalist[i].material_details.material_type;
        let preFilledItemId = datalist[i].requested_material;

        let j = 0;
        for (let reqItem of this.form.quotation_items) {
          this.groupTypeChange(preFilledItemGroupId, j)
          this.subTypeChange(preFilledSubItemGroupId, j)
          j++
        }

      })
      // === parent searching =======
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


    for (let i = 0; i < this.form.quotation_items.length; i++) {
      if (!this.form.quotation_items[i]?.quantity) {
        this.form.quotation_items[i].quantity = 0
      }
      if (!this.form.quotation_items[i]?.weight) {
        this.form.quotation_items[i].weight = 0
      }
      if (!this.form.quotation_items[i]?.rate) {
        this.form.quotation_items[i].rate = 0
      }
      if (!this.form.quotation_items[i]?.disc_percentage) {
        this.form.quotation_items[i].disc_percentage = 0
      }
      if (!this.form.quotation_items[i]?.disc_amount) {
        this.form.quotation_items[i].disc_amount = 0
      }
      if (!this.form.quotation_items[i]?.excise_tax_percentage) {
        this.form.quotation_items[i].excise_tax_percentage = 0
      }
      if (!this.form.quotation_items[i]?.excise_tax_amount) {
        this.form.quotation_items[i].excise_tax_amount = 0
      }
      if (!this.form.quotation_items[i]?.tax_amount) {
        this.form.quotation_items[i].tax_amount = 0
      }
      if (!this.form.quotation_items[i]?.tax_percentage) {
        this.form.quotation_items[i].tax_percentage = 0
      }
      if (!this.form.quotation_items[i]?.total_amount) {
        this.form.quotation_items[i].total_amount = 0
      }

      this.form.quotation_items[i].item_amount = (this.form.quotation_items[i].rate * this.form.quotation_items[i].quantity).toFixed(2);


      if (this.form.quotation_items[i].item_amount && scope == 'discountA') {
        this.form.quotation_items[i].disc_percentage = 0;
      }
      this.form.quotation_items[i].disc_amount = ((this.form.quotation_items[i].item_amount * this.form.quotation_items[i].disc_percentage) / 100).toFixed(2);

      this.form.quotation_items[i].taxable_amount = this.form.quotation_items[i].item_amount - this.form.quotation_items[i].disc_amount

      if (this.form.quotation_items[i].item_amount && scope == 'exciseA') {
        this.form.quotation_items[i].excise_tax_percentage = 0;
      }
      this.form.quotation_items[i].excise_tax_amount = ((this.form.quotation_items[i].taxable_amount * this.form.quotation_items[i].excise_tax_percentage) / 100).toFixed(2);

      if (this.form.quotation_items[i].item_amount && scope == 'taxA') {
        this.form.quotation_items[i].tax_percentage = 0;
      }
      this.form.quotation_items[i].tax_amount = ((this.form.quotation_items[i].taxable_amount * this.form.quotation_items[i].tax_percentage) / 100).toFixed(2);


      this.form.quotation_items[i].total_amount = (parseFloat(this.form.quotation_items[i].item_amount) - parseFloat(this.form.quotation_items[i].disc_amount) + parseFloat(this.form.quotation_items[i].tax_amount) + parseFloat(this.form.quotation_items[i].excise_tax_amount)).toFixed(2);
      this.form.total_item_taxable_amount = parseFloat(this.form.total_item_taxable_amount) + parseFloat(this.form.quotation_items[i].taxable_amount)
      this.form.total_item_item_quantity = parseFloat(this.form.total_item_item_quantity) + parseFloat(this.form.quotation_items[i].quantity)
      this.form.total_item_item_weight = parseFloat(this.form.total_item_item_weight) + parseFloat(this.form.quotation_items[i].weight)
      this.form.total_item_item_amount = parseFloat(this.form.total_item_item_amount) + parseFloat(this.form.quotation_items[i].item_amount)
      this.form.total_item_disc_amount = parseFloat(this.form.total_item_disc_amount) + parseFloat(this.form.quotation_items[i].disc_amount)

      this.form.total_item_excise_tax_amount = parseFloat(this.form.total_item_excise_tax_amount) + parseFloat(this.form.quotation_items[i].excise_tax_amount)
      this.form.total_item_tax_amount = parseFloat(this.form.total_item_tax_amount) + parseFloat(this.form.quotation_items[i].tax_amount)
      this.form.total_item_total_amount = parseFloat(this.form.total_item_total_amount) + parseFloat(this.form.quotation_items[i].total_amount)

      // if(!this.form.quotation_items[i]?.quantity) {
      //   this.form.quotation_items[i].quantity = 0
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

  

  if(this.form.total_item_total_amount) {
    for(let i=0;i<this.quotation_tax.length;i++) {
      if(this.quotation_tax[i].tax_percentage == "") {
        this.quotation_tax[i].tax_percentage = 0
      }
      if(this.quotation_tax[i].tax_amount == "") {
        this.quotation_tax[i].tax_amount = 0
      }
      if(this.quotation_tax[i].tax_percentage != 0 ) {
        this.quotation_tax[i].tax_amount = ((parseFloat(this.form[this.quotation_tax[i].calculate_on_frontendReferance]) * parseFloat(this.quotation_tax[i].tax_percentage))/100).toFixed(2);
      }

      if(this.quotation_tax[i].name == 'Excise') {
        this.form.afterExcise_amount = this.getExciseEmount()
      }
      if(this.quotation_tax[i].name == 'ET') {
        this.form.afterET_Amount = this.getETamount()
      }
      if(this.quotation_tax[i].name == 'Freight') {
        this.form.freight_Amount = this.getEreightamount()
      }
      if(this.quotation_tax[i].name == 'Service Charges') {
        this.form.serviceCharge_Amount = this.getServiceamount()
      }

      if(this.quotation_tax[i].name == 'Round Off') {
        this.form.afterAll_tax_Amount = this.getafterAllTax()
      }

      
    }

  }
  }

  getafterAllTax() {
    let amount = parseFloat(this.form.total_item_total_amount)

    for(let i=0;i<this.quotation_tax.length;i++) {
      if(this.quotation_tax[i].inclided_applicable == false || this.quotation_tax[i].included ) {
        if(this.quotation_tax[i].add) {
          amount += parseFloat(this.quotation_tax[i].tax_amount)
        }else {
          amount -= parseFloat(this.quotation_tax[i].tax_amount)
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
    if(obj.included) {
      amount -= parseFloat(obj.tax_amount)
    }
    if(obj2.included) {
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
    let scope = ['Edu Cess.','SHE Cess.','Discount after Excise','If Any Other Less (like Cement)','VAT','Aditional VAT','ET'] 
    for(let i=0;i<scope.length;i++) {
      let obj =this.getrowDetails(scope[i])
      if(obj.inclided_applicable == false || obj.included ) {
        if(obj.add) {
          amount += parseFloat(obj.tax_amount)
        }else {
          amount -= parseFloat(obj.tax_amount)
        }
      }
    }
    return amount
  }

  getrowDetails(rowName:any) {
    let filter = this.quotation_tax.filter((item: { name: any; }) => item.name == rowName)
    if(filter.length > 0) {
      return filter[0]
    }else {
      return 0
    }
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
    })
  }


  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results
      // this.generateMaterialData()
    })

    let preFilledItemGroupId = "";
    let preFilledSubItemGroupId = "";
    let preFilledItemId = "";

    let j = 0;
    for (let reqItem of this.form.quotation_items) {
      this.typeChange(preFilledItemGroupId, j)
      this.subTypeChange(preFilledSubItemGroupId, j)
      j++
    }
  }
  getmasterList1(request: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.masterlist = data.results

      this.generatePrepopulateData(request)
      this.generateMaterialData()
    })
  }

  typeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.quotation_items[i].MaterilSubGroupList = data.results;
    })
  }

  groupTypeChange(typeid: any, i: any) {
    this.form.quotation_items[i].MaterilSubGroupList = '';
    let params = new URLSearchParams();
    // params.set('id', typeid);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.form.quotation_items[i].MaterilSubGroupList = data.results;
    })
  }
  subTypeChange(typeid: any, i: any) {
    // ========= getting materials =========
    let params2 = new URLSearchParams();
    // params2.set('id', typeid);
    params2.set('organization_id', this.localStorageData.organisation_details[0].id);
    params2.set('material_type', typeid);
    params2.set('page', '1');
    params2.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params2).subscribe(data2 => {
      this.form.quotation_items[i].MaterilFilterList = data2.results;
      this.setMaterialMasterData(i, true)
    })
    // ========= getting materials =========
  }

  materialSearchIndex(index: any) {
    this.form.quotation_items[index].requested_material = this.form.quotation_items[index].searchItem
  }

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }

  taxHeads: any = []
  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementApiService.getTaxHeadDetails(params).subscribe(data => {
      this.taxHeads = data.results
    });
  }

  addItem() {
    this.form.quotation_items.push({
      "organization": this.localStorageData.organisation_details[0].id,
      "notes": [
        {
          "note_title": "Technical",
          "note_details": "",
          organization: this.localStorageData.organisation_details[0].id

        },
        {
          "note_title": "Warranty",
          "note_details": "",
          organization: this.localStorageData.organisation_details[0].id

        },
        {
          "note_title": "Other",
          "note_details": "",
          organization: this.localStorageData.organisation_details[0].id

        }
      ],
      due_date: this.setDate(),
      "is_returnable": false
      // "requested_material": "43",
      // "size_part_grade": "test",
      // "quantity_unit": "10",
      // "requested_for": "project",
      // "department": "8",////
      // "priority": "medium"
    })
  }


  setDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1; // Months start at 0!
    let dd: any = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return yyyy + '-' + mm + '-' + dd
  }

  setMaterialMasterData(index: number, autoPopulateScope: boolean) {
    let findData = this.form.quotation_items[index].MaterilFilterList.filter((item: { id: any; }) => item.id == this.form.quotation_items[index].requested_material)
    if (findData.length > 0) {
      this.form.quotation_items[index].MaterialmasterData = findData[0]
      this.form.quotation_items[index].MaterialmasterData.uomList = []
      this.form.quotation_items[index].MaterialmasterData.uomList.push(parseInt(this.form.quotation_items[index].MaterialmasterData.unit_of_mesurement))
      this.form.quotation_items[index].uom = parseInt(this.form.quotation_items[index].MaterialmasterData.unit_of_mesurement)
      for(let ii=0;ii<this.form.quotation_items[index].MaterialmasterData.second_uom.length;ii++) {
        this.form.quotation_items[index].MaterialmasterData.uomList.push(parseInt(this.form.quotation_items[index].MaterialmasterData.second_uom[ii].second_uom))
      }
      this.getProcurementMaterialDetails(index, true)
    } else {
      this.form.quotation_items[index].MaterialmasterData = {}
    }
  }

  setMaterialSubGroup(index: number) {
    let findText = this.form.quotation_items[index].requested_material_group
    let catagoryList = this.masterlist.filter(function (el: any) {
      return el.material_type_name == findText
    });
    let subCatagoryList = [...new Set(catagoryList.map((item: { material_sub_type_name: any; }) => item.material_sub_type_name))];
    this.form.quotation_items[index].MaterilSubGroupList = subCatagoryList
  }

  // setMaterialList(index:number) {
  //   let findGroup = this.form.quotation_items[index].requested_material_group
  //   let findSubGroup = this.form.quotation_items[index].requested_material_sub_group
  //   let materiallist =this.masterlist.filter(function (el:any) {
  //     return el.material_type_name == findGroup && el.material_sub_type_name == findSubGroup 
  //   });
  //   this.form.quotation_items[index].MaterilFilterList = materiallist
  // }

  getProcurementMaterialDetails(index: any, autoPopulateScope: boolean) {

  }

  checkFromStock(i: any) {
    if (this.form.quotation_items[i].quantity_unit > this.form.quotation_items[i].currentStock) {
      this.form.quotation_items[i].quantity_unit = 0
    }
  }

  delete(index: any) {
    this.form.quotation_items.splice(index, 1);
    this.changeInputValue('')
  }

  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }

  onSubmit(): void {
    this.form.quotation_table_data = true
    this.form.quotation_tax = this.quotation_tax
    JSON.stringify(this.form, null, 2)
    this.parrentAction.emit(JSON.stringify(this.form, null, 2))
  }
}
