import { Component, ViewChild } from '@angular/core';
import { PoTopCardComponent } from '../po-top-card/po-top-card.component';
import { PoTableDataComponent } from '../po-table-data/po-table-data.component';
import { PoTaxTermsPaymentComponent } from '../po-tax-terms-payment/po-tax-terms-payment.component';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { ToastrService } from 'ngx-toastr';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent {
  localStorageData: any;

  @ViewChild(PoTopCardComponent) PoTopCardComponent: any;
  @ViewChild(PoTableDataComponent) PoTableDataComponent: any;
  @ViewChild(PoTaxTermsPaymentComponent) PoTaxTermsPaymentComponent: any;

  indentListIds: any;
  prefieldData :any = {}
  reload = false

  scope = ''
  disableEdit = false
  draftScope = true

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

    if (this.router.url.indexOf('/purchase-order/create-through-indent/') > -1) {
      this.getIndentData()
    }

    if (this.router.url.indexOf('/purchase-order/create-through-quotation/') > -1) {
      this.getQuotationData()
    }

    if (
      (this.router.url.indexOf('/purchase-order/create-through-quotation/') > -1) || 
      (this.router.url.indexOf('/purchase-order/create-through-indent/') > -1) || 
      (this.router.url.indexOf('/purchase-order/create') > -1) ||
      (this.router.url.indexOf('/purchase-order/amend/') > -1)
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

    if(this.scope == 'update' || this.scope == 'view' ||  (this.router.url.indexOf('/purchase-order/amend/') > -1) ) {
      this.getPrefieldData()
    }

    this.reload = !this.reload

  }

  actionButton(draftScope:boolean) {
    this.draftScope = draftScope
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
          temp[i].part_no = temp[i].size_part_grade
          temp[i].indent_item = temp[i].id
          delete temp[i].id
        }
        // indent_item
        this.prefieldData.items = temp        
        this.reload = !this.reload
      });
    }
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
      if(this.router.url.indexOf('/purchase-order/amend/') > -1){
        temp.attachments = []
      }
      this.prefieldData = temp
      this.reload = !this.reload
    })
  }



  getQuotationData() {
    

    let quotationID = this.activeroute.snapshot.paramMap.get('quotationID') || ''
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', quotationID);
    this.procurementApiService.getProcurementQuotationDetails(params).subscribe(data => {
      let temp:any = data
      temp.quotation = temp.id
      delete temp.id

      for(let i=0;i<temp.quotation_items.length;i++) {
        temp.quotation_items[i].quotation_item = temp.quotation_items[i].id
        delete temp.quotation_items[i].id
      }

      temp.items = temp.quotation_items
      temp.quotation_text = temp.request_code
      temp.quotation_date = temp.date
      temp.quotation_by_text = temp.vendor_details.vendor_name
      delete temp.quotation_items

      this.prefieldData = temp
      
    })
  }
  
  

  createData: any = {}
  private isAddPurchaseOrderCalled = false;


  appendData(req: any) {
    req = JSON.parse(req)
    
    this.createData = { ...this.createData, ...req };        

    if (
      this.createData.po_top_Valid &&
      this.createData.po_table_data &&
      this.createData.po_tax_terms_payment_Valid &&
      !this.isAddPurchaseOrderCalled
    ) {
      this.createData.organization = this.localStorageData.organisation_details[0].id;
      this.isAddPurchaseOrderCalled = true;
      this.addPurchaseOrder();
    }
  }


  addPurchaseOrder() {

    this.createData.attachments = this.createData.attachments.filter((items: { id: any; }) => !items.id)
    
    for(let i=0;i<this.createData.items.length;i++) {
      delete this.createData.items[i].id
      if(!this.createData.items[i].tolerance_percentage) {
        delete this.createData.items[i].tolerance_percentage
      }
    }

    if (this.scope == 'create') {
    // let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    if(this.router.url.indexOf('/purchase-order/amend/') > -1) {
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
    this.createData.tax_type = 'vat'
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
    this.PoTaxTermsPaymentComponent.save()
    this.PoTopCardComponent.save()
    this.PoTableDataComponent.save()

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
