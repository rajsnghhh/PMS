import { Component, ViewChild } from '@angular/core';
import { GrnTopCardComponent } from '../grn-top-card/grn-top-card.component';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { GrnTableDataComponent } from '../grn-table-data/grn-table-data.component';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { GrnGstItemTableComponent } from '../grn-gst-item-table/grn-gst-item-table.component';
import { GrnItemTableComponent } from '../grn-item-table/grn-item-table.component';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss']
})
export class GrnComponent {
  localStorageData: any;
  scope = ''
  prefieldData: any = {
    grn_items : []
  };
  purchaseOrderId: any = '';
  indentId: any = '';
  materialRequisitionId: any;
  isGRN_Approver = false
  isGRN_Checker=false
  poListIds: any;
  selectedPODetails: any = [];
  selectedIndentDetails: any = [];
  reload = false
  gstScope = true


  @ViewChild(GrnTopCardComponent) GrnTopCardComponent: any;
  @ViewChild(GrnTableDataComponent) GrnTableDataComponent: any;
  @ViewChild(GrnItemTableComponent) GrnWithOutGST: any;
  @ViewChild(GrnGstItemTableComponent) GrnWithGST: any;

  constructor(
    private datasharedservice: DataSharedService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private apiservice: APIService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserDetails();

    this.activatedRoute.paramMap.subscribe(params => {
      this.purchaseOrderId = params.get('poId');
      this.indentId = params.get('indentId');
      this.materialRequisitionId = params.get('mrId');
    });

    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if (this.router.url.indexOf('/procurement/grn/modify') > -1) {
      this.scope = 'update'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/grn/view') > -1) {
      this.scope = 'view'
      this.getPrefieldData()
    } else if (this.router.url.indexOf('/procurement/grn/print') > -1) {
      this.scope = 'print'
      this.getPrefieldData()
    } else {
      this.scope = 'add'

      if (this.purchaseOrderId) {
        // through PO ======
        this.initPoListData()
      } else if (this.indentId) {
        // through indent ======
        this.initIndentListData()
      }
    }

    if (this.router.url.indexOf('/procurement/grn/create-gst') > -1 || this.router.url.indexOf('/procurement/grn/create/indent-gst/') > -1) {
      this.gstScope = true
    } else {
      this.gstScope = false
    }

  }

  initPoListData() {
    if (this.purchaseOrderId != undefined) {
      let params = new URLSearchParams();
      params.set('id', this.purchaseOrderId);
      params.set('organization_id', this.localStorageData.organisation_details[0].id);

      this.procurementApiService.getQuotationList(params).subscribe(data => {
        let res = data
        if(res.tax_type == 'vat') {
          this.gstScope = false
        } else {
          this.gstScope = true
        }
        for (let i = 0; i < data.items.length; i++) {
          data.items[i].purchase_order_item = data.items[i].id
          data.items[i].po_pending_quantity = data.items[i].quantity
          data.items[i].received_quantity = data.items[i].quantity
          
          delete data.items[i].notes
          delete data.items[i].id
          delete data.items[i].created_by
          delete data.items[i].updated_at
          delete data.items[i].updated_by
        }
        data.purchase_order = this.purchaseOrderId
        this.selectedPODetails = data
        this.selectedPODetails.isFromPO = true
        for (let i = 0; i < this.selectedPODetails.po_expense?.length; i++) {
          delete this.selectedPODetails.po_expense[i].id
          delete this.selectedPODetails.po_expense[i].created_by
          delete this.selectedPODetails.po_expense[i].updated_at
          delete this.selectedPODetails.po_expense[i].updated_by
        }

        for (let i = 0; i < this.selectedPODetails.po_tax.length; i++) {
          delete this.selectedPODetails.po_tax[i].id
          delete this.selectedPODetails.po_tax[i].created_by
          delete this.selectedPODetails.po_tax[i].updated_at
          delete this.selectedPODetails.po_tax[i].updated_by
        }

        if(this.selectedPODetails.gst_as_billing_state) {
          this.datasharedservice.setDestinyState(this.selectedPODetails.billing_state)
        } else {
          this.datasharedservice.setDestinyState(this.selectedPODetails.delivery_state)
        }
        this.datasharedservice.setSourceState(this.selectedPODetails.vendor_state)
        
        this.prefieldData.grn_items = this.selectedPODetails.items
        this.prefieldData.grn_expense = this.selectedPODetails.po_expense
        this.prefieldData.grn_tax = this.selectedPODetails.po_tax
        
        this.reload = !this.reload
      });
    }
  }

