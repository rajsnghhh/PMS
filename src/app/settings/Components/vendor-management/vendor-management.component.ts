import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { Router } from '@angular/router';
declare var window: any;

@Component({
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.scss',
    '../../../../assets/scss/scrollableTable.scss']
})
export class VendorManagementComponent {
  reload = false

  @ViewChild('venderId')
  venderId!: VendorDetailsComponent;

  localStorageData: any;
  vendorList: any = [];
  vendorData: any = [];
  userPermissions: any = {};
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  deleteId: any;
  addGroup: any;
  editGroup: any;
  viewGroup: any;
  editItem: any;
  scope = ''
  viewItem: any;
  deleteGroup: any;
  vendorId: any;
  tableVendorData: any;
  CompanyData: any = [];
  purchaseUrl:boolean=false;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private cdref: ChangeDetectorRef,
    private router:Router

  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewVendorList();
    this.getUserPermission();

    if(this.router.url=='/pms/settings/vendor-management-purchase'){
      this.purchaseUrl=true;
    }
  }


  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  setupModalOfcanvas() {
    this.deleteGroup = new window.bootstrap.Modal(
      document.getElementById('deleteGroup')
    );

    this.addGroup = new window.bootstrap.Offcanvas(
      document.getElementById('addVendor')
    );

    this.editGroup = new window.bootstrap.Offcanvas(
      document.getElementById('editVendor')
    );

    this.viewGroup = new window.bootstrap.Offcanvas(
      document.getElementById('VendorDetails')
    );
  }

  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('list', 'true');
    this.apiservice.getVendorList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.vendorList = data.results;
      this.setListData()
    })
  }
  addnew () {
    this.scope = 'add'
  }

  addNewGroup(item: any) {
    this.scope = 'edit'
    this.datasharedservice.saveLocalData('vendor_id', JSON.stringify(item));
    //  this.editItem = item;
    if (item == null) {
      this.addGroup.show();
    } else {
      this.editItem = item;
      //this.viewVendorList();
      this.editGroup.show();
    }
  }

  closeAddCanvas() {
    this.scope = ''
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
    this.scope = 'details'
    // this.venderId.viewVendorList(item.id);
    this.viewItem = item;
    this.reload = !this.reload
    if (item2 == null) {
      // this.addGroup.show();
    } else {
      // this.viewItem = item;
      // this.viewVendorList();
      // this.viewGroup.show();
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

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
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
      this.setListData()
    })
  }

  setListData() {
    for(let i=0;i<this.vendorList.length;i++) {
      let index = this.vendorList[i].vendor_master_data.findIndex((x: { internal_name: string; }) => x.internal_name ==="vendor_address");

      let street = this.vendorList[i].vendor_master_data.findIndex((x: { internal_name: string; }) => x.internal_name ==="street");
      let street2 = this.vendorList[i].vendor_master_data.findIndex((x: { internal_name: string; }) => x.internal_name ==="street2");
      let street3 = this.vendorList[i].vendor_master_data.findIndex((x: { internal_name: string; }) => x.internal_name ==="street3");

      this.vendorList[i].vendor_master_data[index].value =  this.vendorList[i].vendor_master_data[street].value + this.vendorList[i].vendor_master_data[street2].value + this.vendorList[i].vendor_master_data[street3].value + this.vendorList[i].vendor_master_data[index].value
    }
  }

  downloadCsv() {
    let hadderlist = ['Sl.NO']
    for (const item of this.vendorList[0].vendor_master_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.vendorList.length; i++) {
      var obj = [i + 1]
      for (const inneritem of this.vendorList[i].vendor_master_data) {
        obj.push(inneritem.value)
      }
      this.CompanyData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: [hadderlist]
    };
    new ngxCsv(this.CompanyData, "vendorList", options);
    window.location.reload();
  }

  downloadPdf() {
    let hadderlist = ['S.No']
    for (const item of this.vendorList[0].vendor_master_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.vendorList.length; i++) {
      var obj = [i + 1]
      for (const inneritem of this.vendorList[i].vendor_master_data) {
        obj.push(inneritem.value)
      }
      this.CompanyData.push(obj);
    }
    var header = [hadderlist];
    var pdfsize = 'a0';
    var doc = new jsPDF('p', 'pt', pdfsize);
    (doc as any).autoTable({
      head: header, body: this.CompanyData,
      startY: 10,
      startX: 0,
      styles: {
        overflow: 'linebreak',
        fontSize: 2,
      }
    })
    doc.save("Vendor List");
    doc.output('dataurlnewwindow')
    this.CompanyData = [];
  }


}
