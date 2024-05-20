import { Component } from '@angular/core';
import { APIService } from '../../Services/api.service';
import { DataSharedService } from '../../Services/data-shared.service';

@Component({
  selector: 'app-status-box',
  templateUrl: './status-box.component.html',
  styleUrls: ['./status-box.component.scss',
  '../../../../assets/scss/scrollableTable.scss'
]
})

export class StatusBoxComponent {

  localStorageData: any;
  TenderList: any = [];
  popupTenderList:any=[];
  TenderName: any = [];
  TenderJVList: any = [];


  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  TenderType: any;
  TenderFilterName: any;
  CompanyData: any = [];
  TenderPermission: any;
  searchoffcanvas: any;
  TenderIndex: any;
  TenderID: any;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.TenderType = JSON.parse(this.datasharedservice.getLocalData('EvaluationTender'));
    this.TenderID = JSON.parse(this.datasharedservice.getLocalData('tender_id'));
    this.TenderIndex = JSON.parse(this.datasharedservice.getLocalData('tender_index'));
    // if(this.datasharedservice.getLocalData('tender_index')){
    //   this.TenderIndex = JSON.parse(this.datasharedservice.getLocalData('tender_index'));
    // }
    this.setUpModalCanvas();
    this.getTenderList();
  }

  queryParaMap: any = {
    page_size: 10,
    page: 1,
    organisation: ''
  }

  setUpModalCanvas() {
    // this.searchoffcanvas = new window.bootstrap.Offcanvas(
    //   document.getElementById('offcanvasRightsearch')
    // );
  }

  getTenderList() {
    let params = new URLSearchParams(this.queryParaMap);
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('tender_type', this.TenderType);
    params.set('list', 'true')

    this.apiservice.getTenderList(params).subscribe(data => {
      this.TenderList = data.results;
      this.TenderName = data;
      this.popupTenderList = this.TenderList[this.TenderIndex].status_map;
    })
  }

}
