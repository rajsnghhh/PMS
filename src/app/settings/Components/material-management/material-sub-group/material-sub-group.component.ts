import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
declare var window: any;
@Component({
  selector: 'app-material-sub-group',
  templateUrl: './material-sub-group.component.html',
  styleUrls: [
    './material-sub-group.component.scss',
    '../../../../../assets/scss/scrollableTable.scss',
    '../../../../../assets/scss/from-coomon.scss'
  ]
})
export class MaterialSubGroupComponent implements OnInit {
  materialList : any = []
  localStorageData :any;
  scope = ''
  selectedId = ''
  offcanvasedit :any
  offcanvasAdd :any
  deleteModal : any
  purchaseAcntStatus:any;
  salesAcntStatus:any;
  accountNameList:any
  itemTypelist:any;

  addUser: any = {
    name: '',
    purchaseAccount: '',
    salesAccount: '',
    itemtype: '',
  }

  constructor(
    private datasharedservice : DataSharedService,
    private apiservice : APIService,
    private toastrService : ToastrService,
    private procurementAPIService:PROCUREMENTAPIService
  ) {}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewMaterialList();
    this.getItemType();
    this.getAccount();
    this.offcanvasedit = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightEditRole')
    );
    this.offcanvasAdd = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteUser')
    );

  }
  getAccount(){
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getAccountHead(params).subscribe(data => {
    this.accountNameList = data.results;
    });
  }

  addnew() {
    this.scope = 'add'
  }


  viewMaterialList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');

    this.apiservice.getMaterialTypeList(params).subscribe((data: { count: any; results: any; }) => {
      this.materialList = data.results;
      this.materialList=this.parentSearch(data.results);
      this.materialList = this.materialList.filter((el: any) => {
        if (el.parent != null) {
          return el
        }
      })
    })
  }

  parentSearch(data:any){
    for(let i=0;i<data.length;i++){
       data[i]['parentName']=this.materialList.find((item:any) => item.id == data[i].parent)?.name;
    }
    return data;
  }

  deleteCompany(id:any) {
    this.selectedId = id
  }

  showPurCombo(status:any){
   this.purchaseAcntStatus=status;
  }
  showSalesPurCombo(status:any){
  this.salesAcntStatus=status;
  }

  closeCanvas() {
    this.scope = ''
    this.offcanvasedit.hide();
    this.offcanvasAdd.hide();
    this.deleteModal.hide();
    this.viewMaterialList();
    
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
      params.set('id', this.selectedId);
      params.set('method','delete')
      this.apiservice.deleteMaterialTypeData(params).subscribe(data => {
        this.toastrService.success(Success_Messages.SuccessDelete, '', {
          timeOut: 2000,
        });
        this.closeCanvas()
      })
  }

  editcompanyid(id:any) {
    this.scope = 'edit'
    this.selectedId = id
  }

  getItemType(){
    this.apiservice.getItemType().subscribe(data=>{
     this.itemTypelist=data.results;
    }) 
   }

  onSearch(){
    if(this.salesAcntStatus=='Not Assigned'){
      this.addUser.salesAccount='';
    }
    if(this.purchaseAcntStatus=='Not Assigned'){
      this.addUser.purchaseAccount='';
    }
    
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('name', this.addUser.name);
    params.set('purchase_account', this.addUser.purchaseAccount);
    params.set('item_type', this.addUser.itemtype);
    params.set('sales_account', this.addUser.salesAccount);

    this.apiservice.getMaterialTypeList(params).subscribe((data: { count: any; results: any; }) => {
      this.materialList = data.results;
    })
  }
}
