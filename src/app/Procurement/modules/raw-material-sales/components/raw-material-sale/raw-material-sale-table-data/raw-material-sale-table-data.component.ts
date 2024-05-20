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
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { DataSharingService } from '../../../data-sharing.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';

@Component({
  selector: 'app-raw-material-sale-table-data',
  templateUrl: './raw-material-sale-table-data.component.html',
  styleUrls: [
    './raw-material-sale-table-data.component.scss',
    '../../../../../../../assets/scss/scrollableTable.scss',
  ],
})
export class RawMaterialSaleTableDataComponent implements OnInit, OnChanges {
  @Output() parrentAction = new EventEmitter<any>();
  @Output() checkValidation = new EventEmitter<any>();
  @Output() totalPrice = new EventEmitter<Number>();
  @Input() checkValidData: boolean = false;
  @Input() add_type: any = null;
  @Input() rawMaterialSaleData: any = null;
  @Input() scope: any = null;
  formGroup!: FormGroup;
  receivedData: any;
  uomList: any = [];
  allMaterialList: any = [];
  masterItemGroupList: any = [];
  masterSubItemList: any[] = [];
  masterItemList: any[] = [];
  exciseTaxDetails: any[] = [];
  taxHeads: any[] = [];
  hideInput: boolean[] = [];
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  // total_Stock_qty:Number = 0;
  // total_unit_rate:Number = 0;
  // total_item_amt:Number = 0;
  // total_discount_amt:Number = 0;
  // total_taxable_amt:Number = 0;
  // total_sgst_amt:Number = 0;
  // total_cgst_amt:Number = 0;
  // total_igst_amt:Number = 0;
  // total_net_amt:Number = 0;
  // total_utgst_amt:Number = 0;
  // total_cess_amt:Number = 0;
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
    this.formGroup = this.fb.group({
      items: this.fb.array([this.newMaterial()]),
    });
    this.tatalAmountShareService.sharedData$.subscribe((data) => {
      this.receivedData = data && data.sendProjectSite;
    });
    this.getmasterList();
    this.getUomList();
    this.getTaxHeadData();
    this.getExciseTaxData();
  }
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.checkValidData) {
      this.onSubmit();
    }
    if (this.rawMaterialSaleData) {
      let item = this.rawMaterialSaleData;
      if (item?.items?.length) {
        this.items.clear();
        this.allMaterialList = await this.getAllMaterialList();
        item?.items.forEach((rowItem: any, i: number) => {
          if (this.add_type == 'gst') {
            rowItem.after_gst_amount = rowItem?.total_amount;
          }
          this.items.push(this.editMaterial(rowItem));
          let filteredItem = this.allMaterialList.filter(
            (material: { id: any }) => material.id == rowItem?.item
          );
          if (filteredItem.length > 0) {
            let item_group = filteredItem[0].material_type_details[0].parent_id;
            let sub_item_group = filteredItem[0].material_type_details[0].id;
            this.typeChange(
              filteredItem[0].material_type_details[0].parent_id,
              i
            );
            this.subTypeChange(filteredItem[0].material_type_details[0].id, i);
            this.items.at(i).patchValue({
              item_group: item_group,
              sub_item_group: sub_item_group,
              item: filteredItem[0].id,
              uom: filteredItem[0].unit_of_mesurement,
              hsn_code: filteredItem[0].material_hsn_code?.hsn_code,
            });
          }
        });
        this.calculateTotals();
      }
      if (this.add_type == 'gst') {
      } else {
      }
    }
  }
  getFormGroup() {
    return this.formGroup;
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
  get items() {
    return this.formGroup.get('items') as FormArray;
  }
  newMaterial(
    item = {
      item_group: null,
      sub_item_group: null,
      item: null,
      size_part_no_grade: null,
      quantity: 0,
      uom: null,
      weight: 0,
      tolerance_percentage: null,
      rate: 0,
      item_amount: 0,
      disc_percentage: 0,
      disc_amount: 0,
      excise_tax_head: null,
      excise_tax_percentage: 0,
      excise_tax_amount: 0,
      taxable_amount: 0,
      tax_head: null,
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
      currentStock: 0,
      after_gst_amount: 0,
      total_amount: 0,
      hsn_code: null,
      notes: null,
      amount_description: null,
    }
  ) {
    return this.fb.group({
      organization: this.localStorage.organisation_id(),
      item_group: [
        item?.item_group ?? null,
        Validators.compose([Validators.required]),
      ],
      sub_item_group: [
        item?.sub_item_group ?? null,
        Validators.compose([Validators.required]),
      ],
      item: [item?.item ?? null, Validators.compose([Validators.required])],
      size_part_no_grade: [
        item?.size_part_no_grade ?? null,
        Validators.compose([]),
      ],
      quantity: [
        item?.quantity ?? 0,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?\d*(\.\d+)?$/),
        ]),
      ],
      uom: [item?.uom ?? null, Validators.compose([])],
      weight: [item?.weight ?? 0, Validators.compose([])],
      tolerance_percentage: [
        item?.tolerance_percentage ?? 0,
        Validators.compose([]),
      ],
      rate: [
        item?.rate ?? 0,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?\d*(\.\d+)?$/),
        ]),
      ],
      item_amount: [item?.item_amount ?? 0, Validators.compose([])],
      disc_percentage: [
        item?.disc_percentage ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      disc_amount: [
        item?.disc_amount ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      excise_tax_head: [item?.excise_tax_head ?? null, Validators.compose([])],
      excise_tax_percentage: [
        item?.excise_tax_percentage ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      excise_tax_amount: [item?.excise_tax_amount ?? 0, Validators.compose([])],
      taxable_amount: [item?.taxable_amount ?? 0, Validators.compose([])],
      tax_head: [item?.tax_head ?? null, Validators.compose([])],
      tax_percentage: [
        item?.tax_percentage ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      tax_amount: [
        item?.tax_amount ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      sgst_percentage: [item?.item_group ?? 0, Validators.compose([])],
      cgst_percentage: [item?.sgst_percentage ?? 0, Validators.compose([])],
      igst_percentage: [item?.igst_percentage ?? 0, Validators.compose([])],
      utgst_percentage: [item?.utgst_percentage ?? 0, Validators.compose([])],
      cess_percentage: [item?.cess_percentage ?? 0, Validators.compose([])],
      sgst_amount: [item?.sgst_amount ?? 0, Validators.compose([])],
      cgst_amount: [item?.cgst_amount ?? 0, Validators.compose([])],
      igst_amount: [item?.igst_amount ?? 0, Validators.compose([])],
      utgst_amount: [item?.utgst_amount ?? 0, Validators.compose([])],
      cess_amount: [item?.cess_amount ?? 0, Validators.compose([])],
      currentStock: [item?.currentStock ?? 0, Validators.compose([])],
      after_gst_amount: [item?.after_gst_amount ?? 0, Validators.compose([])],
      total_amount: [item?.total_amount ?? 0, Validators.compose([])],
      hsn_code: [item?.hsn_code ?? null, Validators.compose([])],
      notes: [item?.notes ?? null, Validators.compose([])],
      amount_description: [
        item?.amount_description ?? null,
        Validators.compose([]),
      ],
    });
  }
  editMaterial(
    item = {
      id: null,
      item_group: null,
      sub_item_group: null,
      item: null,
      size_part_no_grade: null,
      quantity: 0,
      uom: null,
      weight: 0,
      tolerance_percentage: null,
      rate: 0,
      item_amount: 0,
      disc_percentage: 0,
      disc_amount: 0,
      excise_tax_head: null,
      excise_tax_percentage: 0,
      excise_tax_amount: 0,
      taxable_amount: 0,
      tax_head: null,
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
      currentStock: 0,
      after_gst_amount: 0,
      total_amount: 0,
      hsn_code: null,
      notes: null,
      amount_description: null,
    }
  ) {
    return this.fb.group({
      organization: this.localStorage.organisation_id(),
      id: [item?.id ?? null],
      item_group: [
        item?.item_group ?? null,
        Validators.compose([Validators.required]),
      ],
      sub_item_group: [
        item?.sub_item_group ?? null,
        Validators.compose([Validators.required]),
      ],
      item: [item?.item ?? null, Validators.compose([Validators.required])],
      size_part_no_grade: [
        item?.size_part_no_grade ?? null,
        Validators.compose([]),
      ],
      quantity: [
        item?.quantity ?? 0,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?\d*(\.\d+)?$/),
        ]),
      ],
      uom: [item?.uom ?? null, Validators.compose([])],
      weight: [item?.weight ?? 0, Validators.compose([Validators.required])],
      tolerance_percentage: [
        item?.tolerance_percentage ?? 0,
        Validators.compose([]),
      ],
      rate: [
        item?.rate ?? 0,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^-?\d*(\.\d+)?$/),
        ]),
      ],
      item_amount: [item?.item_amount ?? 0, Validators.compose([])],
      disc_percentage: [
        item?.disc_percentage ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      disc_amount: [
        item?.disc_amount ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      excise_tax_head: [item?.excise_tax_head ?? null, Validators.compose([])],
      excise_tax_percentage: [
        item?.excise_tax_percentage ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      excise_tax_amount: [
        item?.excise_tax_amount ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      taxable_amount: [item?.taxable_amount ?? 0, Validators.compose([])],
      tax_head: [item?.tax_head ?? null, Validators.compose([])],
      tax_percentage: [
        item?.tax_percentage ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      tax_amount: [
        item?.tax_amount ?? 0,
        Validators.compose([Validators.pattern(/^-?\d*(\.\d+)?$/)]),
      ],
      sgst_percentage: [item?.item_group ?? 0, Validators.compose([])],
      cgst_percentage: [item?.sgst_percentage ?? 0, Validators.compose([])],
      igst_percentage: [item?.igst_percentage ?? 0, Validators.compose([])],
      utgst_percentage: [item?.utgst_percentage ?? 0, Validators.compose([])],
      cess_percentage: [item?.cess_percentage ?? 0, Validators.compose([])],
      sgst_amount: [item?.sgst_amount ?? 0, Validators.compose([])],
      cgst_amount: [item?.cgst_amount ?? 0, Validators.compose([])],
      igst_amount: [item?.igst_amount ?? 0, Validators.compose([])],
      utgst_amount: [item?.utgst_amount ?? 0, Validators.compose([])],
      cess_amount: [item?.cess_amount ?? 0, Validators.compose([])],
      currentStock: [item?.currentStock ?? 0, Validators.compose([])],
      after_gst_amount: [item?.after_gst_amount ?? 0, Validators.compose([])],
      total_amount: [item?.total_amount ?? 0, Validators.compose([])],
      hsn_code: [item?.hsn_code ?? null, Validators.compose([])],
      notes: [item?.notes ?? null, Validators.compose([])],
      amount_description: [
        item?.amount_description ?? null,
        Validators.compose([]),
      ],
    });
  }
  addItems(i: number) {
    let formGroup = this.items.at(i);
    formGroup.markAllAsTouched();
    if (formGroup.valid) {
      this.items.push(this.newMaterial());
    }
  }
  deleteItem(index: number) {
    this.items.removeAt(index);
  }
  getAllMaterialList() {
    return new Promise((resolve, reject) => {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorage.organisation_id());
      params.set('all', 'true');
      this.apiservice.getMaterialManagementList(params).subscribe((data) => {
        resolve(data.results);
      });
    });
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
    // for (let reqItem of this.items.value) {
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
  setMaterialMasterData(index: number) {
    let formControl = this.items.at(index);
    let product = formControl.value;
    const selectedItem = this.masterItemList[index].find(
      (item: any) => Number(item.id) == Number(product.item)
    );
    if (selectedItem) {
      formControl.patchValue({
        uom: selectedItem?.unit_of_mesurement ?? null,
        hsn_code: selectedItem?.material_hsn_code?.hsn_code ?? null,
      });
    }
    if (
      product.item &&
      this.receivedData?.projectId &&
      this.receivedData?.siteId
    ) {
      this.fetchProcurementMaterialDetails(
        product.item,
        this.receivedData?.projectId,
        index
      );
      this.fetchProcurementInventoryDetails(product.item, index);
    } else {
      // Toastr Message
      this.toastrService.warning('Please fillup all previous required field');
    }
  }
  

  fetchProcurementMaterialDetails(
    id: string,
    project_id: string,
    index: number
  ) {
    let params = new URLSearchParams();
    params.set('id', id);
    params.set('project', project_id);
    this.procurementApiService
      .getProcurementMaterialDetails(params)
      .subscribe((data) => {
        // this.form.items[index].MaterialBOQ = data.Data
      });
  }
  fetchProcurementInventoryDetails(id: string, index: number) {
    let req = new URLSearchParams();
    req.set('organization_id', this.localStorage.organisation_id());
    req.set('site', this.receivedData?.siteId);
    req.set('material', id);
    let formControl = this.items.at(index);
    this.procurementApiService
      .getProcurementInventoryDetails(req)
      .subscribe((data) => {
        let currentStock = data.results[0]?.quantity;
        formControl.patchValue({
          currentStock: currentStock ? currentStock : 0,
        });
        formControl
          .get('quantity')
          ?.setValidators(Validators.max(currentStock));
        formControl.get('quantity')?.updateValueAndValidity();
        // this.form.items[index].currentStock = data.results[0]?.quantity ? data.results[0]?.quantity : 0
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
  showMaterialsCalculatedAmt(
    index: number,
    calculateDiscPercent: boolean = false
  ): void {
    const itemFormGroup = this.items.at(index);
    let item = itemFormGroup.value;
    if (item.quantity > item.currentStock) {
      this.toastrService.error(
        `"Required ${item.quantity} , Available ${item.currentStock}"`,
        `Insufficient Stock Quantity`
      );
    }
    let item_amount = item.quantity * item.rate;
    let disc_percentage = item.disc_percentage;
    let disc_amount = (item_amount * item.disc_percentage) / 100;
    let taxable_amount = item_amount - disc_amount;
    let tax_percentage = item.tax_percentage;
    let excise_tax_percentage = item.excise_tax_percentage;
    let excise_tax_amount = (taxable_amount * excise_tax_percentage) / 100;
    let tax_amount = (taxable_amount * tax_percentage) / 100;
    let total_amount = (
      taxable_amount +
      excise_tax_amount +
      tax_amount
    ).toFixed(2);
    if (calculateDiscPercent) {
      // let disc_amount = item.disc_amount;
      // disc_percentage = (disc_amount / 100) * Number(total_amount)
      // disc_amount = item.disc_amount
    }

    itemFormGroup.patchValue({
      item_amount: item_amount,
      disc_percentage: disc_percentage,
      disc_amount: disc_amount,
      taxable_amount: taxable_amount,
      excise_tax_amount: excise_tax_amount,
      tax_amount: tax_amount,
      total_amount: total_amount,
      after_gst_amount: total_amount,
    });
    this.calculateTotals();
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
    const itemFormGroup = this.items.at(index);
    let item = itemFormGroup.value;
    const taxItemId = tax;
    let taxable_amount = item.taxable_amount;
    const selectedTaxData = this.taxHeads.find(
      (item: any) => item.id === parseInt(taxItemId)
    );
    const selectedExciseTaxData = this.exciseTaxDetails.find(
      (item: any) => item.id === parseInt(taxItemId)
    );

    // if (selectedTaxData || selectedExciseTaxData) {
    if (type == 'excise') {
      let excise_tax_percentage = selectedExciseTaxData?.tax_rate ?? 0;
      let default_excise_tax_amount =
        selectedExciseTaxData?.total_tax_rate ?? 0;
      let excise_tax_amount = (taxable_amount * excise_tax_percentage) / 100;
      let tax_amount = item.tax_amount;
      itemFormGroup.patchValue({
        excise_tax_percentage: excise_tax_percentage ?? 0,
        excise_tax_amount: excise_tax_amount,
        total_amount: (taxable_amount + excise_tax_amount + tax_amount).toFixed(
          2
        ),
      });
    }
    if (type == 'tax') {
      let tax_percentage = selectedTaxData?.tax_rate ?? 0;
      let default_tax_amount = selectedTaxData?.total_tax_rate ?? 0;
      let tax_amount = (taxable_amount * tax_percentage) / 100;
      let excise_tax_amount = item.excise_tax_amount;
      itemFormGroup.patchValue({
        tax_percentage: tax_percentage,
        tax_amount: tax_amount,
        total_amount: (taxable_amount + excise_tax_amount + tax_amount).toFixed(
          2
        ),
      });
    }

    // const discount_amt = item.item_amount * item.disc_percentage / 100
    // item.disc_amount = discount_amt
    // item.taxable_amount = item.item_amount - discount_amt
    // }
    this.calculateTotals();
  }
  taxMaterialsAutoFilled(tax: any, index: any) {
    const itemFormGroup = this.items.at(index);
    let item = itemFormGroup.value;
    const taxItemId = tax;

    const selectedTaxData = this.taxHeads.find(
      (item: any) => item.id === parseInt(taxItemId)
    );
    if (selectedTaxData) {
      let taxable_amount = item.taxable_amount;
      let sgst_percentage = selectedTaxData.sgst_rate;
      let cgst_percentage = selectedTaxData.cgst_rate;
      let igst_percentage = selectedTaxData.igst_rate;
      let utgst_percentage = selectedTaxData.ugst_rate;
      let cess_percentage = selectedTaxData.cess;
      let sgst_amount = (taxable_amount * sgst_percentage) / 100;
      let cgst_amount = (taxable_amount * cgst_percentage) / 100;
      let igst_amount = (taxable_amount * igst_percentage) / 100;
      let utgst_amount = (taxable_amount * utgst_percentage) / 100;
      let cess_amount = (taxable_amount * cess_percentage) / 100;
      let after_gst_amount = (
        taxable_amount +
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
        after_gst_amount: after_gst_amount,
      });
    }
    this.calculateTotals();
  }
  set_discount_pecentage_blanck(index: number) {
    const itemFormGroup = this.items.at(index);
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
    this.calculateTotals();
  }
  totalQuantity() {
    let total = 0;
    if (this.items.value?.length) {
      this.items.value.forEach((element: any) => {
        total += Number(element.quantity);
      });
    }
    return total;
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
    this.total.tax_amount = 0;
    this.total.total_amount = 0;

    for (let i = 0; i < this.items.value?.length; i++) {
      let row = this.items.value[i];
      this.total.quantity += +Number(row.quantity ?? 0);
      this.total.rate += +Number(row.rate ?? 0);
      this.total.item_amt += +Number(row.item_amount ?? 0);
      this.total.discount_amt += +Number(row.disc_amount ?? 0);
      this.total.excise_tax_amount += +Number(row.excise_tax_amount ?? 0);
      this.total.taxable_amt += +Number(row.taxable_amount ?? 0);
      this.total.sgst_amt += +Number(row.sgst_amount ?? 0);
      this.total.cgst_amt += +Number(row.cgst_amount ?? 0);
      this.total.igst_amt += +Number(row.igst_amount ?? 0);
      this.total.net_amt += +Number(row.after_gst_amount ?? 0);
      this.total.utgst_amt += +Number(row.utgst_amount ?? 0);
      this.total.cess_amt += +Number(row.cess_amount ?? 0);
      this.total.tax_amount += +Number(row.tax_amount ?? 0);
      this.total.total_amount += +Number(row.total_amount ?? 0);
      if (this.add_type == 'gst') {
        this.tatalAmountShareService.updateTotalNetAmt(this.total.net_amt ?? 0);
        this.tatalAmountShareService.updateTotalItemAmt(
          this.total.taxable_amt ?? 0
        );
      } else {
        this.tatalAmountShareService.updateTotalNetAmt(
          this.total.total_amount ?? 0
        );
        this.tatalAmountShareService.updateTotalItemAmt(
          this.total.taxable_amt ?? 0
        );
      }
    }
  }
}
