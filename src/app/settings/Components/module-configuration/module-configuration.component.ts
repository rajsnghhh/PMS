import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-module-configuration',
  templateUrl: './module-configuration.component.html',
  styleUrls: [
    './module-configuration.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  
  ]
})
export class ModuleConfigurationComponent implements OnInit {
 
  pageSize:any=10;
  page:any=1;
  paginationValue:any;
  ModuleList:any=[];
  localStorageData:any;

  constructor(
    private datasharedservice:DataSharedService,
    private paginationservice:PaginationService,
    public router: Router,
    private apiservice:APIService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    if(this.datasharedservice.getLocalData('focusON')) {
      this.datasharedservice.removeLocalData('focusON')
    }
    this.getModuleData();
  }

  getModuleData(){
    let params = new URLSearchParams();
    params.set('shown', 'true')
    this.apiservice.getMenuList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.ModuleList = data.results;
    })
  }
  getPaginate(){
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize=this.paginationValue.pagesizeValue;
    this.page=this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)
    this.apiservice.getMenuList(params).subscribe(data => {
      this.ModuleList = data.results;
    });
  }

  editModuleid(id:string, moduleName:any) {
    this.datasharedservice.saveLocalData('ModelFormId',id.toString())
    this.datasharedservice.saveLocalData('ModelName',moduleName)
    this.router.navigate(['/pms/settings/module-configuration/edit']);
  }

  deleteModule(id:any) {

  }

  deleteAlertModule() {

  }


}
