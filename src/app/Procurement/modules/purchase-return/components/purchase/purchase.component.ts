import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PurchaseTopComponent } from '../purchase-top/purchase-top.component';
import { PurchaseTableComponent } from '../purchase-table/purchase-table.component';
import { PurchaseBelowTableComponent } from '../purchase-below-table/purchase-below-table.component';
import { PurchaseGstTableComponent } from '../purchase-gst-table/purchase-gst-table.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent {
  reload = false
  isPurchase_Approver = false
  localStorageData: any
  scope = ''
  prefieldData: any = {}
  projectData: any = {}
  gstScope = false

  private isAddMRProcurementCalled = false;

  @ViewChild(PurchaseTopComponent) PurchaseTopComponent: any;
  @ViewChild(PurchaseTableComponent) PurchaseTableComponent: any;
  @ViewChild(PurchaseGstTableComponent) PurchaseGstTableComponent: any;
  @ViewChild(PurchaseBelowTableComponent) PurchaseBelowTableComponent: any;

  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService
  ) {

  }

  ngOnInit(): void {
    this.getUserDetails()
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    if (this.router.url.indexOf('/procurement/purchase-return/update-gst') > -1 || this.router.url.indexOf('/procurement/purchase-return/update') > -1) {
      this.scope = 'update'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/purchase-return/view-gst') > -1 || this.router.url.indexOf('/procurement/purchase-return/view') > -1) {
      this.scope = 'view'
      this.getPrefieldData()
    } else {
      this.scope = 'add'
    }
    
    if (this.router.url.indexOf('/procurement/purchase-return/add-gst') > -1 || this.router.url.indexOf('/procurement/purchase-return/view-gst') > -1 || this.router.url.indexOf('/procurement/purchase-return/update-gst') > -1) {
      this.gstScope = true
    } else {
      this.gstScope = false
    }
    if(this.activeroute.snapshot.paramMap.get('grnID')) {
      this.getgrnData()
    }
  }

  reloadChild() {
    this.reload = !this.reload
  }

  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0].user_permissions
      if (rolesArray.includes('procurement-mr-approver')) {
        this.isPurchase_Approver = true
      }
    })
  }

  getgrnData() {
    let params = new URLSearchParams();
    let grnId = JSON.parse(this.activeroute.snapshot.paramMap.get('grnID') || '{}')

    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', grnId);
    
    this.procurementApiService.getGRNDetails(params).subscribe(data => {
      this.prefieldData.site = data.site;
      this.prefieldData.store = data.store;
      this.prefieldData.items = this.generateGRNItemList(data.grn_items);
      this.reloadChild()
    });
  }

  generateGRNItemList(data:any) {
    for(let i=0;i<data.length;i++) {
      delete data[i].id
      data[i].material_details = data[i]?.material_details[0],
      data[i].material_details.material_type = data[i].material_details.material_type_id 
      
      data[i].grn_item = this.activeroute.snapshot.paramMap.get('grnID')
    }
    return data
  }


  getProjectData(projectId: any) {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.localStorageData.organisation_details[0].id,
        id: projectId,
      }
    )
    this.apiservice.getProjectData(query).subscribe(data => {
      this.projectData = data.project_data
    })
  }

  createMR() {
    this.PurchaseTopComponent.save()
    if (this.gstScope) {
      this.PurchaseGstTableComponent.save()
    } else {
      this.PurchaseTableComponent.save()
    }
    this.PurchaseBelowTableComponent.save()
  }

  getPrefieldData() {
    let params = new URLSearchParams();
    let procurementID = JSON.parse(this.activeroute.snapshot.paramMap.get('purchaseID') || '{}')
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', procurementID);
    this.procurementApiService.getPurchaseReturnListDetails(params).subscribe(data => {
      for(let i=0;i<data.items.length;i++) {
        data.items[i].item = data.items[i].material
      }
      this.prefieldData = data
      // this.getProjectData(this.prefieldData.project)
    });
  }

  updateMR() {
    this.PurchaseTopComponent.save()
    if (this.gstScope) {
      this.PurchaseGstTableComponent.save()
    } else {
      this.PurchaseTableComponent.save()
    }
    this.PurchaseBelowTableComponent.save()
  }

  createData: any = {}

  appendData(req: any) {
    req = JSON.parse(req)
    this.createData = { ...this.createData, ...req };

    if (
      this.createData.purchse_table &&
      this.createData.purchase_bottom &&
      this.createData.purchase_TopValid &&
      !this.isAddMRProcurementCalled
    ) {
      this.createData.organization = this.localStorageData.organisation_details[0].id;
      this.isAddMRProcurementCalled = true;
      this.addProcurement();
    }

  }

  addProcurement() {

    for(let i=0;i<this.createData.items.length;i++) {
      this.createData.items[i].material = this.createData.items[i].item
    }

    if (this.scope == 'add') {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.createData.financialyear = this.localStorageData.financial_year[0].id

      if (this.gstScope) {
        this.createData.tax_type = "gst"
      } else {
        this.createData.tax_type = "vat"
      }

      if(this.activeroute.snapshot.paramMap.get('grnID')) {
        this.createData.grn = this.activeroute.snapshot.paramMap.get('grnID')
      }

      this.procurementApiService.addPurchaseReturnList(params, this.createData).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        this.backtolist()
      },
        (error) => {
          this.isAddMRProcurementCalled = false;
        });
    }
    if (this.scope == 'update') {
      this.createData.attachments = this.createData.attachments.filter((items: { id: any; }) => !items.id)
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'edit');
      params.set('id', this.prefieldData.id);

      this.procurementApiService.updatePurchaseReturnList(params, this.createData).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.backtolist()
      },
        (error) => {
          this.isAddMRProcurementCalled = false;
        });

    }
  }

  backtolist() {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase-return')
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
