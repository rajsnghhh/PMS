import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-multiple-items',
  templateUrl: './multiple-items.component.html',
  styleUrls: ['./multiple-items.component.scss',
  '../../../../../assets/scss/scrollableTable.scss',
]
})
export class MultipleItemsComponent implements OnInit{

  restrictData: any = [];
  localStorageData: any;
  materialTypeList: any;
  materialSubTypeList:any;
  unitList:any;
  taxHeads:any;
  hsnList:any;
  finalRequestData: any = [];
  isButtonDisabled: boolean = false;
  isAdd: boolean = false;
  isDelete: boolean = false;
  materialList: Array<any> = [];

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private router: Router,
    private procurementAPIService:PROCUREMENTAPIService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewMaterialList();
    this.restrictData.push({
      materialType: '',
      description: '',
      group: '',
      subGroup:'',
      sapMaterialCode: '',
      name: '',
      unit:'',
      hsn:'',
      remarks:''
    });
    this.getMaterialParent();
    this.getTaxHeadData();
    this.getUnitDetails();
    this.getHsnList();
  }

  ngOnChanges(){

    for(let i = 0; i < this.restrictData.length; i++){
      if(this.restrictData[i].materialType === '' ||
      this.restrictData[i].description === '' ||
      this.restrictData[i].group === '' ||
      this.restrictData[i].subGroup === '' ||
      this.restrictData[i].sapMaterialCode === '' ||
      this.restrictData[i].name === '' ||
      this.restrictData[i].unit === '' ||
      this.restrictData[i].hsn === '' ||
      this.restrictData[i].remarks === ''){
        this.isAdd = true
      }else{
        this.isDelete = true
      }
    }
  }

  addRow() {
    for(let i = 0; i < this.restrictData.length; i++){
      if(this.restrictData[i].group === '' || this.restrictData[i].name === '' || this.restrictData[i].unit === ''){
        this.isButtonDisabled = true;
      }else {
        this.isButtonDisabled = false;
      }
    }
    if(this.isButtonDisabled === false){
      this.changeStructure(this.restrictData);
        let request = {
          materials: this.finalRequestData
        }
        this.apiservice.addBulkItem(request).subscribe(data => {
          this.toastrService.success("Multiple Items Created Successfully", '', {
            timeOut: 2000,
          });
          this.viewMaterialList()
        })
    }


    this.restrictData.push({
      materialType: '',
      description: '',
      group: '',
      subGroup:'',
      sapMaterialCode: '',
      name: '',
      unit:'',
      hsn:'',
      remarks:''
    });

    
  }

  deleteRow(index: any) {
    this.restrictData.splice(index, 1);
  }

  viewMaterialList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.materialList = data.results;
      
    })
  }

  onSave() {
    for(let i = 0; i < this.restrictData.length; i++){
      if(this.restrictData[i].group === '' || this.restrictData[i].name === '' || this.restrictData[i].unit === ''){
        this.isButtonDisabled = true;
      }else {
        this.isButtonDisabled = false;
      }
    }
    if(this.isButtonDisabled === false){
      this.changeStructure(this.restrictData);
      let request = {
        materials: this.finalRequestData
      }
      this.apiservice.addBulkItem(request).subscribe(data => {
        this.toastrService.success("Multiple Items Created Successfully", '', {
          timeOut: 2000,
        });
        this.router.navigateByUrl('/pms/settings/material-management');
      })
    }
  }

  changeStructure(data: any) {
    this.finalRequestData = [];
    for (let val of data) {
      var obj: any = {
        organization: this.localStorageData.organisation_details[0].id,
        materialtype:val.materialType,
        material_descriptions: val.description,
        material_type: val.subGroup === null || val.subGroup === ''? val.group : val.subGroup,
        sap_code: val.sapMaterialCode,
        material_name: val.name,
        unit_of_mesurement: val.unit,
        hsncode: val.hsn,
        remarks: val.remarks,
      }
      this.finalRequestData.push(obj);
    }
  }

  getHsnList() {
    let params = new URLSearchParams();
    this.apiservice.getHSNList(params).subscribe(data => {
      this.hsnList = data.results;
    })
  }

  getTaxHeadData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.procurementAPIService.getTaxHeadDetails(params).subscribe(data => {
    this.taxHeads = data.results;
    });
  }

  getUnitDetails() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.unitList = data.results;
    })
  }

  getMaterialParent() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent__isnull', 'true');
    params.set('page', '1');
    params.set('page_size', '1000');
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialTypeList = data.results;
    })
  }

  typeChange(typeid: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('parent', typeid);
    params.set('page', '1');
    params.set('page_size', '1000');

    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.materialSubTypeList = data.results;      
    })
  }

}
