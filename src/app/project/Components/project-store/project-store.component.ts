import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-project-store',
  templateUrl: './project-store.component.html',
  styleUrls: ['./project-store.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class ProjectStoreComponent {
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;
  projectStoreList: Array<any> = [];
  projectSiteList: Array<any> = [];

  onEditProjectStoreData: any;
  deleteProjectStoreData: any;
  addUpdateProjectStore: string = 'Add Project Store';
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

    this.getProjectStoreList('');

  }


  getProjectStoreList(page: any) {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('site__project', this.projectId);
    params.set('page_size', page ? page : '10');
    this.apiservice.getProjectStoreList(params).subscribe((data: any) => {
      this.paginationservice.setTotalItemData(data.count);
      this.projectStoreList = data.results;
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('project', this.projectId);
      this.apiservice.getProcurementSiteList(params).subscribe(data => {
        this.projectSiteList = data.results;

        // Update projectStoreList with site_name
        for (const storeItem of this.projectStoreList) {
          const matchingSite = this.projectSiteList.find(siteItem => siteItem.id === storeItem.site);

          if (matchingSite) {
            storeItem.site_name = matchingSite.site_name;
          }
        }
      })
    })

  }

  // getProjectSiteList() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('project', this.projectId);
  //   this.apiservice.getProcurementSiteList(params).subscribe(data => {
  //     this.projectSiteList = data.results;
  //   })
  // }

  editProjectStoreList(store: any) {
    this.onEditProjectStoreData = store;
    if (this.onEditProjectStoreData) {
      this.addUpdateProjectStore = 'Edit Project Store'
    } else
      this.addUpdateProjectStore = 'Add Project Store'
  }

  deleteAlertProjectStore(store: any) {
    this.deleteProjectStoreData = store;
  }

  deleteProjectStore() {

    this.apiservice.deleteProjectStore(this.deleteProjectStoreData.id, this.deleteProjectStoreData.organization).subscribe((res: any) => {

      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getProjectStoreList('');
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })


  }


  closeModal() {
    this.closeButton.nativeElement.click()
    this.onEditProjectStoreData = ''
    this.addUpdateProjectStore = 'Add Project Store'
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

 
    this.getProjectStoreList(this.pageSize);


  }


}

