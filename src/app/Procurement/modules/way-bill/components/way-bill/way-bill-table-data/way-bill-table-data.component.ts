import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataSharingService } from 'src/app/Procurement/modules/raw-material-sales/data-sharing.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { LocalStorageService } from 'src/app/Shared/Services/local-storage.service';
import * as Global from 'src/app/global';

@Component({
  selector: 'app-way-bill-table-data',
  templateUrl: './way-bill-table-data.component.html',
  styleUrls: ['./way-bill-table-data.component.scss'],
})
export class WayBillTableDataComponent {
  Global = Global;
  @Output() parrentAction = new EventEmitter<any>();
  @Output() checkValidation = new EventEmitter<any>();
  @Input() checkValidData: boolean = false;
  formGroup!: FormGroup;
  uomList: any = [];
  allMaterialList: any = [];
  masterItemGroupList: any = [];
  masterSubItemList: any[] = [];
  masterItemList: any[] = [];
  exciseTaxDetails: any[] = [];
  taxHeads: any[] = [];
  @ViewChild('submitButton', { read: ElementRef })
  submitButton!: ElementRef<HTMLElement>;
  @Input() wayBillData: any = null;
  @Input() scope: any = null;
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
    private localStorage: LocalStorageService,
    private procurementApiService: PROCUREMENTAPIService
  ) {}
  ngOnInit(): void {
    this.formGroup = this.fb.group({
      items: this.fb.array([this.newMaterial()]),
    });
    this.getmasterList();
    this.getUomList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.checkValidData) {
      this.onSubmit();
    }
    if (this.wayBillData) {
      setTimeout(async () => {
        this.allMaterialList = await this.getAllMaterialList();
        if (this.wayBillData?.items?.length) {
          this.items.clear();
          this.wayBillData?.items.forEach((item: any, i: number) => {
            this.items.push(this.newMaterial(item));
            let filteredItem = this.allMaterialList.filter(
              (material: { id: any }) => material.id == item?.item
            );
            if (filteredItem.length > 0) {
              let item_group =
                filteredItem[0].material_type_details[0].parent_id;
              let sub_item_group = filteredItem[0].material_type_details[0].id;
              this.typeChange(
                filteredItem[0].material_type_details[0].parent_id,
                i
              );
              this.subTypeChange(
                filteredItem[0].material_type_details[0].id,
                i
              );
              this.items.at(i).patchValue({
                item_group: item_group,
                sub_item_group: sub_item_group,
                item: filteredItem[0].id,
                unit: filteredItem[0].unit_of_mesurement,
              });
            }
          });
        }
      });
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
      id: '',
      bill_no: null,
      bill_date: null,
      item_group: null,
      sub_item_group: null,
      item: null,
      quantity: null,
      unit: null,
      bill_amount: null,
    }
  ) {
    return this.fb.group({
      organization: this.localStorage.organisation_id(),
      bill_no: [
        item?.bill_no ?? null,
        Validators.compose([Validators.required]),
      ],
      bill_date: [
        item?.bill_date ?? Global.TODAY,
        Validators.compose([Validators.required]),
      ],
      item_group: [
        item?.item_group ?? null,
        Validators.compose([Validators.required]),
      ],
      sub_item_group: [
        item?.bill_no ?? null,
        Validators.compose([Validators.required]),
      ],
      item: [item?.bill_no ?? null, Validators.compose([Validators.required])],
      quantity: [
        item?.quantity ?? 0,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^-?\d*(\.\d+)?$/),
        ]),
      ],
      unit: [item?.bill_no ?? null, Validators.compose([])],
      bill_amount: [
        item?.bill_amount ?? 0,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^-?\d*(\.\d+)?$/),
        ]),
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
        unit: selectedItem?.unit_of_mesurement ?? null,
        hsn_code: selectedItem?.material_hsn_code?.hsn_code ?? null,
      });
    }
  }

  getUomList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorage.organisation_id());
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe((data) => {
      this.uomList = data.results;
    });
  }
}
