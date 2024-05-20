import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-procurement-site',
  templateUrl: './procurement-site.component.html',
  styleUrls: ['./procurement-site.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class ProcurementSiteComponent {
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;
  procurementSiteList: Array<any> = [];
  onEditProcurementSiteData: any;
  deleteProcurementSiteData: any;
  addUpdateProcurementSite: string = 'Add Project Site';
  projectId: any;

  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));

    this.getProcurementSiteList();
  }


  getProcurementSiteList() {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.projectId);

    params.set('page_size', '10');
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.procurementSiteList = data.results;
    })
  }

  editProcurementSiteList(site: any) {
    this.onEditProcurementSiteData = site;
    if (this.onEditProcurementSiteData) {
      this.addUpdateProcurementSite = 'Edit Project Site'
    } else
      this.addUpdateProcurementSite = 'Add Project Site'
  }

  deleteAlertProcurementSite(site: any) {
    this.deleteProcurementSiteData = site;
  }

  deleteProcurement() {

    this.apiservice.deleteProcurementSite(this.deleteProcurementSiteData.id, this.deleteProcurementSiteData.organization).subscribe((res: any) => {

      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getProcurementSiteList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })


  }


  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditProcurementSiteData = ''
    this.addUpdateProcurementSite = 'Add Project Site'
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
    this.apiservice.getProcurementSiteList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.procurementSiteList = data.results;
    })

    // this.getProcurementSiteList(params);

  }


}
