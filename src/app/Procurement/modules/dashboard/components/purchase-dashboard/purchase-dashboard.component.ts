import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { AccessPermissionService } from 'src/app/Shared/Services/access-permission.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html',
  styleUrls: ['./purchase-dashboard.component.scss']
})
export class PurchaseDashboardComponent implements OnInit {


  constructor(
    private accessPermissionService : AccessPermissionService,
    private datasharedservice: DataSharedService,
    private router : Router,
    private apiservice:APIService,
    private procurementapiservice : PROCUREMENTAPIService,
    private commonfncservice:CommonFunctionService
  ) {}

  localStorageData:any
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
    this.getCommentList()
    this.getMaterialmasterList()
    this.getTransaction()
  }


  toDoList :any = {}
  rejectedTransaction:any={};

  objectKeys = Object.keys;
  getToDoList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('types', 'mr-items,indent-items,quotation,po,grn,purchase');
    params.set('project', this.localStorageData.project_data.id);
    params.set('site', this.localStorageData.site_data.id);
    params.set('current_financialyear', this.localStorageData.financial_year[0].id);
    
    this.procurementapiservice.toDoList(params).subscribe(data => {
      this.toDoList = data
    });
  }

  getMaterialmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.materialMasterlist = data.results
    })
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
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/mr/print/'+id, '_blank')});
    }else if(menu=='indent'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/indent/request/print/'+id, '_blank')});
    }else if(menu=='po'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/purchase-order/print/'+id, '_blank')});
    }else if(menu=='grn'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/grn/print/'+id, '_blank')});
    }
  }

  showList(menu:any){
    if(menu=='mr'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/mr', '_blank')});
    }else if(menu=='indent'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/indent', '_blank')});
    }else if(menu=='po'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/purchase-order', '_blank')});
    }else if(menu=='grn'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/grn', '_blank')});
    }else if(menu=='purchase'){
      this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+'/pms/purchase/procurement/purchase', '_blank')});
    }
  }


  purchaseMemu = [
    
    {
      name: 'Material Requisition',
      slug: '/pms/purchase/procurement/mr',
      permission: 'Material Requisition(MR)',
      icon: 'assets/icons/IndentList.png'
    },
    {
      name: 'Indent',
      slug: '/pms/purchase/procurement/indent',
      permission: 'Indent',
      icon: 'assets/icons/IndentList.png'
    },
    {
      name: 'Enquiry',
      slug: '/pms/purchase/procurement/enquiry',
      permission: 'Enquiry',
      icon: 'assets/icons/enquiryList.png'
    },
    {
      name: 'Purchase Order',
      slug: '/pms/purchase/procurement/purchase-order',
      permission: 'Purchase Order',
      icon: 'assets/icons/Group.png'
    },
    {
      name: 'Purchase',
      slug: '/pms/purchase/procurement/purchase',
      permission: 'Purchase',
      icon: 'assets/icons/purchaselist.png'
    },
    {
      name: 'GRN/Party GRN',
      slug: '/pms/purchase/procurement/grn',
      permission: 'GRN',
      icon: 'assets/icons/quotationlist.png'
    },
    {
      name: 'Work Order',
      slug: '/pms/purchase/procurement/work-order',
      permission: 'Work Order',
      icon: 'assets/icons/clarity_list-line.png'
    },
    {
      name: 'Way Bill',
      slug: '/pms/purchase/procurement/way-bill',
      permission: 'Way Bill',
      icon: 'assets/icons/clarity_list-line.png'
    },
    {
      name: 'Tax Invoice / Challan',
      slug: '/pms/purchase/procurement/tax-invoice-challan',
      permission: 'Tax Invoice / Challan By MIN',
      icon: 'assets/icons/stockreg.png'
    },
    {
      name: 'Purchase Return',
      slug: '/pms/purchase/procurement/purchase-return',
      permission: 'Purchase Return',
      icon: 'assets/icons/custompo.png'
    },
    {
      name: 'Transport Bill',
      slug: '/pms/purchase/procurement/transport-bill',
      permission: 'Transport Bill',
      icon: 'assets/icons/custompo.png'
    },
    {
      name: 'Party Bill Receive',
      slug: '/pms/purchase/procurement/party-bill-receive',
      permission: 'Party Bill Receive',
      icon: 'assets/icons/clarity_list-line.png'
    }
  ]

  permissionData: any = {}
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
