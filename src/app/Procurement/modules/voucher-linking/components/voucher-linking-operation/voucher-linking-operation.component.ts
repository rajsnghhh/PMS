import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-voucher-linking-operation',
  templateUrl: './voucher-linking-operation.component.html',
  styleUrls: [
    './voucher-linking-operation.component.scss',
    '../../../../../../assets/scss/from-coomon.scss',
    '../../../../../../assets/scss/micro-view-table.scss',
    '../../../../../../assets/scss/scrollableTable.scss',
  ]
})
export class VoucherLinkingOperationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private datasharedservice : DataSharedService,
    private apiservice: APIService,
    private procurementAPIService : PROCUREMENTAPIService,
    private toastrService : ToastrService
  ) {}

  linkSource:any = ''  // mr,grn
  linkTO:any = ''      // indent,po
  linkFromList : any = []
  linktoList:any = []
  linkScopeList:any = []
  localStorageData:any

  scopeList = ['mr','indent','quotation','po','grn','issue','purchase']
  backendList = ['material_request_item','indent_item','quotation_item','purchase_order_item','grn_item','issue_item','purchase_item']

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.linkSource = this.route.snapshot.paramMap.get('linksource')
    this.linkTO = this.route.snapshot.paramMap.get('linkto')
    this.linkScopeList.push(this.linkSource)
    this.linkScopeList.push(this.linkTO)
    this.getListsourceData()
    this.linktoData()
  }

  getListsourceData() {
    let s1 = this.backendList[this.scopeList.indexOf(this.linkSource)]
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params.set('form_type', s1)
    if(s1 === 'material_request_item'){
      params.set('material_request__project', this.localStorageData?.project_data?.id)
      params.set('material_request__site', this.localStorageData?.site_data?.id)
      params.set('material_request__financialyear', this.localStorageData.financial_year[0].id);
    }
    if(s1 === 'indent_item'){
      params.set('indent__project', this.localStorageData?.project_data?.id)
      params.set('indent__site', this.localStorageData?.site_data?.id)
      params.set('indent__financialyear', this.localStorageData.financial_year[0].id);
    }
    if(s1 ==='purchase_order_item'){
      params.set('purchase_order__project', this.localStorageData?.project_data?.id)
      params.set('purchase_order__site', this.localStorageData?.site_data?.id)
      params.set('purchase_order__financialyear', this.localStorageData.financial_year[0].id);
    }
    if(s1 ==='grn_item'){
      params.set('grn__project', this.localStorageData?.project_data?.id)
      params.set('grn__site', this.localStorageData?.site_data?.id)
      params.set('grn__financialyear', this.localStorageData.financial_year[0].id);
    }
    this.procurementAPIService.getLinkData(params).subscribe(data => {
      this.linkFromList = data.results.Data
    })


    let s2 = this.backendList[this.scopeList.indexOf(this.linkTO)]
    let params1 = new URLSearchParams();
    params1.set('organization_id', this.localStorageData?.organisation_details[0].id);
    params1.set('form_type', s2)
    if(s2 === 'indent_item'){
      params1.set('indent__project', this.localStorageData?.project_data?.id)
      params1.set('indent__site', this.localStorageData?.site_data?.id)
      params1.set('indent__financialyear', this.localStorageData.financial_year[0].id);
    }
    if(s2 ==='purchase_order_item'){
      params1.set('purchase_order__project', this.localStorageData?.project_data?.id)
      params1.set('purchase_order__site', this.localStorageData?.site_data?.id)
      params1.set('purchase_order__financialyear', this.localStorageData.financial_year[0].id);
    }
    if(s2 ==='grn_item'){
      params1.set('grn__project', this.localStorageData?.project_data?.id)
      params1.set('grn__site', this.localStorageData?.site_data?.id)
      params1.set('grn__financialyear', this.localStorageData.financial_year[0].id);
    }
    if(s2 ==='purchase_item'){
      params1.set('purchase__project', this.localStorageData?.project_data?.id)
      params1.set('purchase__site', this.localStorageData?.site_data?.id)
      params1.set('purchase__financialyear', this.localStorageData.financial_year[0].id);
    }

    this.procurementAPIService.getLinkData(params1).subscribe(data => {
      this.linktoList = data.results.Data

      for(let i=0;i<this.linktoList.length;i++) {
        if(this.linkSource =='indent' && this.linkTO == 'grn') {
          this.linktoList[i].linkedID = this.linktoList[i].indent_item
        }
        else if(this.linkSource =='po' && this.linkTO == 'grn') {
          this.linktoList[i].linkedID = this.linktoList[i].purchase_order_item
        }

        else if(this.linkSource =='mr' && this.linkTO == 'issue') {
          this.linktoList[i].linkedID = this.linktoList[i].material_request_item
        }

        else if(this.linkSource =='mr' && this.linkTO == 'indent') {
          this.linktoList[i].linkedID = this.linktoList[i].material_request_item
        }

        else if(this.linkSource =='indent' && this.linkTO == 'po') {
          this.linktoList[i].linkedID = this.linktoList[i].indent_item
        }

        else if(this.linkSource =='grn' && this.linkTO == 'purchase') {
          this.linktoList[i].linkedID = this.linktoList[i].grn_item
        }

        else if(this.linkSource =='po' && this.linkTO == 'purchase') {
          this.linktoList[i].linkedID = this.linktoList[i].purchase_order_item
        }

        else {
          this.toastrService.error('OOPS something went wrong !', '', {
            timeOut: 2000,
          });
        }
        
      }
    })

  }

  linktoData() {

  }



  updateLink() {
    let req = []
    // material_request_item
    // indent_item
    // quotation_item
    // purchase_order_item
    // grn_item
    // issue_item

    let linkForn = this.backendList[this.scopeList.indexOf(this.linkSource)]
    let linkTo = this.backendList[this.scopeList.indexOf(this.linkTO)]


    for(let i=0;i<this.linktoList.length;i++) {
      if(this.linktoList[i].linkedID) {
        req.push({
          "from_type": linkForn,
          "from_id": parseInt(this.linktoList[i].linkedID),
          "to_type": linkTo,
          "to_id": parseInt(this.linktoList[i].id)
        })
      }
    }
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0].id);
    
    this.procurementAPIService.linkProcurement(params,req).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      window.location.reload()
    })
    
  }


}
