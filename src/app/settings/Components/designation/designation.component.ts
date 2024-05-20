import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { EditDesignationComponent } from './edit-designation/edit-designation.component';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { AddDesignationComponent } from './add-designation/add-designation.component';
declare var window: any;

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class DesignationComponent implements OnInit {
  @ViewChild('editDesignation')
  editDesignation!: EditDesignationComponent;

  @ViewChild('addDesignation')
  addDesignation!: AddDesignationComponent;
  designationForm!: FormGroup;
  deletedesignationId: any;
  designationList: any = [];
  localStorageData: any;
  editdesignationId: any;
  TreeHTML = ''
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  roleTreeData: any;
  disabledDeleteid = ''
  deleteModal: any;
  editcanvas: any;
  addrolecanvas: any;
  selectedComapany = ''

  constructor(
    private apiservice: APIService,
    private router: Router,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.apiservice.getCountryList().subscribe(data => {
    })
    this.getRoleTreeData();
    this.setUpModalCanvas();

  }

  setUpModalCanvas() {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteUser')
    );

    this.editcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightEditRole')
    );

    this.addrolecanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdrole')
    );

  }

  getRoleTreeData() {
    this.apiservice.getRoleTreeData(this.localStorageData.organisation_details[0]?.id).subscribe(data => {
      this.roleTreeData = data
      this.TreeHTML = '';

      for(let i=0; i<this.roleTreeData.length;i++) {
        this.generateMultipleComapanyHTML(this.roleTreeData[i],this.roleTreeData[i].id);
      }
    })
  }

  generateMultipleComapanyHTML(data:any,companyID:string) {
    this.TreeHTML += '<div class="organization-card"><h1>'+data.name+'</h1>';
    this.disabledDeleteid = data.role_tree_details[0].id
    this.generateDynamicHtml(data.role_tree_details[0],companyID);
    this.TreeHTML = this.TreeHTML + '<div class="card-space"></div>'
    this.TreeHTML = this.TreeHTML + '</div>';
  }

  generateDynamicHtml(data: any,companyID:string) {
    if (data.children.length > 0) {
      let indexclass = ''
      let deleteElement = '<img class="DELETE" ' + 'id=' + data.id + ' C_id=' + companyID +' src="assets/icons/delete1.png" alt="">'
      let editElement = '<img class="EDIT" ' + 'id=' + data.id + ' C_id=' + companyID + ' src="assets/icons/editing.png" alt=""> '
      if (data.id == this.disabledDeleteid) {
        deleteElement = '';
        editElement = '';
        indexclass = 'class="indexclass"';
      }
      if(data.designation == 'CEO') {
        deleteElement = '';
        editElement = '';
      }
      this.TreeHTML = this.TreeHTML + '<li '+ indexclass +'><details open> <summary '+ indexclass +'>' + data.designation + ' <span class="role-action"> <img class="ADD" ' + 'id=' + data.id +' C_id=' + companyID + ' src="assets/icons/add1.png" alt=""> ' + editElement + deleteElement + ' </span>  </summary> <ul>'
      for (let i = 0; i < data.children.length; i++) {
        this.generateDynamicHtml(data.children[i],companyID)
      }
      this.TreeHTML = this.TreeHTML + '</ul> </details></li>'
    } else {
      if(data.designation == 'CEO') {
        this.TreeHTML = this.TreeHTML + '<li>' + data.designation + '<span class="role-action"> <img class="ADD" ' + 'id=' + data.id + ' C_id=' + companyID + ' src="assets/icons/add1.png" alt=""> </span></li>'
      }else{
        this.TreeHTML = this.TreeHTML + '<li>' + data.designation + '<span class="role-action"> <img class="ADD" ' + 'id=' + data.id + ' C_id=' + companyID + ' src="assets/icons/add1.png" alt=""> <img class="EDIT" ' + 'id=' + data.id +' C_id=' + companyID + ' src="assets/icons/editing.png" alt=""> <img class="DELETE" ' + 'id=' + data.id +' C_id=' + companyID + ' src="assets/icons/delete1.png" alt=""> </span></li>'
      }
    }
  }

  roleEvent(input: any, e: MouseEvent): void {
    input.helpOpen = !input.helpOpen;

    if ((e.target as HTMLElement).className === 'ADD') {
      let target = e.target as HTMLElement;
      this.addRole(target.getAttribute('id'),target.getAttribute('C_id'))
    }
    if ((e.target as HTMLElement).className === 'EDIT') {
      let target = e.target as HTMLElement;
      this.editdesignationid(target.getAttribute('id'),target.getAttribute('C_id'))
    }
    if ((e.target as HTMLElement).className === 'DELETE') {
      let target = e.target as HTMLElement;
      this.deletedesignation(target.getAttribute('id'),target.getAttribute('C_id'))
    }
  }

  
  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)
  }

  addRole(id: any,companyID:any) {
    this.addDesignation.setRoleValue(id,companyID)
    this.addrolecanvas.show()
  }

  editdesignationid(id: any,companyID:any) {
    this.datasharedservice.saveLocalData('designation_id', JSON.stringify(id));
    this.editDesignation.getData(id,companyID);
    this.editcanvas.show()
  }

  deletedesignation(id: any,companyID:any) {
    this.deleteModal.show()
    this.deletedesignationId = id;
    this.selectedComapany = companyID;
  }

  deleteAlertdesignation() {
    this.apiservice.deleteDesignation(this.deletedesignationId, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getRoleTreeData();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }



}
