import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-itemwise-vendor',
  templateUrl: './itemwise-vendor.component.html',
  styleUrls: ['./itemwise-vendor.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class ItemwiseVendorComponent implements OnInit {

  ItemWiseVenderForm!: UntypedFormGroup;
  radioCheck:any='INDENT';
  localStorageData:any;
  itemWiseVendorList:any=[];
  masterlist:any = []
  materialGroupList:any = [];
  form:any = {
    mr_table : false,
    requested_items : []
  };

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private fb: UntypedFormBuilder,

  ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getmasterList();
    this.getData();
    this.createItemWiseVenderForm();
  }

  createItemWiseVenderForm() {
    this.ItemWiseVenderForm = this.fb.group({
      vendor_name: [''],
      item_id: [''],
      item_group_id:[''],
      item_sub_group_id: [''],
      rate_from: [''],
      rate_to: [''],
      delivery_days_from: [''],
      delivery_days_to: ['']
    });
  }

  serachVendor(){
    const groupId = this.masterlist.find((element:any) => element?.material_type_name==this.form.requested_items?.requested_material_group)?.material_type;
    const subGroupId = this.masterlist.find((element:any) => element?.material_sub_type_name==this.form.requested_items?.requested_material_sub_group)?.material_sub_type;
    if(groupId){
      this.ItemWiseVenderForm.controls['item_group_id'].setValue(groupId);
    }
    if(subGroupId){
      this.ItemWiseVenderForm.controls['item_sub_group_id'].setValue(subGroupId);
    }
    if(this.form.requested_items?.requested_material){
      this.ItemWiseVenderForm.controls['item_id'].setValue(this.form.requested_items?.requested_material);
    }

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('vendor_name', this.ItemWiseVenderForm.value.vendor_name);
    params.set('item_id', this.ItemWiseVenderForm.value.item_id);
    params.set('item_group_id', this.ItemWiseVenderForm.value.item_group_id);
    params.set('item_sub_group_id', this.ItemWiseVenderForm.value.item_sub_group_id);
    params.set('rate_from', this.ItemWiseVenderForm.value.rate_from);
    params.set('rate_to', this.ItemWiseVenderForm.value.rate_to);
    params.set('delivery_days_from', this.ItemWiseVenderForm.value.delivery_days_from);
    params.set('delivery_days_to', this.ItemWiseVenderForm.value.delivery_days_to);

    this.apiservice.getItemWiseVendorList(params).subscribe(data=>{
      this.itemWiseVendorList=data.results.Data;
    })
  }

  getData(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getItemWiseVendorList(params).subscribe(data=>{
      this.itemWiseVendorList=data.results.Data;
      this.itemWiseVendorList.sort((a:any, b:any) => a.vendor_name.localeCompare(b.vendor_name))
    })
  }


  getmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.masterlist = data.results
      this.generateMaterialData()
    })
  }

  generateMaterialData() {
    this.materialGroupList = [...new Set(this.masterlist.map((item: { material_type_name: any; }) => item.material_type_name))];
  }

  setMaterialMasterData(autoPopulateScope:boolean) {
    for(let i=0;i<this.masterlist.length;i++) {
      if(this.masterlist[i].id == this.form.requested_items.requested_material) {
        this.form.requested_items.MaterialmasterData = this.masterlist[i]
        if(autoPopulateScope) {
          this.form.requested_items.requested_material_group = this.masterlist[i].material_type_name
          this.setMaterialSubGroup()
          this.form.requested_items.requested_material_sub_group = this.masterlist[i].material_sub_type_name
          this.setMaterialList()
        }
        break;
      }
    }
  }

  setMaterialSubGroup() {
    let findText = this.form.requested_items.requested_material_group
    let catagoryList = this.masterlist.filter(function (el:any) {
      return el.material_type_name == findText
    });
    let subCatagoryList = [...new Set(catagoryList.map((item: { material_sub_type_name: any; }) => item.material_sub_type_name))];
    this.form.requested_items.MaterilSubGroupList = subCatagoryList;
  }

  setMaterialList() {
    let findGroup = this.form.requested_items.requested_material_group
    let findSubGroup = this.form.requested_items.requested_material_sub_group
    let materiallist =this.masterlist.filter(function (el:any) {
      return el.material_type_name == findGroup && el.material_sub_type_name == findSubGroup 
    });
    this.form.requested_items.MaterilFilterList = materiallist
  }
 
}
