import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-multi-stage',
  templateUrl: './multi-stage.component.html',
  styleUrls: [
    './multi-stage.component.scss',
    '../../../../assets/scss/from-coomon.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class MultiStageComponent {
  lockList : any = []

  disableFrom = false


  siteList:any = [] 
  localStorageData :any

  effectefForm:any = false

  form:any = {
    from_name : '',
    site_ids : [],
    stages : []
  }

  departmentList : any = []
  userList : any = []

  addnewstage() {
    this.form.stages.push({
      organization : this.localStorageData.organisation_details[0].id,
      department_ids : [],
      employee_ids : []
    })
  }

  // getProcurementMultistage

  constructor(
    private datasharedservice : DataSharedService,
    private apiservice : APIService,
    private pricurementApiservice : PROCUREMENTAPIService,
    private toastrService : ToastrService
  ) {}

  ngOnInit() {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getSiteList()
    this.getFinalcialLockData()
    this.getDepartmentList()
    this.getUserList()
  }


  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }

  getDepartmentList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getDepartmentList(params).subscribe(data => {
      this.departmentList = data.results;
    })
  }
  onSubmit() {

    for(let i=0;i<this.form.stages.length;i++) {
      this.form.stages[i]["stage_name"] = 'Stage ' + i+1
      this.form.stages[i]["stage"] = i+1
    }

    this.form.organization =  this.localStorageData.organisation_details[0].id

    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);

    if(this.form.id) {
      params.set('id', this.form.id);
      params.set('method', 'edit');
      this.pricurementApiservice.updateMultistage(params,this.form).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessUpdate, '', {
          timeOut: 2000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      })

    }else {
      delete this.form["id"]
      this.pricurementApiservice.addMultistage(params,this.form).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessAdd, '', {
          timeOut: 2000,
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      })
    }

  }

  editItem (item:any) {

    // this.form.year = item.year
    // this.form.sites = []
    // this.form.sites.push(item.site)
    // for(let i=0;i<this.effectedList.length;i++) {
    //   this.effectedList[i].value = item[this.effectedList[i].sluck]
    // }


  }


  deleteItem(index:any) {
    let temp2 = []
    for(let i=0;i<this.form.stages.length;i++) {
      if(i != index){
        temp2.push(this.form.stages[i])
      }
    }
    this.form.stages = temp2;
  }

  onclickFilter() {
    if(this.form.from_name) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('all', 'true');
      params.set('from_name', this.form.from_name)
      this.pricurementApiservice.getProcurementMultistage(params).subscribe(data => {
        if(data.results.length > 0) {
          this.form = data.results[0]
          this.form.site_ids = this.getarray(this.form.site)
          for(let i=0;i<this.form.stages.length;i++) {
            this.form.stages[i].department_ids = this.getarray(this.form.stages[i].department)
            this.form.stages[i].employee_ids = this.getarray(this.form.stages[i].employee)
          }
        } else {
          this.form.stages = []
          this.form.site_ids = []
          this.form.id = ''
        }
      })
    }

  }

  getarray(data:any) {
    let res = []
    for(let i=0;i<data.length;i++) {
      res.push(data[i].id)
    }
    return res
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
    // let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // params.set('all', 'true');
    // this.pricurementApiservice.getProcurementMultistage(params).subscribe(data => {
    //   this.lockList = data.results;
    // })
  }
}
