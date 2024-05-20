import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationTopCardComponent } from '../quotation-top-card/quotation-top-card.component';
import { QuotationTableComponent } from '../quotation-table/quotation-table.component';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { ToastrService } from 'ngx-toastr';
import { QuotationGstTableComponent } from '../quotation-gst-table/quotation-gst-table.component';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit {
  scope = 'add'
  gstScope = false
  localStorageData: any;
  reload = false
  isPurchase_Approver = false // No required in Quotation

  urlSegment: any = '';
  urlIds: any;
  private isQuotationIndentCalled = false;
  prefieldData: any = {};
  quotationId: any;

  @ViewChild(QuotationTopCardComponent) QuotationTopCardComponent: any;
  @ViewChild(QuotationTableComponent) QuotationTableComponent: any;
  @ViewChild(QuotationGstTableComponent) QuotationGstTableComponent: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private datasharedservice: DataSharedService,
    private procurementApiService: PROCUREMENTAPIService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(
      this.datasharedservice.getLocalData('userDATA')
    );

    if(this.router.url.indexOf('/procurement-quotation/gst/') > -1){
      this.gstScope = true
    }

    this.activatedRoute.url.subscribe((urlSegments) => {
      // filter Tax table content based on this ========
      this.urlSegment = urlSegments[0].path;
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.quotationId = params.get('quotationId');
    });
    if (!this.quotationId) {
      // Get all route parameters
      this.activatedRoute.paramMap.subscribe((params) => {
        // Iterate through all parameters
        params.keys.forEach((key) => {
          const encodedString = params.get(key);
          if (encodedString) {
            // Decode the string
            const decodedString = atob(encodedString);
            try {
              const decodedObject = JSON.parse(decodedString);
              this.urlIds = decodedObject;
            } catch (error) {}
          }
        });
      });
    }
    this.viewIndentQuotation();
  }

  viewIndentQuotation() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    // earlier ========================
    if (this.quotationId) {
      params.set('id', this.quotationId);
    } else if (this.urlIds) {
      if (this.urlIds.indent_id) {
        params.set('indent', this.urlIds?.indent_id);
      }
      // earlier ========================
      // these two are now being considered ================
      params.set('rfq_vendor', this.urlIds?.enquiry_id);
      
      this.prefieldData.rfq_vendor = this.urlIds?.enquiry_id
      params.set('vendor', this.urlIds?.vendor_id);
      this.prefieldData.vendor = this.urlIds?.vendor_id
      // with or without GST decider ===================
      params.set('tax_type', this.urlSegment == 'tax' ? 'vat' : 'gst');
      // these two are now being considered ================
    }

    this.procurementApiService
      .getIndentQuotation(params)
      .subscribe((res: any) => {

        if(this.quotationId) {
          this.prefieldData = res
          this.scope = 'update'
          if(this.prefieldData.tax_type == 'gst') {
            this.gstScope = true
            this.reload = !this.reload
          }
        } else if(res.results.length > 0) {
            this.prefieldData = res.results[0]
            this.scope = 'view'
            this.reload = !this.reload
        } else {
          this.getEnquiryData(this.urlIds?.enquiry_id)
        }
      });
  }

  getEnquiryData(id:any) {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('id', id);

    this.procurementApiService.getRfqVendors(params).subscribe((data) => {

      this.prefieldData.project=data.project;

      if(data.vendor_state){
        this.prefieldData.vendor_state=data.vendor_state
      }else{
        this.prefieldData.vendor_state=this.vendorStateSelect(data.vendor_details,this.urlIds.vendor_id)
      }
      this.prefieldData.gst_number=this.vendorGSTSelect(data.vendor_details,this.urlIds.vendor_id)
      
      this.prefieldData.site=data.site;
      this.prefieldData.store=data.store;

      this.createData.indent=data.indent;
      this.createData.rfq_vendor=data.id;
      this.createData.material_request=data.material_request;

      for (let i = 0; i < data.items.length; i++) {
        delete data.items[i].notes
        delete data.items[i].id
        delete data.items[i].created_by
        delete data.items[i].updated_at
        delete data.items[i].updated_by
        data.items[i].size_part_number=data.items[i].size_part_grade
      }
      this.prefieldData.quotation_items = data.items
      this.reload = !this.reload
    });
  }

  vendorStateSelect(vendorArray:any,vendorId:any){

    let vendorState =''
    if(vendorArray){
      for(let k=0;k<vendorArray.length;k++){
        if(vendorArray[k].vendor_id==vendorId){
           vendorState=vendorArray[k].state? vendorArray[k].state : ''
        }
     }
    }
    return vendorState;
  }

  vendorGSTSelect(vendorArray:any,vendorId:any){

    let gstNo =''
    if(vendorArray){
    for(let k=0;k<vendorArray.length;k++){
       if(vendorArray[k].vendor_id==vendorId){
        gstNo=vendorArray[k].gst_number? vendorArray[k].gst_number : ''
       }
    }
    }
    return gstNo;
  }

  addQuotation() {
    this.QuotationTopCardComponent.save();
    if(this.gstScope) {
      this.QuotationGstTableComponent.save();
    } else {
      this.QuotationTableComponent.save();
    }
  }

  createData: any = {};

  appendData(req: any) {
    req = JSON.parse(req);
    this.createData = { ...this.createData, ...req };

    this.createData?.quotation_items?.forEach((x: any) => {
      x.organization = this.localStorageData.organisation_details[0].id;
    });

    if (
      this.createData.quotation_top_Valid &&
      this.createData.quotation_table_data &&
      // this.createData.quotation_tax_valid &&
      !this.isQuotationIndentCalled
    ) {
      this.createData.organization =
        this.localStorageData.organisation_details[0].id;
      this.isQuotationIndentCalled = true;
      this.addIndentQuotation();
    }
  }

  addIndentQuotation() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );

    // if(this.urlSegment == ""){

    // }

    this.createData.tax_type = this.gstScope ? 'gst' : 'vat';
    this.createData.financialyear=this.localStorageData.financial_year[0].id;

    if(this.prefieldData.id) {

      params.set('method', 'edit');
      params.set('id', this.prefieldData.id);
      
      this.procurementApiService.editIndentQuotation(params,this.createData).subscribe(
        (data) => {
          this.toastrService.success(
            'Quotation is Updated successfully.',
            '',
            { timeOut: 2000 }
          );
  
          window.location.reload();
        },
        (error) => {
          this.isQuotationIndentCalled = false;
        }
      );

    } else {
      this.procurementApiService.addIndentQuotation(this.createData).subscribe(
        (data) => {
          this.toastrService.success(
            'Quotation is saved successfully, we will get back to you shortly.',
            '',
            { timeOut: 2000 }
          );
  
         window.location.reload();
        },
        (error) => {
          this.isQuotationIndentCalled = false;
        }
      );
    }
  }
}
