import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { AccessPermissionService } from 'src/app/Shared/Services/access-permission.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  styleUrls: ['./store-dashboard.component.scss']
})
export class StoreDashboardComponent {
  constructor(
    private accessPermissionService : AccessPermissionService,
    private datasharedservice: DataSharedService,
    private router : Router,
    private apiservice:APIService,
    private commonfncservice:CommonFunctionService,
    private procurementapiservice : PROCUREMENTAPIService
  ) {}

  localStorageData:any
  rejectedTransaction:any;
  materialMasterlist:any;
  materialId:any
  commentList:any;

  inventoryData:any={
    stockCompany:0,
    stockSite:0
  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getToDoList()
    this.getMaterialmasterList()
    this.getTransaction()
    this.getCommentList()
  }


  toDoList :any = []
  objectKeys = Object.keys;
  getToDoList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('types', 'mr-items,indent-items,po,grn');
    params.set('project', this.localStorageData.project_data.id);
    params.set('site', this.localStorageData.site_data.id);
    params.set('current_financialyear', this.localStorageData.financial_year[0].id);

    this.procurementapiservice.toDoList(params).subscribe(data => {
      this.toDoList = data
    });
  }

   getCommentList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.localStorageData.project_data.id);
    params.set('site', this.localStorageData.site_data.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    this.apiservice.getComments(params).subscribe(data => {
      this.commentList=data.results;
    })
  }

  getMaterialmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.materialMasterlist = data.results
    })
  }

  changeMaterial(){
    if(this.materialId){
      let req = new URLSearchParams();
      req.set('organization_id', this.localStorageData.organisation_details[0].id);
      req.set('site', this.localStorageData.site_data.id)
      req.set('material', this.materialId);
  
      this.procurementapiservice.getProcurementInventoryDetails(req).subscribe(data => {
        this.inventoryData.stockSite=this.quantityCount(data.results);   
        
        let params = new URLSearchParams();
        params.set('organization_id', this.localStorageData.organisation_details[0].id);
        params.set('site__project', this.localStorageData.project_data.id)
        params.set('material', this.materialId);
    
        this.procurementapiservice.getProcurementInventoryDetails(params).subscribe(value => {
          this.inventoryData.stockCompany=this.quantityCount(value.results);      
        })
      })
    }else{
      this.inventoryData.stockSite=0;   
      this.inventoryData.stockCompany=0;
    }
    

  }

  quantityCount(Value:any){
    let qty=0;
    for(let data of Value){
       qty=qty+ Number(data.quantity)
    }
    return qty
  }

  todoRedirection(menu:any,yearId:any,status:any){
    let redirectDetails:any ={
      financialyear:yearId,
      statusSearch:status
    }

    if(menu=='mr-items'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/mr/?'+this.commonfncservice.getURL(redirectDetails), '_blank')});
    }else if(menu=='indent-items'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/indent/?'+this.commonfncservice.getURL(redirectDetails), '_blank')});
    }else if(menu=='po'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/purchase-order/?'+this.commonfncservice.getURL(redirectDetails), '_blank')});
    }else if(menu=='grn'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/grn/?'+this.commonfncservice.getURL(redirectDetails), '_blank')});
    }else if(menu=='purchase'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/purchase/?'+this.commonfncservice.getURL(redirectDetails), '_blank')});
    }
    
  }

  getTransaction() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('types', 'mr,indent,quotation,po,grn,purchase');
    params.set('status', 'rejected');
    params.set('project', this.localStorageData.project_data.id);
    params.set('site', this.localStorageData.site_data.id);
    params.set('financialyear', this.localStorageData.financial_year[0].id);
    
    this.procurementapiservice.transactionList(params).subscribe(data => {
      this.rejectedTransaction=data;
    });
  }

  
  printData(id:any,menu:any){
    if(menu=='mr'){
      this.router.navigateByUrl('/pms/purchase/procurement/mr/print/'+id);
    }else if(menu=='indent'){
      this.router.navigateByUrl('/pms/purchase/procurement/indent/request/print/'+id);
    }else if(menu=='po'){
      this.router.navigateByUrl('/pms/purchase/procurement/purchase-order/print/'+id);
    }else if(menu=='grn'){
      this.router.navigateByUrl('/pms/purchase/procurement/grn/print/'+id);
    }
  }

  showList(menu:any){
    if(menu=='mr'){
      this.router.navigateByUrl('/pms/purchase/procurement/mr');
    }else if(menu=='indent'){
      this.router.navigateByUrl('/pms/purchase/procurement/indent');
    }else if(menu=='po'){
      this.router.navigateByUrl('/pms/purchase/procurement/purchase-order');
    }else if(menu=='grn'){
      this.router.navigateByUrl('/pms/purchase/procurement/grn');
    }else if(menu=='purchase'){
      this.router.navigateByUrl('/pms/purchase/procurement/purchase');
    }
  }



  purchaseMemu = [

      {
        name: 'Material Requisition',
        slug: '/pms/store/procurement/mr',
        permission: 'Store-Material Requisition(MR)',
        icon: 'assets/icons/IndentList.png'
      },
      {
        name: 'Indent Request',
        slug: '/pms/store/procurement/indent',
        permission: 'Store-Indent',
        icon: 'assets/icons/IndentList.png'
      },
      {
        name: 'Item Opening',
        slug: '/pms/store/item-opening',
        permission: 'Store-Item Opening',
        icon: 'assets/icons/enquiryList.png'
      },
      {
        name: 'Physical Stock',
        slug: '/pms/store/physical-stock-list',
        permission: 'Store-Physical Stock',
        icon: 'assets/icons/Group.png'
      },
      {
        name: 'Purchase Order',
        slug: '/pms/store/procurement/purchase-order',
        permission: 'Store-Purchase Order',
        icon: 'assets/icons/purchaselist.png'
      },
      {
        name: 'GRN/Party GRN',
        slug: '/pms/store/procurement/grn',
        permission: 'Store-GRN',
        icon: 'assets/icons/quotationlist.png'
      },
    
      {
        name: 'Purchase',
        slug: '/pms/store/procurement/purchase',
        permission: 'Store-Purchase',
        icon: 'assets/icons/clarity_list-line.png'
      },
      {
        name: 'Material Issue',
        slug: '/pms/store/procurement/material-issue',
        permission: 'Store-Material Issue',
        icon: 'assets/icons/clarity_list-line.png'
      },
      {
        name: 'Material Wastage',
        slug: '/pms/store/material-wastage',
        permission: 'Store-Material Wastage',
        icon: 'assets/icons/stockreg.png'
      },
      {
        name: 'Work Indent',
        slug: '/pms/store/procurement/work-indent',
        permission: 'Store-Work Indent',
        icon: 'assets/icons/custompo.png'
      },
    
      {
        name: 'Fabrication Work',
        slug: '/pms/store/procurement/fabrication-work/list',
        permission: 'Store-Fabrication Work',
        icon: 'assets/icons/custompo.png'
      },
    
      {
        name: 'Party Bill Receive',
        slug: '/pms/store/procurement/party-bill-receive',
        permission: 'Store-Party Bill Receive',
        icon: 'assets/icons/clarity_list-line.png'
      }
    
  ]

  permissionData: any = {}
  storeDashboard=['mr','grn']
  printScope=['mr','indent','grn','po']
  showTransactionList=['mr','indent','grn','po','purchase']

  getPermissionchild(moduleName: string, actionName : string) {
    
    let scope = moduleName in this.permissionData
    if (!scope) {
      this.permissionData[moduleName] = this.accessPermissionService.getModulePermissions(moduleName)
    }
    if(actionName == '') {
      return this.permissionData[moduleName].level_permission
    }
  }

  routeTransfer(route: any) {
    if (route) {
      this.router.navigateByUrl(route).then(() => {
        window.location.reload();
      });
    }
  }
}