  initIndentListData() {
    if (this.indentId != undefined) {

      let params = new URLSearchParams();
      params.set('id__in', this.indentId);
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('type', 'indent-items');
      params.set('all', 'true');
      this.procurementApiService.getprocurementFilterList(params).subscribe(data => {
        this.selectedIndentDetails = data
        this.prefieldData.grn_items = data.results;
        this.prefieldData.grn_items.forEach((obj:any) => 
          obj.quantity=obj.sanctioned_quantity
        )
        this.prefieldData.grn_items.forEach((obj:any) => 
          obj.material_details.material_type_id = obj.material_details.material_type
        )
        this.prefieldData.grn_items.forEach((obj:any) => 
          obj.material_details = [obj.material_details]
        )

        this.prefieldData.grn_items.forEach((obj:any) => 
          obj.item = obj.requested_material
        )

        this.prefieldData.grn_items.forEach((obj:any) => 
          delete obj.status,
        )
        this.prefieldData.grn_items.forEach((obj:any) => 
          delete obj.created_by,
        )
        this.prefieldData.grn_items.forEach((obj:any) => 
          delete obj.updated_at,
        )
        this.prefieldData.grn_items.forEach((obj:any) => 
          delete obj.updated_by,
        )
        
        this.selectedIndentDetails.isFromIndent = true
        this.reload = !this.reload
      });
    }
  }

  createData: any = {}
  private isGrnAddCalled = false;

  getPrefieldData() {
    let params = new URLSearchParams();
    let grnId = JSON.parse(this.activatedRoute.snapshot.paramMap.get('grnId') || '{}')
    this.prefieldData.id = grnId;
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', grnId);

    this.procurementApiService.getGRNDetails(params).subscribe(data => {
      this.datasharedservice.setDirectIGSTScope(data.is_igst)
      this.prefieldData = data;
      if(this.prefieldData.tax_type == "vat") {
        this.gstScope = false
      } else {
        this.gstScope = true
      }
    });

  }


  getUserDetails() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
      const rolesArray = data?.results[0]?.user_permissions

      if (rolesArray.includes('procurement-grn-approver')) {
        this.isGRN_Approver = true;
      }

      if (rolesArray.includes('procurement-grn-checker')) {
        this.isGRN_Checker = true;
      }

    })

  }


  appendData(req: any) {
    req = JSON.parse(req)
    this.createData = { ...this.createData, ...req };

    if (
      this.createData.grn_top_Valid &&
      this.createData.grn_table_data &&
      !this.isGrnAddCalled
    ) {
      this.createData.organization = this.localStorageData.organisation_details[0].id;
      this.isGrnAddCalled = true;
      this.addGRN();
    }
  }


  addGRN() {
    if (this.purchaseOrderId) {
      this.createData.purchase_order = this.purchaseOrderId;
    }
    if (this.indentId) {
      this.createData.indent = this.selectedIndentDetails.results[0].indent;
    }
    if (this.materialRequisitionId) {
      this.createData.material_request = this.materialRequisitionId;
    }

    if (this.scope == 'add') {
      
      this.createData.financialyear = this.localStorageData.financial_year[0].id
      if(this.gstScope) {
        this.createData.tax_type = 'gst'
      } else {
        this.createData.tax_type = 'vat'
      }
      
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      this.createData.financialyear = this.localStorageData.financial_year[0].id

      this.procurementApiService.addGRN(this.createData).subscribe(
        (data) => {
          this.toastrService.success(Success_Messages.SuccessAdd, '', { timeOut: 2000 });
          this.backtolist();
        },
        (error) => {
          this.isGrnAddCalled = false;
        }
      );
    } else
      if (this.scope == 'update') {
        let params = new URLSearchParams();
        params.set('organization_id', this.localStorageData.organisation_details[0].id);
        params.set('method', 'edit');
        params.set('id', this.prefieldData?.id);

        if(this.prefieldData.financialyear){
          this.createData.financialyear = this.prefieldData.financialyear;
        }else{
          this.createData.financialyear = this.localStorageData.financial_year[0].id
        }

        this.procurementApiService.editGRN(this.createData, params).subscribe(data => {
          this.toastrService.success(Success_Messages.SuccessUpdate, '', {
            timeOut: 2000,
          });
          this.backtolist();
        },
          (error) => {
            this.isGrnAddCalled = false;
          });

      }

  }





  createGRN() {
    this.GrnTopCardComponent.save()
    // this.GrnTableDataComponent.save()
    if(this.gstScope) {
      this.GrnWithGST.save()
    } else {
      this.GrnWithOutGST.save()
    }
  }

  backtolist() {
    this.RouteToRoll('/pms/' + this.activatedRoute.snapshot.paramMap.get('procurementScope') + '/procurement/grn')
  }

  updateGRN() {
    this.GrnTopCardComponent.save()
    // this.GrnTableDataComponent.save()
    if(this.gstScope) {
      this.GrnWithGST.save()
    } else {
      this.GrnWithOutGST.save()
    }
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

}
