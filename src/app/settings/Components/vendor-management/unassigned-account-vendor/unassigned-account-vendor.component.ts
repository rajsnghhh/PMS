import { ChangeDetectorRef, Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { VendorDetailsComponent } from '../vendor-details/vendor-details.component';

@Component({
  selector: 'app-unassigned-account-vendor',
  templateUrl: './unassigned-account-vendor.component.html',
  styleUrls: [
    './unassigned-account-vendor.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class UnassignedAccountVendorComponent implements OnInit, OnChanges {

  @ViewChild('venderId') venderId!: VendorDetailsComponent;

  UnassignedVenderForm!: UntypedFormGroup;
  radioCheck:any='INDENT';
  localStorageData:any;
  UnassignedVendorList:any=[];
  masterlist:any = []
  materialGroupList:any = [];
  vendorList: Array<any> = [];

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  deleteId: any;
  addGroup: any;
  editGroup: any;
  viewGroup: any;
  editItem: any;
  viewItem: any;
  deleteGroup: any;
  vendorId: any;
  tableVendorData: any;
  CompanyData: any = [];

  form:any = {
    requested_items : []
  };


  @Input() unassignedVendorAdvancedSearchFormValue: any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private cdref: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewVendorList();
    // this.getmasterList();
    // this.getData();
    // this.createItemWiseVenderForm();
  }
  ngOnChanges() {
    if (this.unassignedVendorAdvancedSearchFormValue) {
      this.viewVendorList()
    }
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('unassigned', 'true');

    if (this.unassignedVendorAdvancedSearchFormValue) {
      for (const [key, value] of Object.entries(this.unassignedVendorAdvancedSearchFormValue)) {
        let val = '' + value
        let ky = '' + key
        params.set(ky, val)
      }
    }

    this.apiservice.getVendorList(params).subscribe(data => {
      this.vendorList = data.results;
      
    })
  }

  addNewGroup(item: any) {
    this.datasharedservice.saveLocalData('vendor_id', JSON.stringify(item));
    //  this.editItem = item;
    if (item == null) {
      this.addGroup.show();
    } else {
      this.editItem = item;
      this.viewVendorList();
      this.editGroup.show();
    }
  }

  closeAddCanvas() {
    this.viewVendorList();
    if (this.editItem) {
      this.editGroup.hide()
    } else {
      this.addGroup.hide()
    }
  }

  deletePlantValue(item: any) {
    this.deleteId = item.id;
  }

  vendorDetails(item: any, item2: any) {
    this.venderId.viewVendorList(item.id);
    if (item2 == null) {
      this.addGroup.show();
    } else {
      this.viewItem = item;
      this.viewVendorList();
      this.viewGroup.show();
    }
  }

  deletePlantModel() {
    this.apiservice.delVendor(this.deleteId, this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.viewVendorList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)
    this.apiservice.getVendorList(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }
}
