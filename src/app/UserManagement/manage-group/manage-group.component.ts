import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { EditGroupComponent } from '../Components/edit-group/edit-group.component';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
declare var window: any;

@Component({
  selector: 'app-manage-group',
  templateUrl: './manage-group.component.html',
  styleUrls: [
    './manage-group.component.scss',
    '../../../assets/scss/scrollableTable.scss'
  ]
})
export class ManageGroupComponent implements OnInit {
  @ViewChild('editGroupData')
  editGroupData!: EditGroupComponent;
  isActiveValue: any;
  gropuList: any = [];
  deleteGroup: any;
  changeStatusId: any;
  groupName: any;
  addGroup: any;
  editGroup: any;
  groupMembers: any;
  selectedGroup = '';
  localStorageData: any;
  deleteId: any;
  memberIdArray: any = [];
  groupData: any = [];
  GroupList: any;
  is_active: boolean = true;

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  userPermissions: any = {}
  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private toastrService: ToastrService,
    private paginationservice: PaginationService,
    private commonFunction: CommonFunctionService
  ) { }

  ngOnInit(): void {
    this.getUserPermission()
    this.setupModalOfcanvas();
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getGroupList();
    this.getdownloadGroupList();
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage Group')
  }

  getGroupList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getGroupList(params).subscribe(data => {
      this.gropuList = data.results;
      this.paginationservice.setTotalItemData(data.count);
    })
  }

  getdownloadGroupList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getGroupList(params).subscribe(data => {
      this.GroupList = data.results;
      this.paginationservice.setTotalItemData(data.count);
    })
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

    this.apiservice.getGroupList(params).subscribe(data => {
      this.gropuList = data.results;
    })

  }
  editGroupValue(editId: any) {
    this.editGroupData.getData(editId);
  }
  deleteGroupValue(delId: any) {
    this.deleteId = delId;
  }

  deleteGroupModel() {
    this.apiservice.deleteGroup(this.deleteId, this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getGroupList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  ChangeStatus(statusId: any, booleanValue: any, grName: any, memberId: any) {
    this.changeStatusId = statusId;
    this.isActiveValue = booleanValue;
    this.groupName = grName;
    for (const item of memberId) {
      this.memberIdArray.push(item.user_id);
    }

  }
  confirmDeactive() {
    let params = {
      is_active: this.isActiveValue,
      group_name: this.groupName,
      user_ids: this.memberIdArray
    }
    this.apiservice.updateGroupList(params, this.changeStatusId, this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.toastrService.success('Status changed Successfully', '', {
        timeOut: 2000,
      });
      this.getGroupList();
      this.getdownloadGroupList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }
  setupModalOfcanvas() {
    this.deleteGroup = new window.bootstrap.Modal(
      document.getElementById('deleteGroup')
    );

    this.addGroup = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabeladdgroup')
    );
    this.editGroup = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightEditGroup')
    );

    this.groupMembers = new window.bootstrap.Modal(
      document.getElementById('groupMembers')
    );
  }

  addNewGroup() {
    this.addGroup.show();
  }

  downloadCsv() {
    var i = 0;
    for (const item of this.GroupList) {
      i = i + 1;
      var obj = {
        S_No: i,
        GroupName: item.group_name,
        Members: this.filterNames(item.user_groups),
        MemberCount: item.user_groups.length,
        Status: this.filterStatus(item.is_active),
      }
      this.groupData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: ["S.No", "Group Name", "Members", "Member Count", "Status"]
    };
    new ngxCsv(this.groupData, "GroupList", options);
    window.location.reload();
  }

  downloadPdf() {
    var i = 0;
    for (const item of this.GroupList) {
      i = i + 1;
      var obj = [
        i,
        item.group_name,
        this.filterNames(item.user_groups),
        item.user_groups.length,
        this.filterStatus(item.is_active),
      ]
      this.groupData.push(obj);
    }
    var header = [["S.No", "Group Name", "Members", "Member Count", "Status"]];
    var doc = new jsPDF();
    (doc as any).autoTable({
      head: header, body: this.groupData, styles: {
        overflow: 'linebreak',
        fontSize: 10
      }
    })
    // doc.output('dataurlnewwindow');
    doc.save("Group List");
    this.groupData = [];
  }

  filterNames(data: any) {
    let res = ''
    for (let i = 0; i < data.length; i++) {
      res += data[i].full_name + ', '
    }
    return res
  }

  filterStatus(data: any) {
    let res = ''
    if(data==true){
    res += 'Active'
    }else {
    res += 'Inactive'
    }
    return res
  }

}
