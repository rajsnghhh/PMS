import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
declare var window: any;

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss',
    '../../assets/scss/scrollableTable.scss',
  ]
})
export class ProjectComponent {
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;
  offcanvas: any;
  projectId: any;
  planningoffcanvas: any
  localStorageData: any;
  ProjectList: any = [];

  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  CompanyData: any = [];

  constructor(
    private paginationservice: PaginationService,
    private router: Router,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjectList();
    this.setUpModalCanvas();

  }

  queryParaMap: any = {
    page_size: 10,
    page: 1,
    organisation: ''
  }

  getUserPermission() {
    this.apiservice.gettenderUserpermission().subscribe(data => {
    })
  }
  setUpModalCanvas() {
    this.offcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightUserSetting')
    );
    this.planningoffcanvas = new window.bootstrap.Offcanvas(
      document.getElementById('planningCanvas')
    );
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');
    this.apiservice.getProjectList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.ProjectList = data.results;

      for (let k = 0; k < this.ProjectList.length; k++) {
        if (this.ProjectList[k].is_project_head_selected == true) {
          let obj = {
            form_label: 'Project Head',
            value: this.ProjectList[k].project_head_details[0].full_name
          }
          this.ProjectList[k].project_data.push(obj);
        } else {
          let obj = {
            form_label: 'Project Head',
            value: ''
          }
          this.ProjectList[k].project_data.push(obj);
        }

        if (this.ProjectList[k].is_planning_head_selected == true) {
          let obj = {
            form_label: 'Planning Head',
            value: this.ProjectList[k].planning_head_details[0].full_name
          }
          this.ProjectList[k].project_data.push(obj);
        } else {
          let obj = {
            form_label: 'Planning Head',
            value: ''
          }
          this.ProjectList[k].project_data.push(obj);
        }
      }
    })
  }

  gotoEnderDetails(tenderid: any) {
    this.router.navigate(['/pms/tender/continue-tender/view/' + tenderid]).then(() => {
      window.location.reload();
    });
  }

  getTenderId(item: any, action: any) {
    this.datasharedservice.saveLocalData('jvIncorpid', JSON.stringify(item));
    this.projectId = item;
    if (action == 'Edit') {
      this.router.navigate(['/pms/project/edit-project/' + item.tender + '/' + item.id]).then(() => {
        window.location.reload();
      });
    }else if(action == 'Budget') {
      this.router.navigate(['/pms/budget/view/' + item.tender + '/' + item.id]).then(() => {
        window.location.reload();
      });
    } else if (action == 'Planning') {
      this.router.navigate(['/pms/planning/view/' + item.tender + '/' + item.id]).then(() => {
        window.location.reload();
      });
    } else if (action == 'JVIncorp') {
      this.router.navigate(['/pms/project/jv-incorporation/' + item.tender + '/' + item.id]).then(() => {
        window.location.reload();
      });
    } else if (action == 'Edit') {
      this.router.navigate(['/pms/project/edit-jv-incorporation/' + item.tender + '/' + item.id]).then(() => {
        window.location.reload();
      });
    } else if (action == 'Masters') {
      this.router.navigate(['/pms/project/master/' + item.id]).then(() => {
        window.location.reload();
      });
    }
     else if (action == 'Select Project Head') {
      this.offcanvas.show();
    } else if (action == 'Select Planning Head') {
      this.planningoffcanvas.show();
    }
  }

  closeUserSetting() {
    this.offcanvas.hide();
    this.getProjectList();

  }
  closePlanning() {
    this.planningoffcanvas.hide();
    this.getProjectList();
  }

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    this.queryParaMap.page_size = this.paginationValue.pagesizeValue;
    this.queryParaMap.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams(this.queryParaMap);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getProjectList(params).subscribe(data => {
      this.ProjectList = data.results;
    })
  }

  downloadCsv() {
    let hadderlist = ['Sl.NO']
    for (const item of this.ProjectList[0].project_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.ProjectList.length; i++) {
      var obj = [i + 1]
      for (const inneritem of this.ProjectList[i].project_data) {
        obj.push(inneritem.value)
      }
      this.CompanyData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: [hadderlist]
    };
    new ngxCsv(this.CompanyData, "ProjectList", options);
    window.location.reload();
  }

  downloadPdf() {
    let hadderlist = ['S.No']
    for (const item of this.ProjectList[0].project_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.ProjectList.length; i++) {
      var obj = [i + 1]
      for (const inneritem of this.ProjectList[i].project_data) {
        obj.push(inneritem.value)
      }
      this.CompanyData.push(obj);
    }
    var header = [hadderlist];
    var pdfsize = 'a0';
    var doc = new jsPDF('p', 'pt', 'a4');
    (doc as any).autoTable({
      head: header, body: this.CompanyData,
      startY: 10,
      startX: 0,
      styles: {
        overflow: 'linebreak',
        fontSize: 2,
      }
    })
    doc.save("Project List");
    doc.output('dataurlnewwindow')
    this.CompanyData = [];
  }
  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  goToCommunication(projectId:any){
    this.router.navigate(['/pms/project/communication/'+ projectId])
  }
}
