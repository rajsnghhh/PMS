import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';


@Component({
  selector: 'app-merger-transport-name',
  templateUrl: './merger-transport-name.component.html',
  styleUrls: ['./merger-transport-name.component.scss',
    '../../../../assets/scss/scrollableTable.scss']
})
export class MergerTransportNameComponent implements OnInit {


  venderForm!: UntypedFormGroup;

  localStorageData: any;
  vendorList: any = [];
  vendorListFrom: any = [];
  allVendorData: any = [];
  fromUnitId: any = [];

  searchForm: any = {
    fromDate: '',
    toDate: '',
    vendor: ''
  }

  dropdownMultiselectGroupListSettings = {};
  dropdownMultiselectGroupList: any = [];
  vendorMultipleList: any = [];
  userArray: any = []

  constructor(private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewVendorList();
    this.viewVendorFromList();
    this.createVenderForm();
    this.setupMultiSelectOptions();
    this.viewMultipleVendorList();
  }

  createVenderForm() {
    this.venderForm = this.fb.group({
      filerVendor: [''],
      venderId: ['', [Validators.required]],
      venderFromId: ['', [Validators.required]]
    });
  }
  venderInput(event: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('name', event.target.value);
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }
  venderInputFrom(event: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('name', event.target.value);
    params.set('not_in_transporter_bill', 'true');

    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorListFrom = data.results;
    })
  }
  venderSelect() {
    this.venderForm.value.venderId = []
    this.vendorList = this.allVendorData.filter((item: { id: any; }) =>! this.venderForm.value.venderFromId.includes(item.id) )
  }
  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
      this.allVendorData = data.results;
    })
  }
  viewVendorFromList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    params.set('not_in_transporter_bill', 'true');

    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorListFrom = data.results;
    })
  }

  searchVender(){
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('transporter_from_date', this.searchForm.fromDate);
    params.set('transporter_to_date', this.searchForm.toDate);
    params.set('ids', this.userArray.toString());

    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
      this.vendorListFrom = data.results;
      this.allVendorData = data.results;
    })
  }




  mergeVender() {

    this.fromUnitId = [];
    this.fromUnitId.push(this.venderForm.value.venderFromId)

    let param = {
      "type": "vendor",
      "from_id_list": this.fromUnitId,
      "to_id": this.venderForm.value.venderId
    }
    this.apiservice.mergeUOMData(param).subscribe(data => {
      this.toastrService.success('Account Merged Successfully', '', {
        timeOut: 2000,
      });
      this.venderForm.reset();
    })

  }

  viewMultipleVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorMultipleList = data.results;
      this.showMultiStateSelect();
    })
  }

  setupMultiSelectOptions() {
    this.dropdownMultiselectGroupListSettings = {
      singleSelection: false,
      text: "Select Vendor",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
  }
  showMultiStateSelect() {
    this.dropdownMultiselectGroupList = [];
    for (const item of this.vendorMultipleList) {
      var obj = {
        id: item.id,
        itemName: item?.vendor_master_data?.vendor_name
      }
      this.dropdownMultiselectGroupList.push(obj);
    }
  }

  onMultiSelectAddUser(item: any) {
    this.userArray.push(item.id)
  }
  OnMultiDeSelectAddUser(item: any) {
    const index: number = this.userArray.indexOf(item.id);
    if (index !== -1) {
      this.userArray.splice(index, 1);
    }
  }
  onMultiSelectAddUserAll(items: any) {
    this.userArray = [];
    for (const item of items) {
      this.userArray.push(item.id);
    }
  }
  onMultiDeSelectAddUserAll(items: any) {
    this.userArray = [];
  }

}
