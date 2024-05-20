import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'

import 'jspdf-autotable'
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';

@Component({
  selector: 'app-location-zone',
  templateUrl: './location-zone.component.html',
  styleUrls: [
    './location-zone.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class LocationZoneComponent implements OnInit {

  @ViewChild('editLocation')
  editLocation!: EditLocationComponent;
  dropdownList: any = [];
  dropdownStateList: any = [];
  countrylist: any;
  selectedItems: any;
  selectedStates: any;
  localStorageData: any;
  deleteId: any;
  zoneList: any=[];
  ZoneList: any;
  LocationData: any = [];
  userPermissions:any ={}


  pageSize:any=10;
  page:any=1;
  paginationValue:any;

  dropdownSettings = {};
  dropdownStateSettings = {};
  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice:PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.apiservice.getCountryList().subscribe(data => {
      this.countrylist = data;
    })
    this.getZoneList();
    this.setupMultiSelectOptions();
    this.getdownloadZoneList();
    this.getUserPermission();
  }

  getUserPermission() {
    this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }

  getZoneList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getZoneList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.zoneList = data.results;
    })
  }

  getdownloadZoneList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page_size', '1000');
    this.apiservice.getZoneList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);    
      this.ZoneList = data.results;
    })
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
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)

    this.apiservice.getZoneList(params).subscribe(data => {
      this.zoneList = data.results;    
    })

  }

  editZone(id:any) {
    this.editLocation.getData(id);
  }

  deleteZone(deleteId: number) {
    this.deleteId = deleteId;
  }
  deleteZoneModel() {
    this.apiservice.deleteZone(this.deleteId, this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.getZoneList();
    },err=>{
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }
  
  shortingLogic(order: boolean, id: string) {
    if (order) {
      this.zoneList.sort(function (a: { id: number; }, b: { id: number; }) {
        return a.id - b.id;
      });
    } else {
      this.zoneList.sort(function (a: { id: number; }, b: { id: number; }) {
        return b.id - a.id;
      });
    }
  }


  setupMultiSelectOptions() {
    this.selectedItems = [];
    this.selectedStates = [];

    this.dropdownSettings = {
      singleSelection: false,
      text: "View All",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    };
    this.dropdownStateSettings = {
      singleSelection: false,
      text: "View All",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "multi-select-dropdown"
    }

  }

  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }



  onStateSelect(item: any) {
  }
  OnStateDeSelect(item: any) {
  }
  onStateSelectAll(items: any) {
  }
  onStateDeSelectAll(items: any) {
  }

  StateNames(data: any) {
    let res = ''
    for (let i = 0; i < data.length; i++) {
      res += data[i].name + ', '
    }
    return res
  }

  CityNames(data: any) {
    let res = ''
    for (let i = 0; i < data.length; i++) {
      res += data[i].name + ', '
    }
    return res
  }

  downloadCsv() {
    var i=0;
    for (const item of this.ZoneList){
      i = i + 1;
      var obj = {
        S_No: i,
        zone_name: item.zone_name,
        state: this.StateNames(item.state_name_zone),
        city: this.CityNames(item.city_name_zone),
        country: item.country.name,
        }
      this.LocationData.push(obj);
    }

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      headers: ["S.No","Zone Name","State","City","Country"]
    };
    new ngxCsv(this.LocationData,"ZoneList", options);
    window.location.reload();
  }
  
  downloadPdf() {
    var i=0;
    for (const item of this.ZoneList){
      i = i + 1;
      var obj = [
        i,
        item.zone_name,
        this.StateNames(item.state_name_zone),
        this.CityNames(item.city_name_zone),
        item.country.name
      ]
      this.LocationData.push(obj);
    }
   var  header= [["S.No.","Zone Name","State","City","Country"]];
    var doc = new jsPDF();
  (doc as any).autoTable({  head: header, body:this.LocationData,styles: {overflow: 'linebreak',
  fontSize: 10} })
  doc.save("Zone List");
  this.LocationData=[];

  }
}

