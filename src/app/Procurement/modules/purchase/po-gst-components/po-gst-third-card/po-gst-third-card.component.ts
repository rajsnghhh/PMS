import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../data-sharing.service';

@Component({
  selector: 'app-po-gst-third-card',
  templateUrl: './po-gst-third-card.component.html',
  styleUrls: ['./po-gst-third-card.component.scss'],
})
export class PoGstThirdCardComponent implements OnChanges,OnInit {
  event: any;
  importData:any;
  termsFromMaster: Array<any> = [];
  localStorageData: any;
  activeTabs: string = 'tab_tax';
  form: any = {};
  taxHeads: any = [];
  showMaterialTableTotalVal: number = 0;
  totalItemAmt: any = 0;
  po_tax: any = [];
  @Output() parrentAction = new EventEmitter<any>();
  @Output() actionButton = new EventEmitter<any>();

  @Input() prefieldData: any;
  @Input() reload: any
  @Input() disableEdit: any
  @Input() scope: any

  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  igstScope=false;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private procurementAPIService: PROCUREMENTAPIService,
    private dataService: DataSharingService
  ) {

    this.datasharedservice.getIGSTscope().subscribe(data => {
      if (data) {
        this.igstScope = data.igst
        for(let j=0;j<this.form.po_expense?.length;j++){
          // if(this.form.po_expense[j]?.tax_head){
          //   this.form.po_expense[j].tax_head='';
          // }
          this.changeExpanceHead(j)
          this.taxMaterialsAutoFilled('', j);
          this.calculateExpances()
        }
      }
    })
   }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(this.prefieldData.id) {
      this.setPrefieldData()
    }else{
      this.form.po_expense = this.prefieldData.quotation_expense
    }
  }

  ngOnInit() {
    this.localStorageData = JSON.parse(
      this.datasharedservice.getLocalData('userDATA')
    );
    this.getTermsFromMaster();
    this.getTaxHeadData();

    this.form = {
      po_tax_terms_payment_Valid: false,
      po_expense: [
        {
          organization: this.localStorageData?.organisation_details[0]?.id,
          name: '',
          sac_code: '',
          expense_percentage: 0,
          expense_amount: 0,
          expense_head: '',
          tax_head: '',
          sgst_percentage: '',
          sgst_amount: '',
          expense_on_parent: 'total_item_total_amount',
          cgst_percentage: '',
          cgst_amount: '',
          igst_percentage: '',
          igst_amount: '',
          cess_percentage: '',
          cess_amount: '',
          utgst_percentage: '',
          utgst_amount: '',
          total_expense_amount: '',
        },
      ],
      terms_and_conditions: [],
      payment_schedule: [
        {
          percent: 100,
          percent_type: '',
          payment_credit_days: '0',
          notify_days: 0,
          description: '',
          amount: 0,
          organization: this.localStorageData?.organisation_details[0]?.id,
        },
      ],
      po_tax: [],
    };
    this.dataService.totalNetAmt$.subscribe((totalNetAmt) => {
      if (totalNetAmt !== null) {
        this.showMaterialTableTotalVal = totalNetAmt;
        this.calculateExpances()
      }
    });
    this.dataService.totalItemAmt$.subscribe((totalItemAmt) => {
      if (totalItemAmt !== null) {
        this.totalItemAmt = totalItemAmt;
      }
    });
    this.setUpTax();
    this.expanceList();
  }

  setPrefieldData() {

    this.form.po_expense = this.prefieldData.po_expense
    this.form.terms_and_conditions = this.prefieldData.terms_and_conditions
    this.form.payment_schedule = this.prefieldData.payment_schedule

    // for(let i=0;i<this.form.po_expense.length;i++) {
    //   this.set_discount_pecentage_blanck(i)
    // }

    for(let i=0;i<this.po_tax.length;i++) {
      this.po_tax[i].tax_percentage = this.prefieldData.po_tax[i].tax_percentage
      this.po_tax[i].tax_amount = this.prefieldData.po_tax[i].tax_amount
    }

    this.totalItemAmt = this.prefieldData.total_item_taxable_amount    
    this.calculateTaxes()
    this.calculateTotalPaymentShedule()

  }

  setUpTax() {
    this.po_tax = [
      // {
      //   options: [],
      //   sac_code: null,
      //   name: 'Discount',
      //   extra: null,

      //   choice: null,
      //   calculate_on: '[On Item Value]',
      //   calculate_on_frontendReferance: 'total_item_taxable_amount',
      //   tax_on_parent: 'total_item_taxable_amount',
      //   tax_on_self: null,
      //   tax_on_self_after: null,
      //   tax_condition: '',
      //   tax_percentage_applicable: true,
      //   tax_percentage: 0,
      //   tax_amount: 0,
      //   sgst_percentage: 0,
      //   cgst_percentage: 0,
      //   igst_percentage: 0,
      //   utgst_percentage: 0,
      //   cess_percentage: 0,
      //   sgst_amount: 0,
      //   cgst_amount: 0,
      //   igst_amount: 0,
      //   utgst_amount: 0,
      //   cess_amount: 0,
      //   total_tax_amount: 0,
      //   inclided_applicable: true,
      //   included: true,
      //   add: false,
      //   organization: this.localStorageData.organisation_details[0].id,
      //   tax_head_applicable: false,
      //   tax_head: null,
      // },
      {
        options: [],
        sac_code: null,
        name: 'Round Off',
        extra: null,
        choice: null,
        calculate_on: '',
        calculate_on_frontendReferance: 'total_item_total_amount',
        tax_on_parent: null,
        tax_on_self: null,
        tax_on_self_after: null,
        tax_condition: '',
        tax_percentage_applicable: false,
        tax_percentage: 0,
        tax_amount: 0,
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
        total_tax_amount: 0,
        inclided_applicable: false,
        included: true,
        add: true,
        organization: this.localStorageData.organisation_details[0].id,
        tax_head_applicable: false,
        tax_head: null,
      },
      {
        options: [],
        sac_code: null,
        name: 'Advance Amount',
        extra: null,
        choice: null,
        calculate_on: '',
        calculate_on_frontendReferance: 'total_item_total_amount',
        tax_on_parent: null,
        tax_on_self: null,
        tax_on_self_after: null,
        tax_condition: '',
        tax_percentage_applicable: false,
        tax_percentage: 0,
        tax_amount: 0,
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
        total_tax_amount: 0,
        inclided_applicable: false,
        included: true,
        add: true,
        organization: this.localStorageData.organisation_details[0].id,
        tax_head_applicable: false,
        tax_head: null,
      },
    ];
  }

  openTab(event: Event, tabName: string) {
    this.activeTabs = tabName;
  }

  getTermsFromMaster() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData?.organisation_details[0]?.id
    );
    params.set('all', 'true');
    params.set('slug', 'po');
    this.procurementAPIService.getTermsFromMaster(params).subscribe((data) => {
      this.termsFromMaster = data.results[0].terms_and_conditions_child;

      this.form.terms_and_conditions = this.termsFromMaster.map((item) => ({
        organization: item.organization,
        key: item.key,
        description: item.description,
        order_id: item.order_id,
        // remarks: '',
        is_checked: true

      }));
    });
  }

  addPOExpense() {
    this.form.po_expense.push({
      organization: this.localStorageData?.organisation_details[0]?.id,
      name: '',
      sac_code: '',
      expense_percentage: 0,
      expense_amount: 0,
      expense_head: '',
      expense_condition: 'total_item_total_amount',
      expense_on_parent: 'total_item_total_amount',
      tax_head: '',
      sgst_percentage: '',
      sgst_amount: '',
      cgst_percentage: '',
      cgst_amount: '',
      igst_percentage: '',
      igst_amount: '',
      cess_percentage: '',
      cess_amount: '',
      utgst_percentage: '',
      utgst_amount: '',
      total_expense_amount: '',
    });
  }

  delete(index: any) {
    this.form.po_expense.splice(index, 1);
    this.calculateTotalPaymentShedule()
  }

  addPaymentSchedule() {
    if(this.totalPercent < 100 ) {
      if(!this.form.payment_schedule) {
        this.form.payment_schedule = []
      }
      this.form.payment_schedule.push({
        percent: ( 100 - this.totalPercent ),
        percent_type: '',
        payment_credit_days: 0,
        notify_days: 0,
        description: '',
        amount: 0,
        organization: this.localStorageData?.organisation_details[0]?.id,
      });
    }
    this.calculateTotalPaymentShedule()
  }

  deletePaymentSchedule(index: any) {
    this.form.payment_schedule.splice(index, 1);
    this.calculateTotalPaymentShedule()
  }


  totalPercent = 0
  totalAmount = 0

  calculateTotalPaymentShedule() {
    this.totalPercent = 0
    this.totalAmount = 0
    for(let i=0;i<this.form.payment_schedule.length;i++) {
      this.totalPercent += parseFloat(this.form.payment_schedule[i].percent)
      
      this.form.payment_schedule[i].amount = ((this.form.afterAll_tax_Amount * this.form.payment_schedule[i].percent)/100).toFixed(2);
      
      this.totalAmount += parseFloat(this.form.payment_schedule[i].amount)
    }
    if(this.totalPercent == 100 ) {
      this.actionButton.emit(false);
    } else {
      this.actionButton.emit(true);
    }
    if(this.totalPercent < 100) {
      this.addPaymentSchedule()
    }
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('all', 'true');
    params.set('tax_type', 'gst_tax')

    this.procurementAPIService.getTaxHeadDetails(params).subscribe((data) => {
      this.taxHeads = data.results;
    });
  }

  showMaterialsCalculatedAmt(index: number): void {
    const item = this.form.po_expense[index];

    const discount_amt =
      (parseFloat(this.totalItemAmt) * parseFloat(item.expense_percentage)) / 100;
    item.expense_amount = parseFloat(discount_amt.toFixed(2));

    item.sgst_amount = parseFloat(
      ((item.expense_amount * item.sgst_percentage) / 100).toFixed(2)
    );
    item.cgst_amount = parseFloat(
      ((item.expense_amount * item.cgst_percentage) / 100).toFixed(2)
    );
    item.igst_amount = parseFloat(
      ((item.expense_amount * item.igst_percentage) / 100).toFixed(2)
    );
    item.utgst_amount = parseFloat(
      ((item.expense_amount * item.utgst_percentage) / 100).toFixed(2)
    );
    item.cess_amount = parseFloat(
      ((item.expense_amount * item.cess_percentage) / 100).toFixed(2)
    );

    item.total_expense_amount =
      item.expense_amount +
      item.sgst_amount +
      item.cgst_amount +
      item.igst_amount +
      item.utgst_amount +
      item.cess_amount;
    // this.set_discount_pecentage_blanck(index)
    this.calculateExpances();
  }

  set_discount_pecentage_blanck(index: number) {
    const item = this.form.po_expense[index];
    item.expense_percentage = 0;
    item.expense_amount = parseFloat(item.expense_amount);

    item.sgst_amount = parseFloat(
      ((item.expense_amount * item.sgst_percentage) / 100).toFixed(2)
    );
    item.cgst_amount = parseFloat(
      ((item.expense_amount * item.cgst_percentage) / 100).toFixed(2)
    );
    item.igst_amount = parseFloat(
      ((item.expense_amount * item.igst_percentage) / 100).toFixed(2)
    );
    item.utgst_amount = parseFloat(
      ((item.expense_amount * item.utgst_percentage) / 100).toFixed(2)
    );
    item.cess_amount = parseFloat(
      ((item.expense_amount * item.cess_percentage) / 100).toFixed(2)
    );

    item.total_expense_amount =
      item.expense_amount +
      item.sgst_amount +
      item.cgst_amount +
      item.igst_amount +
      item.utgst_amount +
      item.cess_amount;
    this.calculateExpances();
  }

  taxMaterialsAutoFilled(tax: any, index: any) {
    const item = this.form.po_expense[index];
    const taxItemId = tax;

    const selectedTaxData = this.taxHeads.find(
      (item: any) => item.id === parseInt(taxItemId)
    );

    if (selectedTaxData) {
      item.sgst_percentage = selectedTaxData.sgst_rate;
      item.cgst_percentage = selectedTaxData.cgst_rate;
      item.igst_percentage = selectedTaxData.igst_rate;
      if (this.igstScope == true) {
        item.sgst_percentage = 0;
        item.cgst_percentage = 0;
      } else {
        item.igst_percentage = 0;

      }

      item.expense_amount = parseFloat(item.expense_amount);

      item.utgst_percentage = selectedTaxData.ugst_rate;
      item.cess_percentage = selectedTaxData.cess;

      item.sgst_amount = parseFloat(
        ((item.expense_amount * item.sgst_percentage) / 100).toFixed(2)
      );
      item.cgst_amount = parseFloat(
        ((item.expense_amount * item.cgst_percentage) / 100).toFixed(2)
      );
      item.igst_amount = parseFloat(
        ((item.expense_amount * item.igst_percentage) / 100).toFixed(2)
      );
      item.utgst_amount = parseFloat(
        ((item.expense_amount * item.utgst_percentage) / 100).toFixed(2)
      );
      item.cess_amount = parseFloat(
        ((item.expense_amount * item.cess_percentage) / 100).toFixed(2)
      );

      item.total_expense_amount =
        item.expense_amount +
        item.sgst_amount +
        item.cgst_amount +
        item.igst_amount +
        item.utgst_amount +
        item.cess_amount;
    }else {
      item.sgst_percentage = 0;
      item.cgst_percentage = 0;
      item.igst_percentage = 0;
      item.utgst_percentage = 0;
      item.cess_percentage = 0;
      item.sgst_amount = 0
      item.cgst_amount = 0
      item.igst_amount = 0
      item.utgst_amount = 0
      item.cess_amount = 0
    }
    this.calculateExpances();
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

  expenseList: any = [];
  expanceList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('all', 'true');

    this.apiservice.getExpenseMasterList(params).subscribe((data) => {
      this.expenseList = data.results;
    });
  }
  changeExpanceHead(i: any) {
    let filter = this.expenseList.filter(
      (item: { id: any }) => item.id == this.form.po_expense[i].expense_head
    );

    if (filter.length > 0) {
      this.form.po_expense[i].tax_head = filter[0].tax_head
      this.form.po_expense[i].expense_percentage = filter[0].percentage
    } else {
      this.form.po_expense[i].expense_percentage = 0
      this.form.po_expense[i].expense_amount = 0
    }

    if(filter.length>0){
      this.taxMaterialsAutoFilled(filter[0].tax_head,i)
    }
    this.calculateExpances();
  }
  onSubmit() {
    this.form.po_tax_terms_payment_Valid = true;
    this.form.po_tax = this.po_tax;

    this.form.po_expense.forEach((data:any)=>{
      delete data.created_by
      delete data.id
      delete data.updated_by
      delete data.updated_at
    }
    )
    
    this.form.terms_and_conditions = this.form.terms_and_conditions.filter((data: any) => data.is_checked === true);
    JSON.stringify(this.form);
    this.parrentAction.emit(JSON.stringify(this.form));
  }
  calculateTaxes() {
    this.form.afterAll_tax_Amount =
      parseFloat(this.form.total_expense_total_expense_amount) +
      this.showMaterialTableTotalVal;
    for (let i = 0; i < this.po_tax.length; i++) {
      if (this.po_tax[i].tax_percentage == '') {
        this.po_tax[i].tax_percentage = 0;
      }
      if (this.po_tax[i].tax_amount == '') {
        this.po_tax[i].tax_amount = 0;
      }
      if (this.po_tax[i].tax_percentage != 0) {
        this.po_tax[i].tax_amount = (
          (this.totalItemAmt *
            parseFloat(this.po_tax[i].tax_percentage)) /
          100
        ).toFixed(2);
      }
      // if (this.po_tax[i].inclided_applicable == false || this.po_tax[i].included) {
      if (this.po_tax[i].add) {
        this.form.afterAll_tax_Amount =
          this.form.afterAll_tax_Amount + parseFloat(this.po_tax[i].tax_amount);
      } else {
        this.form.afterAll_tax_Amount =
          this.form.afterAll_tax_Amount - parseFloat(this.po_tax[i].tax_amount);
      }
      // }
    }
    this.calculateTotalPaymentShedule()
  }

  calculateExpances() {
    this.form.total_expense_expense_amount = 0;
    this.form.total_expense_sgst_amount = 0;
    this.form.total_expense_cgst_amount = 0;
    this.form.total_expense_igst_amount = 0;
    this.form.total_expense_utgst_amount = 0;
    this.form.total_expense_cess_amount = 0;
    this.form.total_expense_total_expense_amount = 0;
    if (this.totalItemAmt) {
      for (let i = 0; i < this.form.po_expense?.length; i++) {
        if (!this.form.po_expense[i]?.sgst_percentage) {
          this.form.po_expense[i].sgst_percentage = 0;
        }
        if (!this.form.po_expense[i]?.sgst_amount) {
          this.form.po_expense[i].sgst_amount = 0;
        }
        if (!this.form.po_expense[i]?.cgst_percentage) {
          this.form.po_expense[i].cgst_percentage = 0;
        }
        if (!this.form.po_expense[i]?.cgst_amount) {
          this.form.po_expense[i].cgst_amount = 0;
        }
        if (!this.form.po_expense[i]?.igst_percentage) {
          this.form.po_expense[i].igst_percentage = 0;
        }
        if (!this.form.po_expense[i]?.igst_amount) {
          this.form.po_expense[i].igst_amount = 0;
        }
        if (!this.form.po_expense[i]?.utgst_percentage) {
          this.form.po_expense[i].utgst_percentage = 0;
        }
        if (!this.form.po_expense[i]?.utgst_amount) {
          this.form.po_expense[i].utgst_amount = 0;
        }
        if (!this.form.po_expense[i]?.cess_percentage) {
          this.form.po_expense[i].cess_percentage = 0;
        }

        if (!this.form.po_expense[i]?.cess_amount) {
          this.form.po_expense[i].cess_amount = 0;
        }

        if (!this.form.po_expense[i]?.total_expense_amount) {
          this.form.po_expense[i].total_expense_amount = 0;
        }

        if (this.form.po_expense[i].expense_percentage) {
          this.form.po_expense[i].expense_amount = (
            (this.showMaterialTableTotalVal *
              parseFloat(this.form.po_expense[i].expense_percentage)) /
            100
          ).toFixed(2);
        }

        this.form.po_expense[i].sgst_amount = (
          (parseFloat(this.form.po_expense[i].sgst_percentage) *
            parseFloat(this.form.po_expense[i].expense_amount)) /
          100
        ).toFixed(2);
        this.form.po_expense[i].cgst_amount = (
          (parseFloat(this.form.po_expense[i].cgst_percentage) *
            parseFloat(this.form.po_expense[i].expense_amount)) /
          100
        ).toFixed(2);
        this.form.po_expense[i].igst_amount = (
          (parseFloat(this.form.po_expense[i].igst_percentage) *
            parseFloat(this.form.po_expense[i].expense_amount)) /
          100
        ).toFixed(2);
        this.form.po_expense[i].utgst_amount = (
          (parseFloat(this.form.po_expense[i].utgst_percentage) *
            parseFloat(this.form.po_expense[i].expense_amount)) /
          100
        ).toFixed(2);
        this.form.po_expense[i].cess_amount = (
          (parseFloat(this.form.po_expense[i].cess_percentage) *
            parseFloat(this.form.po_expense[i].expense_amount)) /
          100
        ).toFixed(2);

        // this.form.total_expense_total_expense_amount = 0
        this.form.total_expense_sgst_amount =
          parseFloat(this.form.total_expense_sgst_amount) +
          parseFloat(this.form.po_expense[i].sgst_amount);
        this.form.total_expense_cgst_amount =
          parseFloat(this.form.total_expense_cgst_amount) +
          parseFloat(this.form.po_expense[i].cgst_amount);
        this.form.total_expense_igst_amount =
          parseFloat(this.form.total_expense_igst_amount) +
          parseFloat(this.form.po_expense[i].igst_amount);
        this.form.total_expense_utgst_amount =
          parseFloat(this.form.total_expense_utgst_amount) +
          parseFloat(this.form.po_expense[i].utgst_amount);
        this.form.total_expense_cess_amount =
          parseFloat(this.form.total_expense_cess_amount) +
          parseFloat(this.form.po_expense[i].cess_amount);

        this.form.po_expense[i].total_expense_amount =
          parseFloat(this.form.po_expense[i].cess_amount) +
          parseFloat(this.form.po_expense[i].utgst_amount) +
          parseFloat(this.form.po_expense[i].igst_amount) +
          parseFloat(this.form.po_expense[i].cgst_amount) +
          parseFloat(this.form.po_expense[i].sgst_amount) +
          parseFloat(this.form.po_expense[i].expense_amount);

        this.form.total_expense_expense_amount =
          parseFloat(this.form.total_expense_expense_amount) +
          parseFloat(this.form.po_expense[i].total_expense_amount);

        this.form.total_expense_total_expense_amount =
          parseFloat(this.form.total_expense_total_expense_amount) +
          parseFloat(this.form.total_expense_expense_amount);
      }
      // expense_percentage
    }

    this.calculateTaxes();
  }

  changeamount(i: any) {
    this.po_tax[i].tax_percentage = 0;
    if (this.po_tax[i].tax_amount == '') {
      this.po_tax[i].tax_amount = 0;
    }
    this.calculateExpances();
  }
}
