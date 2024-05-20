import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { UpdateGroupComponent } from '../update-group/update-group.component';
import { AddGroupComponent } from '../add-group/add-group.component';


@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: [
    './edit-module.component.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class EditModuleComponent implements OnInit {

  @ViewChild('editGroup')
  editGroup!: UpdateGroupComponent;
  @ViewChild('addGroup')
  addGroup!: AddGroupComponent;

  menuId: any;
  delGroupId:any;
  temp: any;
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  MenuFormList: any = [];
  localStorageData: any;
  fieldValue: any = [];
  menuName: any;
  deleteId: any;


  colapseFromsList: any = []
  reqFormId: any;
  reqGroupId: any;
  reqListCheck: any;
  reqSearch:any;
  listcheckFormId: any;
  searchFormId:any;
  listcheckGroupId: any;
  searchGroupId:any;
  listcheckListCheck: any;
  searchListCheck:any;
  reqRequired: any;
  listcheckRequired: any;
  searchRequired:any;
  listSearchValue:any;
  SearchValueData:any;
  requiredValue: any;
  listExportValue: any;
  checkSearchValue:any;
  selectedGroupForDND = '';

  constructor(
    private paginationservice: PaginationService,
    public router: Router,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private datasharedservice: DataSharedService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getData();
    this.menuName = this.datasharedservice.getLocalData('ModelName');
  }

  getData() {
    this.menuId = this.datasharedservice.getLocalData('ModelFormId');
    let params = new URLSearchParams();
    params.set('menu_id', this.menuId)
    this.apiservice.getMenuFormList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.MenuFormList = data.results;
      this.setUpColapseelement();
    });
  }
  editTheGroup(formtype:any,id:any) {
    this.editGroup.prevData(formtype,id);
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
    params.set('menu_id', this.menuId)
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)
    this.apiservice.getMenuFormList(params).subscribe(data => {
      this.MenuFormList = data.results;
    });
  }

  deleteTheGroup(delId:any){
    this.delGroupId=delId;
  }
  deletePerticulerGroup(){
    this.apiservice.deleteGroupData(this.delGroupId, this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.toastrService.success("Group Deleted Successfully", '', {
        timeOut: 2000,
      });
      this.getData();
    })
  }
  setUpColapseelement() {
    this.colapseFromsList = [];
    for (let i = 0; i < this.MenuFormList.length; i++) {
      this.temp = {
        id: this.MenuFormList[i].id,
        colapseStatus: false,
        name: this.MenuFormList[i].form_name,
        formType: this.MenuFormList[i].form_type_name
      }
      this.colapseFromsList.push(this.temp);
    }
    let focusON = 0
    if(this.datasharedservice.getLocalData('focusON')) {
      this.colapseFromsList[parseInt(this.datasharedservice.getLocalData('focusON'))].colapseStatus = true;
      focusON = parseInt(this.datasharedservice.getLocalData('focusON'))
    }else {
      this.colapseFromsList[0].colapseStatus = true;
    }
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', this.MenuFormList[focusON].form_type_name);
    params.set('fetch_type','all')
    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.fieldValue = data.results;
    });
  }

  expandSpecificElement(serialNo: any, formtype: any) {
    for (let i = 0; i < this.colapseFromsList.length; i++) {
      this.colapseFromsList[i].colapseStatus = false;
    }
    this.colapseFromsList[serialNo].colapseStatus = true;
    this.datasharedservice.saveLocalData('focusON',serialNo.toString())
    this.fieldValue = [];
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('form_type', formtype);
    params.set('fetch_type','all')

    this.apiservice.getDynamicForm(params).subscribe(data => {
      this.fieldValue = data.results;
    });
  }

  isRequiredCheck(formId: any, grId: any, required: any, listcheck: any,searchCheck:any) {
    this.reqFormId = formId;
    this.reqGroupId = grId;
    this.reqRequired = required;
    this.reqListCheck = listcheck;
    this.reqSearch = searchCheck
  }
  updateRequired() {
    if (this.reqRequired == true) {
      this.requiredValue = false;
    } else {
      this.requiredValue = true;
    }
    let req = {
      is_required: this.requiredValue,
      is_export: this.reqListCheck,
      is_searchable:this.reqSearch
    }
    this.apiservice.checkUncheck(req, this.reqFormId, this.localStorageData.organisation_details[0].id, this.reqGroupId).subscribe(data => {
      this.toastrService.success("Required Status Updated Successfully", '', {
        timeOut: 2000,
      });
      this.getData();
    })
  }
  isListExportCheck(formId: any, grId: any, required: any, listcheck: any, searchValue:any) {
    this.listcheckFormId = formId;
    this.listcheckGroupId = grId;
    this.listcheckRequired = required;
    this.listcheckListCheck = listcheck;
    this.listSearchValue = searchValue;
  }
  cancelUpdate(){
    this.getData();
  }
  updateListExport() {
    if (this.listcheckListCheck == true) {
      this.listExportValue = false;
    } else {
      this.listExportValue = true;
    }
    let request = {
      is_required: this.listcheckRequired,
      is_export: this.listExportValue,
      is_searchable:this.listSearchValue
    }
    this.apiservice.checkUncheck(request, this.listcheckFormId, this.localStorageData.organisation_details[0].id, this.listcheckGroupId).subscribe(data => {
      this.toastrService.success("List/Export Status Updated Successfully", '', {
        timeOut: 2000,
      });
      this.getData();
    })
  }
  isSearchCheck(formId: any, grId: any, required: any, listcheck: any, searchValue:any){
    this.searchFormId = formId;
    this.searchGroupId = grId;
    this.searchRequired = required;
    this.searchListCheck = listcheck;
    this.SearchValueData = searchValue;
  }
  updateSearch(){

    if (this.SearchValueData == true) {
      this.checkSearchValue = false;
    } else {
      this.checkSearchValue = true;
    }
    let request = {
      is_required: this.searchRequired,
      is_export: this.searchListCheck,
      is_searchable:this.checkSearchValue
    }
    this.apiservice.checkUncheck(request, this.searchFormId, this.localStorageData.organisation_details[0].id, this.searchGroupId).subscribe(data => {
      this.toastrService.success("Search Status Updated Successfully", '', {
        timeOut: 2000,
      });
      this.getData();
    })
  }
  addNewField(form: any, groupId: any) {
    this.datasharedservice.saveLocalData('AddGroupId', groupId.toString())
    this.datasharedservice.saveLocalData('formType', form)
    this.router.navigate(['/pms/settings/module-configuration/add'])
  }

  addNewGroup(groupType:any){
    this.addGroup.prevData(groupType);
  }
  editField(editId: any, formType: any) {
    this.datasharedservice.saveLocalData('EditFieldId', editId.toString())
    this.datasharedservice.saveLocalData('formType', formType)
    this.router.navigate(['/pms/settings/module-configuration/update'])
  }
  deleteField(delId: any) {
    this.deleteId = delId;
  }
  deleteFieldForm() {
    this.apiservice.deleteTheFormField(this.deleteId, this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.toastrService.success("Field Deleted Successfully", '', {
        timeOut: 2000,
      });
      this.getData();
    })
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (item.form_group == list[0].form_group && this.selectedGroupForDND == list[0].form_group) {
      const index = list.indexOf(item);
      list.splice(index, 1);
      this.sleep(200);
      this.updateOrder(list)
    }
  }

  onDrop(event: DndDropEvent, list: any[]) {
    this.selectedGroupForDND = list[0].form_group
    if (event.data.form_group == list[0].form_group && this.selectedGroupForDND == list[0].form_group) {
      let index = event.index;
      if (typeof index === 'undefined') {
        index = list.length;
      }
      list.splice(index, 0, event.data);
    }
  }

  private sleep(millis: number) {
    var date = new Date();
    var curDate = null;
    do {
      curDate = new Date();
    } while (curDate.getTime() - date.getTime() < millis);
  }

  updateOrder(data:any) {
    let request = {
      "form_fields":data
    }
    this.apiservice.updateFromInputOrder(request).subscribe(data => {
      if(data.request_status != 1) {
        this.getData()
      }
    },err=>{
      this.getData()
    })
  }

}
