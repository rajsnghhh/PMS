import { Component, ViewChild } from '@angular/core';
import { PoGstSecondCardComponent } from '../po-gst-second-card/po-gst-second-card.component';
import { PoGstTopCardComponent } from '../po-gst-top-card/po-gst-top-card.component';
import { PoGstThirdCardComponent } from '../po-gst-third-card/po-gst-third-card.component';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { PoTableDataComponent } from '../../po-components/po-table-data/po-table-data.component';
import { PoGstTableDataComponent } from '../po-gst-table-data/po-gst-table-data.component';

@Component({
  selector: 'app-po-gst',
  templateUrl: './po-gst.component.html',
  styleUrls: ['./po-gst.component.scss']
})
export class PoGstComponent {
  localStorageData: any;

  indentListIds: any;
  prefieldData :any = {}
  reload = false

  scope = ''
  disableEdit = false

  draftScope = true

  private isAddPurchaseOrderCalled = false;


  @ViewChild(PoGstTopCardComponent) PoGstTopCardComponent: any;
  @ViewChild(PoGstSecondCardComponent) PoGstSecondCardComponent: any;
  @ViewChild(PoGstTableDataComponent) PoGstTableDataComponent: any;
  @ViewChild(PoGstThirdCardComponent) PoGstThirdCardComponent: any;

  constructor(
    private datasharedservice: DataSharedService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private activeroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.activeroute.paramMap.subscribe(params => {
      const indentID = params.get('indentID');
      this.indentListIds = indentID ? indentID.split(':').join(',') : '';
    });

    if (this.router.url.indexOf('/purchase-order/create-through-indent/gst/') > -1) {
      this.getIndentData()
    }

    if (this.router.url.indexOf('/purchase-order/create-through-quotation/gst/') > -1) {
      this.getQuotationData()
    }
    
    if (
      (this.router.url.indexOf('/purchase-order/create-through-quotation/gst/') > -1) || 
      (this.router.url.indexOf('/purchase-order/create-through-indent/gst/') > -1) || 
      (this.router.url.indexOf('/purchase-order/create/gst') > -1) || 
      (this.router.url.indexOf('/purchase-order/amend-gst/') > -1)
    ) {
      this.scope = 'create'
    }


    if (this.router.url.indexOf('/purchase-order/view/') > -1) {
      this.scope = 'view'
      this.disableEdit = true
    } else {
      this.disableEdit = false
    }

    if (this.router.url.indexOf('/purchase-order/update/') > -1) {
      this.scope = 'update'
    }

    if(this.scope == 'update' || this.scope == 'view' || (this.router.url.indexOf('/purchase-order/amend-gst/') > -1) ) {
      this.getPrefieldData()
    }

    this.reload = !this.reload

  }


  actionButton(draftScope:boolean) {
    this.draftScope = draftScope
  }


  getPrefieldData() {
    let id:any = this.activeroute.snapshot.paramMap.get('poId')
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('id', id);
    
    this.procurementApiService.getQuotationList(params).subscribe(data => {    
      let temp = data
      for(let i=0;i<temp.items.length;i++) {
        temp.items[i].material_details = temp.items[i].material_details[0]
        temp.items[i].material_details.material_type_details = temp.items[i].material_type_details
        temp.items[i].hsn_code = temp.items[i].hsn_details[0].hsn_code
        temp.items[i].size_part_no_grade=temp.items[i].size_part_number

        delete temp.items[i].material_type_details
        delete temp.items[i].created_by
        delete temp.items[i].created_at
        delete temp.items[i].updated_at
        delete temp.items[i].updated_by
        delete temp.items[i].purchase_order
      }
      for(let i=0;i<temp.payment_schedule.length;i++) {
        delete temp.payment_schedule[i].created_by
        delete temp.payment_schedule[i].updated_at
        delete temp.payment_schedule[i].updated_by
        delete temp.payment_schedule[i].purchase_order
      }
      for(let i=0;i<temp.po_delivery_loc.length;i++) {
        delete temp.po_delivery_loc[i].created_by
        delete temp.po_delivery_loc[i].updated_at
        delete temp.po_delivery_loc[i].updated_by
        delete temp.po_delivery_loc[i].purchase_order
      }
      for(let i=0;i<temp.po_expense?.length;i++) {
        delete temp.po_expense[i].created_by
        delete temp.po_expense[i].updated_at
        delete temp.po_expense[i].updated_by
        delete temp.po_expense[i].purchase_order
        
      }
      for(let i=0;i<temp.po_tax.length;i++) {
        delete temp.po_tax[i].created_by
        delete temp.po_tax[i].updated_at
        delete temp.po_tax[i].updated_by
        delete temp.po_tax[i].purchase_order
      }
      for(let i=0;i<temp.terms_and_conditions.length;i++) {
        delete temp.terms_and_conditions[i].created_by
        delete temp.terms_and_conditions[i].updated_at
        delete temp.terms_and_conditions[i].updated_by
        delete temp.terms_and_conditions[i].purchase_order
      }
      if(this.router.url.indexOf('/purchase-order/amend-gst/') > -1){
        temp.attachments = []
      }
      this.prefieldData = temp
      this.reload = !this.reload
    })
  }

