import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { EditPermissionComponent } from '../Components/edit-permission/edit-permission.component';
import { Error_Messages } from 'src/app/Shared/Config/config.const';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'

declare var window: any;

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: [
    './manage-role.component.scss',
    '../../../assets/scss/scrollableTable.scss'
  ]
})
export class ManageRoleComponent implements OnInit {
  @ViewChild('editPermission')
  editPermission!: EditPermissionComponent;
  activeCount = 0;
  inactiveCount = 0;
  deleteModal: any;
  addRoleoffcanvas: any;
  deactiveRole: any;
  editRoleoffcanvas: any;
  dropdownList:any;
  selectedItems:any;
  roleToBeDelete:any
  role_name = ''
  currentstatus = true;
  dropdownSettings = {};
  ModuleData: any = [];
  is_active: boolean = true;


  constructor(
    private apiservice:APIService,
    private commonFunction:CommonFunctionService,
    private datasharedservice:DataSharedService,
    private paginationservice:PaginationService,
    private toastrService:ToastrService,

  ) { }

  roalList:any;
  userData:any;
  permissionlist:any=[];
  query:any = {}
  roleUsers:any;
  pageSize:any=10;
  page:any=1;
  paginationValue:any;
  userList:any;
  userPermissions:any ={}
  ngOnInit(): void {
    this.getUserPermission()
    this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));  
    this.query.organization_id = this.userData.organisation_details[0].id;
    this.setupModalOfcanvas()
    this.setupMultiSelectOptions()  
    this.getRoleList()   
  }

  getUserPermission() {

    this.userPermissions = this.commonFunction.getUserPermission('Manage Roles & Permission')
  }


  setupModalOfcanvas() {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteRole')
    );

    this.addRoleoffcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );
    this.editRoleoffcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightEditRole')
    );

    this.deactiveRole= new window.bootstrap.Modal(
      document.getElementById('deactiveRole')
    );
  }

  getRoleList() {
    let query = this.commonFunction.getURL( this.query )
    this.apiservice.getRoleList(query).subscribe(data=> {
      this.activeCount = data.is_active_true_count;
      this.inactiveCount = data.is_active_false_count;
      this.paginationservice.setTotalItemData(data.count);
      data = data.results;
      this.permissionlist = data;
    }, err => {
      
    })
  }
  SetUsers(data:any) {
    this.roleUsers = data;
  }

  getactiveUserList() {
    this.query.is_active = true;
    this.getRoleList()
  }

  getAllUserList() {
    let temp = this.query.organization_id
    this.query = {}
    this.query.organization_id = temp
    this.getRoleList()
  }

  getinactiveUserList() {
    this.query.is_active = false;
    this.getRoleList()
  }

  ChangeStatus(id:number) {
    // id--
    // this.permissionlist[id].Status = !this.permissionlist[id].Status
  }

  editRole(id:string) {
    this.editRoleoffcanvas.show();
    this.roleToBeDelete = id;
    this.editPermission.getEditData(id,this.userData.organisation_details[0].id);
  }
  

  closeEditRole() {
    this.editRoleoffcanvas.hide();
    this.getRoleList()
  }

  editProfileSetting(id:string) {

  }
  viewUser(id:number){
    
  }

  sortTableData() {
    
  }


  getroleDetails() {

    let query = this.commonFunction.getURL(
      {
        id: this.roleToBeDelete,
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.getroleDetails(query).subscribe(data=> {
      data = data.results
      return data;
    }, err => {
      
    })

  }

  setupMultiSelectOptions() {
    this.dropdownSettings = { 
      singleSelection: false,
      text: "View All",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.selectedItems = [];
  }
  onItemSelect(item:any){
  }
  OnItemDeSelect(item:any){
  }
  onSelectAll(items: any){
  }
  onDeSelectAll(items: any){
  }

  deleteRole(id:string) {
    this.roleToBeDelete = id;
    this.deleteModal.show();
  }

  toggleRole(id:string,role_name:string,currentstatus:boolean) {
    this.role_name = role_name
    this.currentstatus = currentstatus
    this.roleToBeDelete = id;
    this.deactiveRole.show();
  }
  confirmDeactive() {
    
  let query = this.commonFunction.getURL({
    method: 'edit',
    id: this.roleToBeDelete,
    organization_id: this.userData.organisation_details[0].id
  });

  let queryData = {
    is_active: !this.currentstatus,
    organization:this.userData.organisation_details[0].id,
    role_name: this.role_name
  }
  
  this.apiservice.updateRoleName(query,queryData).subscribe(data=> {
    this.deactiveRole.hide();
    this.toastrService.success('Status changed Successfully', '', {
      timeOut: 2000,
    });
    this.getRoleList()
  }, err => {
    this.toastrService.error(Error_Messages.Failed_HTTP, '', {
      timeOut: 2000,
    });
  }) 

  }

  confirmDelete() {
    this.deleteModal.hide();
    this.getRoleList()

    let query = this.commonFunction.getURL(
      {
        method: 'delete',
        id: this.roleToBeDelete,
        organization_id: this.userData.organisation_details[0].id,
      }
    )
    this.apiservice.deleteRole(query).subscribe(data=> {
      this.getRoleList()
      this.deleteModal.hide();
    }, err => {
      
    })
  }


  saveSomeThing() {
    // confirm or save something
    this.deleteModal.hide();
  }

  addRoleopenCanvas() {
    this.addRoleoffcanvas.show();
  }
  closeRoleCanvas() {
    this.addRoleoffcanvas.hide();
    this.getRoleList() 
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
    this.query.page_size = this.paginationValue.pagesizeValue;
    this.query.page = this.paginationValue.pagevalue;
    this.getRoleList();
  }

  filterNames(data: any) {
    let res = ''
    for (let i = 0; i < data.length; i++) {
      res += data[i].itemName + ', '
    }
    return res
  }

  filterStatus(data: any) {
    let res = ''
    if(data==true){
    res = 'Active'
    }else {
    res = 'Inactive'
    }
    return res
  }

  downloadCsv() {
    var i=0;
    for (const item of this.permissionlist){
      i = i + 1;
      var obj = {
        S_No: i,
        Profile: item.role_name,
        Description: item.description,
        Users: item.user_count,
        Permissions: this.filterNames(item.user_permissions_details),
        Status: this.filterStatus(item.is_active),
        }
      this.ModuleData.push(obj);
    }
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      headers: ["S.No","Profile","Description","Users","Permissions","Status"]
    };
    new ngxCsv(this.ModuleData,"Role List", options);
    window.location.reload();
  }
  
  downloadPdf() {
    var i=0;
    for (const item of this.permissionlist){
      i = i + 1;
      var obj = [
        i,
        item.role_name,
        item.description,
        item.user_count,
        this.filterNames(item.user_permissions_details),
        this.filterStatus(item.is_active),
      ]
      this.ModuleData.push(obj);
    }
   var  header= [["S.No.","Profile","Description","Users","Permissions","Status"]];
    var doc = new jsPDF();
  (doc as any).autoTable({  head: header, body:this.ModuleData,styles: {overflow: 'linebreak',
  fontSize: 8} })
  // doc.output('dataurlnewwindow');
  doc.save("Role List");
  this.ModuleData=[];

  }

}
