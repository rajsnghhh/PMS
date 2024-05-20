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
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../../data-sharing.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';

@Component({
  selector: 'app-raw-material-sale-tax',
  templateUrl: './raw-material-sale-tax.component.html',
  styleUrls: ['./raw-material-sale-tax.component.scss'],
})
export class RawMaterialSaleTaxComponent implements OnInit, OnChanges {
  @Output() parrentAction = new EventEmitter<any>();
  @Output() checkValidation = new EventEmitter<any>();
  @Input() checkValidData: boolean = false;
  // @Input() total: Number = 0;
  formGroup!: FormGroup;
  uomList: any = [];
  expenseList: any = [];
  masterItemGroupList: any = [];
  masterSubItemList: any[] = [];
  masterItemList: any[] = [];
  exciseTaxDetails: any[] = [];
  taxHeads: any[] = [];
  totalAmount: any = 0;
  totalItemAmt: any = 0;
  ENTRY_TAX_TYPE_CHOICES = [
    { value: 'on_item_value', label: 'On Item Value' },
    { Value: 'on_before_vat_cst', label: 'On Before VAT/CST' },
    { Value: 'on_after_vat_cst', label: 'On After VAT/CST' },
  ];
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  total: any = {
    quantity: 0,
    rate: 0,
    item_amt: 0,
    discount_amt: 0,
    excise_tax_amount: 0,
    taxable_amt: 0,
    sgst_amt: 0,
    cgst_amt: 0,
    igst_amt: 0,
    net_amt: 0,
    utgst_amt: 0,
    cess_amt: 0,
    total_amount: 0,
  };
  totalBill: any = {
    value: 0,
    quantity: 0,
    rate: 0,
    item_amt: 0,
    discount_amt: 0,
    excise_tax_amount: 0,
    taxable_amt: 0,
    sgst_amt: 0,
    cgst_amt: 0,
    igst_amt: 0,
    net_amt: 0,
    utgst_amt: 0,
    cess_amt: 0,
    total_amount: 0,
  };
  @Input() add_type: any = null;
  @Input() rawMaterialSaleData: any = null;
  @Input() scope: any = null;
  constructor(
    private fb: FormBuilder,
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private localStorage: LocalStorageService,
    private tatalAmountShareService: DataSharingService
  ) {}
  ngOnInit(): void {
    if (this.add_type == 'gst') {
      this.formGroup = this.fb.group({
        raw_material_sales_tax: this.fb.array([]),
        raw_material_sales_expense: this.fb.array([]),
      });
      this.fetchExpenseList();
    } else {
      this.formGroup = this.fb.group({
        raw_material_sales_tax: this.fb.array([]),
      });
    }

    this.preFillData();
    this.getmasterList();
    this.getUomList();
    this.getTaxHeadData();
    this.getExciseTaxData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.checkValidData) {
      this.onSubmit();
    }
    if (this.rawMaterialSaleData) {
      let item = this.rawMaterialSaleData;
      if (item?.raw_material_sales_tax?.length) {
        this.raw_material_sales_tax.clear();
        item?.raw_material_sales_tax.forEach((rowItem: any, index: number) => {
          if (this.add_type == 'gst') {
            rowItem.after_gst_amount = rowItem?.total_amount;
          }
          this.raw_material_sales_tax.push(this.editMaterial(rowItem));
        });
      }
      if (this.add_type == 'gst') {
        // raw_material_sales_expense;
        if (item?.raw_material_sales_expense?.length) {
          this.raw_material_sales_expense.clear();
          item?.raw_material_sales_expense.forEach(
            (rowItem: any, index: number) => {
              rowItem.gross_amount = rowItem?.expense_amount;
              this.raw_material_sales_expense.push(
                this.editExpenseMaterial(rowItem)
              );
            }
          );
        }
      } else {
      }
    }
  }
  preFillData() {
    if (this.add_type == null) {
      let table_row = [
        {
          label: 'Excise',
        },
        {
          label: 'Edu Cess.',
        },
        {
          label: 'SHE Cess.',
        },
        {
          label: 'VAT Tax',
        },
        {
          label: 'Aditional Tax',
        },
        {
          label: 'TCS',
        },
        {
          label: 'Entry Tax',
        },
        {
          label: 'Service Tax',
        },
        {
          label: 'Discount',
        },
        {
          label: 'Freight',
        },
        {
          label: 'Round Off',
        },
        {
          label: 'Others',
        },
      ];
      table_row.forEach((row: any) => {
        let form = this.fb.group({
          organization: this.localStorage.organisation_id(),
          name: [row.label, Validators.compose([])],
          choice: ['on_item_value', Validators.compose([])],
          tax_on_parent: [null],
          other_charges: [null, Validators.compose([])],
          tax_head: [null, Validators.compose([])],
          tax_percentage: [
            0,
            Validators.compose([
              Validators.max(100),
              Validators.pattern(/^-?\d*(\.\d+)?$/),
            ]),
          ],
          tax_amount: [
            0,
            Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
          ],
          sgst_percentage: [0, Validators.compose([])],
          cgst_percentage: [0, Validators.compose([])],
          igst_percentage: [0, Validators.compose([])],
          utgst_percentage: [0, Validators.compose([])],
          cess_percentage: [0, Validators.compose([])],
          sgst_amount: [0, Validators.compose([])],
          cgst_amount: [0, Validators.compose([])],
          igst_amount: [0, Validators.compose([])],
          utgst_amount: [0, Validators.compose([])],
          cess_amount: [0, Validators.compose([])],
          included: [true, Validators.compose([])],
          extra: ['true', Validators.compose([])],
          add: [row.label == 'Discount' ? false : true, Validators.compose([])],
        });
        this.raw_material_sales_tax.push(form);
      });
    }
    if (this.add_type == 'gst') {
      this.raw_material_sales_expense.push(this.newExpenseMaterial());
      let table_row = [
        {
          name: 'Discount',
          sac_code: null,
          choice: null,
          gross_amount: 0,
          tax_head: null,
          tax_on_parent: 'total_item_taxable_amount',
          other_charges: null,
          expense_percentage: 0,
          expense_amount: 0,
          taxable_amount: 0,
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
          total_expense_amount: 0,
          included: true,
          add: true,
          extra: null,
        },
        {
          name: 'Round Off',
          sac_code: null,
          choice: null,
          gross_amount: 0,
          tax_head: null,
          tax_on_parent: null,
          other_charges: null,
          expense_percentage: 0,
          expense_amount: 0,
          taxable_amount: 0,
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
          total_expense_amount: 0,
          included: true,
          add: true,
          extra: null,
        },
      ];
      table_row.forEach((row: any) => {
        this.raw_material_sales_tax.push(this.newMaterial(row));
      });
    }

    this.tatalAmountShareService.totalItemAmt$.subscribe((totalItemAmt) => {
      this.totalItemAmt = totalItemAmt ?? 0;
    });
    this.tatalAmountShareService.totalNetAmt$.subscribe((totalNetAmt) => {
      this.totalAmount = totalNetAmt;
      if (totalNetAmt !== null) {
        if (this.add_type == 'gst') {
          this.raw_material_sales_expense.value.forEach(
            (element: any, index: any) => {
              this.raw_material_sales_expense.at(index).patchValue({
                taxable_amount: totalNetAmt,
                // gross_amount: totalNetAmt,
                // tax_amount: 0,
                // total_amount: 0,
              });
            }
          );
        } else {
          this.raw_material_sales_tax.value.forEach(
            (element: any, index: any) => {
              this.raw_material_sales_tax.at(index).patchValue({
                taxable_amount: totalNetAmt,
                // gross_amount: totalNetAmt,
                // tax_amount: 0,
                // total_amount: 0,
              });
            }
          );
        }
        this.calculateTotals();
      }
    });
  }
  save() {
    if (this.submitButton.nativeElement) {
      this.submitButton.nativeElement.click();
    }
  }
  onSubmit() {
    this.formGroup.markAllAsTouched();
    this.checkValidation.emit(this.formGroup.valid);
    if (this.formGroup.valid) {
      this.parrentAction.emit(this.formGroup.value);
    }
  }
  get raw_material_sales_tax() {
    return this.formGroup.get('raw_material_sales_tax') as FormArray;
  }
  get raw_material_sales_expense() {
    return this.formGroup.get('raw_material_sales_expense') as FormArray;
  }
  newMaterial(
    item = {
      name: null,
      sac_code: null,
      choice: null,
      gross_amount: 0,
      tax_head: null,
      tax_on_parent: null,
      // tax_head: null,
      other_charges: null,
      tax_percentage: 0,
      tax_amount: 0,
      taxable_amount: 0,
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
      included: true,
      add: true,
      extra: null,
    }
  ) {
    return this.fb.group({
      organization: this.localStorage.organisation_id(),
      name: [item?.name ?? null, Validators.compose([Validators.required])],
      sac_code: [item?.sac_code ?? null, Validators.compose([])],
      choice: [item?.choice ?? null, Validators.compose([])],
      gross_amount: [item?.gross_amount ?? null, Validators.compose([])],
      tax_head: [item?.tax_head ?? null, Validators.compose([])],
      tax_on_parent: [item?.tax_on_parent ?? null, Validators.compose([])],
      other_charges: [item?.other_charges ?? null, Validators.compose([])],
      tax_percentage: [
        item?.tax_percentage ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      tax_amount: [
        item?.tax_amount ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      taxable_amount: [this.totalAmount, Validators.compose([])],
      sgst_percentage: [item?.sgst_percentage ?? 0, Validators.compose([])],
      cgst_percentage: [item?.cgst_percentage ?? 0, Validators.compose([])],
      igst_percentage: [item?.igst_percentage ?? 0, Validators.compose([])],
      utgst_percentage: [item?.utgst_percentage ?? 0, Validators.compose([])],
      cess_percentage: [item?.cess_percentage ?? 0, Validators.compose([])],
      sgst_amount: [item?.sgst_amount ?? 0, Validators.compose([])],
      cgst_amount: [item?.cgst_amount ?? 0, Validators.compose([])],
      igst_amount: [item?.igst_amount ?? 0, Validators.compose([])],
      utgst_amount: [item?.utgst_amount ?? 0, Validators.compose([])],
      cess_amount: [item?.cess_amount ?? 0, Validators.compose([])],
      total_tax_amount: [
        item?.total_tax_amount ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      included: [item?.included ?? true, Validators.compose([])],
      add: [item?.name == 'Discount' ? false : true, Validators.compose([])],
      extra: [item?.extra ?? null, Validators.compose([])],
    });
  }
  editMaterial(
    item = {
      id: null,
      name: null,
      sac_code: null,
      choice: null,
      gross_amount: 0,
      tax_head: null,
      // tax_head: null,
      other_charges: null,
      tax_percentage: 0,
      tax_amount: 0,
      taxable_amount: 0,
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
      included: true,
      add: true,
      extra: null,
      tax_on_parent: null,
    }
  ) {
    return this.fb.group({
      organization: this.localStorage.organisation_id(),
      id: [item?.id ?? null],
      name: [item?.name ?? null, Validators.compose([Validators.required])],
      sac_code: [item?.sac_code ?? null, Validators.compose([])],
      choice: [item?.choice ?? null, Validators.compose([])],
      gross_amount: [item?.gross_amount ?? null, Validators.compose([])],
      tax_head: [item?.tax_head ?? null, Validators.compose([])],
      // tax_head: [item?.tax_head ?? null, Validators.compose([])],
      other_charges: [item?.other_charges ?? null, Validators.compose([])],
      tax_percentage: [item?.tax_percentage ?? 0, Validators.compose([])],
      tax_amount: [item?.tax_amount ?? 0, Validators.compose([])],
      taxable_amount: [this.totalAmount, Validators.compose([])],
      sgst_percentage: [item?.sgst_percentage ?? 0, Validators.compose([])],
      cgst_percentage: [item?.cgst_percentage ?? 0, Validators.compose([])],
      igst_percentage: [item?.igst_percentage ?? 0, Validators.compose([])],
      utgst_percentage: [item?.utgst_percentage ?? 0, Validators.compose([])],
      cess_percentage: [item?.cess_percentage ?? 0, Validators.compose([])],
      sgst_amount: [item?.sgst_amount ?? 0, Validators.compose([])],
      cgst_amount: [item?.cgst_amount ?? 0, Validators.compose([])],
      igst_amount: [item?.igst_amount ?? 0, Validators.compose([])],
      utgst_amount: [item?.utgst_amount ?? 0, Validators.compose([])],
      cess_amount: [item?.cess_amount ?? 0, Validators.compose([])],
      total_tax_amount: [item?.total_tax_amount ?? 0, Validators.compose([])],
      included: [item?.included ?? true, Validators.compose([])],
      add: [item?.add ?? true, Validators.compose([])],
      extra: [item?.extra ?? null, Validators.compose([])],
      tax_on_parent: [item?.tax_on_parent ?? null, Validators.compose([])],
    });
  }
  newExpenseMaterial(
    item = {
      name: null,
      sac_code: null,
      choice: null,
      gross_amount: 0,
      expense_head: null,
      tax_head: null,
      other_charges: null,
      expense_percentage: 0,
      expense_amount: 0,
      taxable_amount: 0,
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
      total_expense_amount: 0,
      included: true,
      add: true,
      extra: null,
    }
  ) {
    return this.fb.group({
      organization: this.localStorage.organisation_id(),
      name: [item.name ?? null, Validators.compose([])],
      sac_code: [item.sac_code ?? null, Validators.compose([])],
      expense_head: [item.expense_head ?? null, Validators.compose([])],
      tax_head: [item.tax_head ?? null, Validators.compose([])],
      other_charges: [item.other_charges ?? null, Validators.compose([])],
      gross_amount: [item.gross_amount ?? null, Validators.compose([])],
      taxable_amount: [item.taxable_amount ?? null, Validators.compose([])],
      expense_condition: ['after_gst', Validators.compose([])],
      expense_percentage: [
        item.expense_percentage ?? 0,
        Validators.compose([]),
      ],
      expense_amount: [item.expense_amount ?? 0, Validators.compose([])],
      sgst_percentage: [item.sgst_percentage ?? 0, Validators.compose([])],
      cgst_percentage: [item.cgst_percentage ?? 0, Validators.compose([])],
      igst_percentage: [item.igst_percentage ?? 0, Validators.compose([])],
      utgst_percentage: [item.utgst_percentage ?? 0, Validators.compose([])],
      cess_percentage: [item.cess_percentage ?? 0, Validators.compose([])],
      sgst_amount: [item.sgst_amount ?? 0, Validators.compose([])],
      cgst_amount: [item.cgst_amount ?? 0, Validators.compose([])],
      igst_amount: [item.igst_amount ?? 0, Validators.compose([])],
      utgst_amount: [item.utgst_amount ?? 0, Validators.compose([])],
      cess_amount: [item.cess_amount ?? 0, Validators.compose([])],
      total_expense_amount: [
        item.total_expense_amount ?? 0,
        Validators.compose([]),
      ],
      included: [item.included ?? false, Validators.compose([])],
      add: [item.name == 'Discount' ? false : true, Validators.compose([])],
    });
  }
  editExpenseMaterial(
    item = {
      id: null,
      name: null,
      sac_code: null,
      choice: null,
      gross_amount: 0,
      expense_head: null,
      tax_head: null,
      other_charges: null,
      expense_percentage: 0,
      expense_amount: 0,
      taxable_amount: 0,
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
      total_expense_amount: 0,
      included: true,
      add: true,
      extra: null,
    }
  ) {
    return this.fb.group({
      organization: this.localStorage.organisation_id(),
      id: [item.id ?? null, Validators.compose([])],
      name: [item.name ?? null, Validators.compose([])],
      sac_code: [item.sac_code ?? null, Validators.compose([])],
      expense_head: [item.expense_head ?? null, Validators.compose([])],
      tax_head: [item.tax_head ?? null, Validators.compose([])],
      other_charges: [item.other_charges ?? null, Validators.compose([])],
      gross_amount: [item.gross_amount ?? null, Validators.compose([])],
      taxable_amount: [item.taxable_amount ?? null, Validators.compose([])],
      expense_condition: ['after_gst', Validators.compose([])],
      expense_percentage: [
        item.expense_percentage ?? 0,
        Validators.compose([]),
      ],
      expense_amount: [item.expense_amount ?? 0, Validators.compose([])],
      sgst_percentage: [item.sgst_percentage ?? 0, Validators.compose([])],
      cgst_percentage: [item.cgst_percentage ?? 0, Validators.compose([])],
      igst_percentage: [item.igst_percentage ?? 0, Validators.compose([])],
      utgst_percentage: [item.utgst_percentage ?? 0, Validators.compose([])],
      cess_percentage: [item.cess_percentage ?? 0, Validators.compose([])],
      sgst_amount: [item.sgst_amount ?? 0, Validators.compose([])],
      cgst_amount: [item.cgst_amount ?? 0, Validators.compose([])],
      igst_amount: [item.igst_amount ?? 0, Validators.compose([])],
      utgst_amount: [item.utgst_amount ?? 0, Validators.compose([])],
      cess_amount: [item.cess_amount ?? 0, Validators.compose([])],
      total_expense_amount: [
        item.total_expense_amount ?? 0,
        Validators.compose([]),
      ],
      included: [item.included ?? false, Validators.compose([])],
      add: [item.name == 'Discount' ? false : true, Validators.compose([])],
    });
  }

  addItems(i: number) {
    let formGroup = this.raw_material_sales_tax.at(i);
    formGroup.markAllAsTouched();
    if (formGroup.valid) {
      this.raw_material_sales_tax.push(this.newMaterial());
    }
  }
  deleteItem(index: number) {
    this.raw_material_sales_tax.removeAt(index);
  }
  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe((data) => {
      this.masterItemGroupList = data.results;
      // this.generateMaterialData()
    });

    let preFilledItemGroupId = '';
    let preFilledSubItemGroupId = '';
    let preFilledItemId = '';

    // let j = 0;
    // for (let reqItem of this.raw_material_sales_tax.value) {
    //   this.typeChange(preFilledItemGroupId, j)
    //   this.subTypeChange(preFilledSubItemGroupId, j)
    //   j++
    // }
  }
  typeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe((data) => {
      this.masterSubItemList[i] = data.results;
    });
  }
  subTypeChange(typeid: any, i: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('material_type', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialManagementList(params).subscribe((data) => {
      this.masterItemList[i] = data.results;
    });
  }
  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe((data) => {
      this.uomList = data.results;
    });
  }
  taxAmountCal(index: number): void {
    const itemFormGroup = this.raw_material_sales_tax.at(index);
    let item = itemFormGroup.value;
    let tax_percentage = item.tax_percentage;
    let tax_amount = (Number(this.totalAmount) * tax_percentage) / 100;
    itemFormGroup.patchValue({
      tax_percentage: tax_percentage,
      tax_amount: tax_amount,
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
    });
  }
  gstTaxAmountCalculation(index: number): void {
    const itemFormGroup = this.raw_material_sales_tax.at(index);
    let item = itemFormGroup.value;
    let tax_percentage = item.tax_percentage;
    let tax_amount = (Number(item.taxable_amount) * tax_percentage) / 100;
    itemFormGroup.patchValue({
      tax_percentage: tax_percentage,
      tax_amount: tax_amount,
      gross_amount: tax_amount,
      // tax_amount: Number(item.taxable_amount) + tax_amount,
    });
    this.calculateTotals();
  }
  totalDiscount(index: number): void {
    const itemFormGroup = this.raw_material_sales_tax.at(index);
    let item = itemFormGroup.value;
    let tax_percentage = item.tax_percentage;

    let tax_amount = (Number(this.totalItemAmt) * tax_percentage) / 100;
    itemFormGroup.patchValue({
      tax_percentage: tax_percentage,
      tax_amount: tax_amount,
      total_tax_amount: tax_amount,
    });
    this.calculateExpenseTotals();
  }
  calculateRoundOff(index: number): void {
    const itemFormGroup = this.raw_material_sales_tax.at(index);
    let item = itemFormGroup.value;
    let total_tax_amount = item.total_tax_amount;
    itemFormGroup.patchValue({
      tax_percentage: 0,
      tax_amount:total_tax_amount
    });
    this.calculateExpenseTotals();
  }
  taxPercentageCal(index: number): void {
    const itemFormGroup = this.raw_material_sales_tax.at(index);
    let item = itemFormGroup.value;
    let tax_amount = item.tax_amount;
    let tax_percentage = (tax_amount / 100) * Number(this.totalAmount);
    itemFormGroup.patchValue({
      tax_percentage: tax_percentage,
      tax_amount: tax_amount,
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
    });
  }
  calculateGrossAmount(i: number) {
    const itemFormGroup = this.raw_material_sales_expense.at(i);
    let item = itemFormGroup.value;
    let expense_percentage = item.expense_percentage;
    let gross_amount = (Number(item.taxable_amount) * expense_percentage) / 100;
    itemFormGroup.patchValue({
      gross_amount: gross_amount,
      expense_amount: gross_amount,
    });
    this.gstTaxHeadSelect(i);
  }
  fetchExpenseList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');

    this.apiservice.getExpenseMasterList(params).subscribe((data) => {
      this.expenseList = data.results;
    });
  }
  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');
    params.set('tax_type__in', 'vat_tax,gst_tax');

    this.procurementApiService.getTaxHeadDetails(params).subscribe((data) => {
      this.taxHeads = data.results;
    });
  }
  getExciseTaxData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');
    params.set('tax_type', 'excise_tax');

    this.procurementApiService.getTaxHeadDetails(params).subscribe((data) => {
      this.exciseTaxDetails = data.results;
    });
  }
  taxExciseMaterialsAutoFilled(tax: any, index: any, type: any) {
    const itemFormGroup = this.raw_material_sales_tax.at(index);
    let item = itemFormGroup.value;
    const taxItemId = tax;
    let taxable_amount = item.taxable_amount;
    const selectedTaxData = this.taxHeads.find(
      (item: any) => item.id === parseInt(taxItemId)
    );
    const selectedExciseTaxData = this.exciseTaxDetails.find(
      (item: any) => item.id === parseInt(taxItemId)
    );

    if (selectedTaxData || selectedExciseTaxData) {
      if (type == 'excise') {
        let excise_tax_percentage = selectedExciseTaxData.tax_rate;
        let excise_tax_amount = selectedExciseTaxData.total_tax_rate;
        let tax_amount = item.tax_amount;
        itemFormGroup.patchValue({
          excise_tax_percentage: excise_tax_percentage ?? 0,
          excise_tax_amount: (taxable_amount * excise_tax_percentage) / 100,
          total_amount: (
            taxable_amount +
            excise_tax_amount +
            tax_amount
          ).toFixed(2),
        });
      }
      if (type == 'tax') {
        let tax_percentage = selectedTaxData.tax_rate;
        let tax_amount = selectedTaxData.total_tax_rate;
        let excise_tax_amount = item.excise_tax_amount;
        itemFormGroup.patchValue({
          tax_percentage: tax_percentage,
          tax_amount: (taxable_amount * tax_percentage) / 100,
          total_amount: (
            taxable_amount +
            excise_tax_amount +
            tax_amount
          ).toFixed(2),
        });
      }

      // const discount_amt = item.item_amount * item.disc_percentage / 100
      // item.disc_amount = discount_amt
      // item.taxable_amount = item.item_amount - discount_amt
    }
  }
  taxMaterialsAutoFilled(tax: any, index: any) {
    const itemFormGroup = this.raw_material_sales_tax.at(index);
    let item = itemFormGroup.value;
    const taxItemId = tax;

    const selectedTaxData = this.taxHeads.find(
      (item: any) => item.id === parseInt(taxItemId)
    );
    if (selectedTaxData) {
      let taxable_amount = parseFloat(item.taxable_amount);
      let gross_amount = parseFloat(item.gross_amount);
      let sgst_percentage = selectedTaxData.sgst_rate;
      let cgst_percentage = selectedTaxData.cgst_rate;
      let igst_percentage = selectedTaxData.igst_rate;
      let utgst_percentage = selectedTaxData.ugst_rate;
      let cess_percentage = selectedTaxData.cess;
      let sgst_amount = (gross_amount * sgst_percentage) / 100;
      let cgst_amount = (gross_amount * cgst_percentage) / 100;
      let igst_amount = (gross_amount * igst_percentage) / 100;
      let utgst_amount = (gross_amount * utgst_percentage) / 100;
      let cess_amount = (gross_amount * cess_percentage) / 100;
      let tax_amount = (
        taxable_amount +
        sgst_amount +
        cgst_amount +
        igst_amount +
        utgst_amount +
        cess_amount
      ).toFixed(2);
      let total_tax_amount = (
        gross_amount +
        sgst_amount +
        cgst_amount +
        igst_amount +
        utgst_amount +
        cess_amount
      ).toFixed(2);
      itemFormGroup.patchValue({
        sgst_percentage: sgst_percentage,
        cgst_percentage: cgst_percentage,
        igst_percentage: igst_percentage,
        utgst_percentage: utgst_percentage,
        cess_percentage: cess_percentage,
        sgst_amount: sgst_amount,
        cgst_amount: cgst_amount,
        igst_amount: igst_amount,
        utgst_amount: utgst_amount,
        cess_amount: cess_amount,
        tax_amount: parseFloat(tax_amount) - parseFloat(this.totalAmount),
        total_tax_amount: parseFloat(total_tax_amount),
      });
    }
    this.calculateTotals();
  }
  gstTaxHeadSelect(index: any) {
    const itemFormGroup = this.raw_material_sales_expense.at(index);
    let item = itemFormGroup.value;
    let tax_head = item.tax_head;
    const selectedTaxData = this.taxHeads.find(
      (item: any) => item.id == tax_head
    );
    let taxable_amount = parseFloat(item.gross_amount);
    let sgst_percentage = selectedTaxData?.sgst_rate ?? 0;
    let cgst_percentage = selectedTaxData?.cgst_rate ?? 0;
    let igst_percentage = selectedTaxData?.igst_rate ?? 0;
    let utgst_percentage = selectedTaxData?.ugst_rate ?? 0;
    let cess_percentage = selectedTaxData?.cess ?? 0;
    let sgst_amount = (taxable_amount * sgst_percentage) / 100;
    let cgst_amount = (taxable_amount * cgst_percentage) / 100;
    let igst_amount = (taxable_amount * igst_percentage) / 100;
    let utgst_amount = (taxable_amount * utgst_percentage) / 100;
    let cess_amount = (taxable_amount * cess_percentage) / 100;
    let total_expense_amount = (
      item.gross_amount +
      sgst_amount +
      cgst_amount +
      igst_amount +
      utgst_amount +
      cess_amount
    ).toFixed(2);
    itemFormGroup.patchValue({
      sgst_percentage: sgst_percentage,
      cgst_percentage: cgst_percentage,
      igst_percentage: igst_percentage,
      utgst_percentage: utgst_percentage,
      cess_percentage: cess_percentage,
      sgst_amount: sgst_amount,
      cgst_amount: cgst_amount,
      igst_amount: igst_amount,
      utgst_amount: utgst_amount,
      cess_amount: cess_amount,
      total_expense_amount: parseFloat(total_expense_amount),
    });
    this.calculateExpenseTotals();
  }
  calculateTotals() {
    this.total.quantity = 0;
    this.total.rate = 0;
    this.total.item_amt = 0;
    this.total.discount_amt = 0;
    this.total.excise_tax_amount = 0;
    this.total.taxable_amt = 0;
    this.total.sgst_amt = 0;
    this.total.cgst_amt = 0;
    this.total.igst_amt = 0;
    this.total.net_amt = 0;
    this.total.utgst_amt = 0;
    this.total.cess_amt = 0;
    this.total.total_amount = 0;
    this.total.tax_amount = 0;
    this.total.total_tax_amount = 0;

    for (let i = 0; i < this.raw_material_sales_tax.value?.length; i++) {
      let row = this.raw_material_sales_tax.value[i];
      this.total.quantity += +Number(row.quantity ?? 0);
      this.total.rate += +Number(row.rate ?? 0);
      this.total.item_amt += +Number(row.item_amount ?? 0);
      this.total.discount_amt += +Number(row.disc_amount ?? 0);
      this.total.excise_tax_amount += +Number(row.excise_tax_amount ?? 0);
      this.total.taxable_amt += +Number(row.taxable_amount ?? 0);
      this.total.sgst_amt += +Number(row.sgst_amount ?? 0);
      this.total.cgst_amt += +Number(row.cgst_amount ?? 0);
      this.total.igst_amt += +Number(row.igst_amount ?? 0);
      this.total.net_amt += +Number(row.tax_amount ?? 0);
      this.total.utgst_amt += +Number(row.utgst_amount ?? 0);
      this.total.cess_amt += +Number(row.cess_amount ?? 0);
      this.total.total_amount += +Number(row.total_amount ?? 0);
      this.total.tax_amount += +Number(row.tax_amount ?? 0);
      this.total.total_tax_amount += +Number(row.total_tax_amount ?? 0);
    }
    if (this.add_type == 'gst') {
      this.calculateExpenseTotals();
    }
  }
  calculateExpenseTotals() {
    this.total.total_expense_amount = 0;
    for (let i = 0; i < this.raw_material_sales_expense.value?.length; i++) {
      let row = this.raw_material_sales_expense.value[i];
      this.total.total_expense_amount += +Number(row.total_expense_amount ?? 0);
    }
    this.calculateTotalBillValue();
  }
  calculateTotalBillValue() {
    let total_tax_amount = 0;
    if (this.raw_material_sales_tax?.value) {
      for (let i = 0; i < this.raw_material_sales_tax?.value?.length; i++) {
        let row = this.raw_material_sales_tax.value[i];
        if (row?.add) {
          total_tax_amount += Number(row.total_tax_amount ?? 0);
        } else {
          total_tax_amount -= Number(row.total_tax_amount ?? 0);
        }
      }
      this.totalBill.value =
        Number(this.totalAmount) +
        Number(this.total.total_expense_amount ?? 0) +
        Number(total_tax_amount ?? 0);
    }
  }
  set_discount_pecentage_blanck(index: number) {
    const itemFormGroup = this.raw_material_sales_tax.at(index);
    let item = itemFormGroup.value;
    itemFormGroup.patchValue({
      disc_percentage: 0,
      taxable_amount: item.item_amount - item.disc_amount,
      excise_tax_amount:
        (item.taxable_amount * item.excise_tax_percentage) / 100,
      tax_amount: (item.taxable_amount * item.tax_percentage) / 100,
      total_amount: (
        item.taxable_amount +
        item.excise_tax_amount +
        item.tax_amount
      ).toFixed(2),
    });
  }
  totalTax() {
    let total = 0;
    if (this.raw_material_sales_tax.value?.length) {
      this.raw_material_sales_tax.value.forEach((element: any) => {
        if (element?.add) {
          total += Number(element.tax_amount);
        } else {
          total -= Number(element.tax_amount);
        }
      });
    }
    return total;
  }
  onCommonRowChanged(index: number) {
    let formControl = this.raw_material_sales_tax.at(index);
    let choice = formControl.value.choice;
    let tax_on_parent = null;
    switch (choice) {
      case 'on_item_value':
        tax_on_parent = 'total_item_amount';
        break;
      case 'on_before_vat_cst':
        tax_on_parent = 'total_item_taxable_amount';
        break;
      case 'on_after_vat_cst':
        tax_on_parent = 'total_item_item_amount';
        break;
      default:
        tax_on_parent = null;
        break;
    }
    formControl.patchValue({
      tax_on_parent: tax_on_parent,
      extra: formControl.value.extra ? 'true' : null,
    });
    // this.raw_material_sales_tax.value.forEach((item: any, i: number) => {
    //   this.raw_material_sales_tax.at(i).patchValue({
    //     type: type,
    //     extra: extra ? 'true' : null,
    //   });
    // });
  }
  onVatTaxHeadChange(i: number) {
    const itemFormGroup = this.raw_material_sales_tax.at(i);
    let item = itemFormGroup.value;
    const taxItemId = item.tax_head;

    let taxable_amount = item.taxable_amount;
    const selectedTaxData = this.taxHeads.find(
      (item: any) => item.id === parseInt(taxItemId)
    );
    let tax_percentage = selectedTaxData?.tax_rate ?? 0;
    let tax_amount = selectedTaxData?.total_tax_rate
      ? (Number(this.totalAmount) * tax_percentage) / 100
      : 0;
    itemFormGroup.patchValue({
      tax_percentage: 0,
      tax_amount: (taxable_amount * tax_percentage) / 100,
      total_amount: (taxable_amount + tax_amount).toFixed(2),
    });
    this.calculateTotals();
  }
  getFormGroup() {
    return this.formGroup;
  }
  ngOnDestroy() {}
}