  getIndentData() {
    if(this.indentListIds != undefined) {
      let params = new URLSearchParams();
      params.set('id__in', this.indentListIds);
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('type', 'indent-items');
      params.set('all', 'true');
      this.procurementApiService.getprocurementFilterList(params).subscribe(data => {

        let temp:any = data.results
        for(let i=0;i<temp.length;i++) {

          temp[i].quantity = temp[i].sanctioned_quantity

          temp[i].indent_item = temp[i].id
          temp[i].item = temp[i].material_details.id
          temp[i].disc_percentage = 0
          temp[i].sgst_percentage = 0
          temp[i].cgst_percentage = 0
          temp[i].igst_percentage = 0
          temp[i].tax_head = temp[i].material_details.gst_tax_id
          temp[i].hsn_code = temp[i].material_details.material_hsn_code.hsn_code
          temp[i].part_no = temp[i].size_part_grade
         
          delete temp[i].id
          delete temp[i].created_by
          delete temp[i].updated_at
          delete temp[i].updated_by
        }
        // indent_item
        this.prefieldData.items = temp
        
        this.reload = !this.reload
      });
    }
  }


  getQuotationData() {

    let quotationID = this.activeroute.snapshot.paramMap.get('quotationID') || ''
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', quotationID);
    this.procurementApiService.getProcurementQuotationDetails(params).subscribe(data => {

      setTimeout(() => {
        this.createData.material_request=data.material_request;
        this.createData.indent=data.indent;
        this.createData.rfq_vendor=data.rfq_vendor;
        this.createData.quotation=data.quotation;
        }, 100)

    
      let temp:any = data
      temp.quotation = temp.id
      delete temp.id
      for(let i=0;i<temp.quotation_items.length;i++) {
        temp.quotation_items[i].quotation_item = temp.quotation_items[i].id
        temp.quotation_items[i].item = temp.quotation_items[i].material_details.id
        temp.quotation_items[i].notes = []
        delete temp.quotation_items[i].id
        delete temp.quotation_items[i].created_by
        delete temp.quotation_items[i].updated_by
        delete temp.quotation_items[i].updated_at
      }
      temp.createThrough = true
      temp.quotation_text = temp.request_code
      temp.quotation_date = temp.date
      temp.quotation_by_text = temp.vendor_details.vendor_name
      temp.items = temp.quotation_items
      delete temp.quotation_items
      this.prefieldData.po_expense=temp.quotation_expense; 

      this.prefieldData = temp
      
    })
  }

  createData: any = {}
  // private isAddPurchaseOrderCalled = false;


  appendData(req: any) {
    req = JSON.parse(req)
    this.createData = { ...this.createData, ...req, organization: this.localStorageData.organisation_details[0].id };

    if (
      this.createData.po_gst_top_Valid &&
      this.createData.po_gst_second_valid &&
      this.createData.po_tax_terms_payment_Valid &&
      this.createData.po_gst_table_data_valid &&

      !this.isAddPurchaseOrderCalled
    ) {
      this.createData.organization = this.localStorageData.organisation_details[0].id;
      this.isAddPurchaseOrderCalled = true;
      this.addPurchaseOrderGST();
    }


    // if (this.createData.po_gst_top_Valid && this.createData.po_gst_second_valid && this.createData.po_tax_terms_payment_Valid && this.createData.po_gst_table_data_valid) {
    //   this.addPurchaseOrderGST()
    // }
  }



  addPurchaseOrderGST() {


    this.createData.attachments = this.createData.attachments.filter((items: { id: any; }) => !items.id)

    if (this.scope == 'create') {
    // let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    if(this.router.url.indexOf('/purchase-order/amend-gst/') > -1) {
      this.createData.previous_version = this.prefieldData?.id
      for(let i=0;i<this.createData.items.length;i++) {
        delete this.createData.items[i].id
      }
      for(let i=0;i<this.createData.payment_schedule.length;i++) {
        delete this.createData.payment_schedule[i].id
      }
      for(let i=0;i<this.createData.po_delivery_loc.length;i++) {
        delete this.createData.po_delivery_loc[i].id
      }
      for(let i=0;i<this.createData.po_expense?.length;i++) {
        delete this.createData.po_expense[i].id
        
      }
      for(let i=0;i<this.createData.po_tax.length;i++) {
        delete this.createData.po_tax[i].id
      }
      for(let i=0;i<this.createData.terms_and_conditions.length;i++) {
        delete this.createData.terms_and_conditions[i].id
      }
    }
    
    this.createData.tax_type = 'gst'
    this.createData.financialyear = this.localStorageData.financial_year[0].id
    this.procurementApiService.addPurchaseOrder(this.createData).subscribe(
      (data) => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', { timeOut: 2000 });
        this.backtolist();
      },
      (error) => {
        this.isAddPurchaseOrderCalled = false;
      }
    );
    }

    if (this.scope == 'update') {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('method', 'edit');
      params.set('id', this.prefieldData?.id);
      this.procurementApiService.editPurchaseOrder(params, this.createData).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        this.backtolist()
      },
        (error) => {
          this.isAddPurchaseOrderCalled = false;
        });

    }


  }

  createPurchaseOrder() {
    this.PoGstTopCardComponent.save()
    this.PoGstSecondCardComponent.save()
    this.PoGstTableDataComponent.save()
    this.PoGstThirdCardComponent.save()
  }


  backtolist() {
    this.RouteToRoll('/pms/' + this.activeroute.snapshot.paramMap.get('procurementScope') + '/procurement/purchase-order')
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

}