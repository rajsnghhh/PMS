import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-finalcial-year-locking',
  templateUrl: './finalcial-year-locking.component.html',
  styleUrls: [
    './finalcial-year-locking.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class FinalcialYearLockingComponent implements OnInit {

  lockList : any = []

  disableFrom = false

  monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];

  yearList = [2022,2023,2024]

  siteList:any = [] 
  localStorageData :any

  effectefForm:any = false

  form:any = {
    month : '1',
    year : 2024,
    sites : []
  }

  effectedList :any = [
    {
      lable : 'Material Requisition',
      sluck : 'mr',
      value : false,
      
    },
    {
      lable : 'Indent',
      sluck : 'indent',
      value : false,
      
    },{
      lable : 'Enquiry',
      sluck : 'enquiry',
      value : false,
      
    },{
      lable : 'Quotation',
      sluck : 'quotation',
      value : false,
      
    },{
      lable : 'Purchase Order',
      sluck : 'po',
      value : false,
      
    },{
      lable : 'GRN',
      sluck : 'grn',
      value : false,
      
    }
    // ,
    // {
    //   lable : 'purchase Bill',
    //   sluck : 'purchase_bill',
    //   value : false,
      
    // }
    ,{
      lable : 'Raw Material Sale',
      sluck : 'raw_material_sale',
      value : false,
      
    },{
      lable : 'Min Max Challan / Invoice',
      sluck : 'min_max_challan',
      value : false,
      
    },{
      lable : 'Purchase Return',
      sluck : 'purchase_return',
      value : false,
      
    },{
      lable : 'Transport Bill',
      sluck : 'transport_bill',
      value : false,
      
    },{
      lable : 'Item Opening',
      sluck : 'item_opening',
      value : false,
      
    },{
      lable : 'Physical Stock',
      sluck : 'physical_stock',
      value : false,
      
    }, {
      lable : 'Issue',
      sluck : 'issue',
      value : false,
      
    }, {
      lable : 'Material Wastage',
      sluck : 'material_wastage',
      value : false,
      
    }, {
      lable : 'Material Issue Return',
      sluck : 'material_issue_return',
      value : false,
      
    }, {
      lable : 'Fabrication Work',
      sluck : 'fabrication_work',
      value : false,
      
    }, {
      lable : 'Gate Pass',
      sluck : 'gate_pass',
      value : false,
      
    }, {
      lable : 'Item JV',
      sluck : 'item_jv',
      value : false,
      
    } 
  ]

  selectDeselectAll() {
    if(this.effectefForm) {
      for(let i=0;i<this.effectedList.length;i++) {
        this.effectedList[i].value = true
      }
    } else {
      for(let i=0;i<this.effectedList.length;i++) {
        this.effectedList[i].value = false
      }
    }
  }



  constructor(
    private datasharedservice : DataSharedService,
    private apiservice : APIService,
    private toastrService : ToastrService
  ) {}

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSiteList()
    this.getFinalcialLockData()
  }

  onSubmit() {

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    let request:any = {}

    request.organization = this.localStorageData.organisation_details[0].id
    request.month = this.form.month
    request.year = this.form.year
    request.sites = this.form.sites
    
    for(let i=0;i<this.effectedList.length;i++) {
      request[this.effectedList[i].sluck] = this.effectedList[i].value
    }

    this.apiservice.addEditFinancialYearLockDetails(params,request).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      this.getFinalcialLockData()
      for(let i=0;i<this.effectedList.length;i++) {
        this.effectedList[i].value = false
      }
    })

  }

  editItem (item:any) {

    this.form.month = item.month
    this.form.year = item.year
    this.form.sites = []
    this.form.sites.push(item.site)
    for(let i=0;i<this.effectedList.length;i++) {
      this.effectedList[i].value = item[this.effectedList[i].sluck]
    }


  }


  deleteItem(item:any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('method','delete')
    params.set('id',item.id) 
    this.apiservice.deleteFinancialYearLockDetails(params,'').subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getFinalcialLockData()

    })

  }

  onclickFilter() {
    if(this.form.month && this.form.year && this.form.sites) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('all', 'true');
      params.set('month',this.form.month)
      params.set('year', this.form.year)
      params.set('site__in', this.form.sites)
      this.apiservice.getFinancialYearLockDetails(params).subscribe(data => {
        if(data.results.length > 0) {
          this.editItem(data.results[0])
        }
      })
      
    }

  }

  getSiteList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.siteList = data.results;
    })
  }


  getFinalcialLockData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getFinancialYearLockDetails(params).subscribe(data => {
      this.lockList = data.results;
    })
  }




}
