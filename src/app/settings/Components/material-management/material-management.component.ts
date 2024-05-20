import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Error_Messages, Success_Messages } from 'src/app/Shared/Config/config.const';
declare var window: any;

@Component({
  selector: 'app-material-management',
  templateUrl: './material-management.component.html',
  styleUrls: ['./material-management.component.scss',
    '../../../../assets/scss/scrollableTable.scss']
})
export class MaterialManagementComponent {

  scope = ''
  selectedID = ''
  localStorageData: any;
  materialList: Array<any> = [];
  userPermissions: any = {};
  pageSize: any = 100;
  page: any = 1;
  paginationValue: any;
  MaterialData: any = [];
  deleteMaterialId: any;
  offcanvasAdd: any;
  offcanvasedit: any;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewMaterialList();

    this.offcanvasAdd = new window.bootstrap.Offcanvas(
      document.getElementById('addMaterial')
    );
    this.offcanvasedit = new window.bootstrap.Offcanvas(
      document.getElementById('editMaterial')
    );
    
  }

  addNew() {
    this.scope = 'add'
  }


  viewMaterialList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.page)
    params.set('page_size', this.pageSize)

    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.materialList = data.results;
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

    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.materialList = data.results;    
    })

  }
  

  editMaterialData(editId:any){
    this.selectedID = editId
    this.scope = 'edit'
  }

  deleteMaterial(delId:any){
    this.deleteMaterialId = delId;
  }

  deleteAlertCompany() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('id', this.deleteMaterialId);
    params.set('method', 'delete');
    this.apiservice.deleteMaterial(params).subscribe((res: any) => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.viewMaterialList();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  downloadCsv(data:any) {
    var i = 0;
    for (const item of data) {
      i = i + 1;
      var obj = {
        S_No: i,
        Material_Code: item.material_code,
        SAP_Code: item.sap_code,
        Material_type: item.materialtype,
        Material_Name: item.material_name,
        MaterialGroup: this.getNames(item.material_group_details[0],'group'),
        materialSubGroup: this.getNames(item.material_group_details[0],'subgroup'),
        Material_Description: item.material_descriptions,
        Standard_Unit_of_Measurement_UOM: item.unit_of_mesurement_name,
        Material_Lead_Time: item.material_lead_time,
        Material_Tolerance_in_Percentage: item.material_tolerance,
        Material_HSN: item.hsncode,
        Material_remarks: item.remarks
      }
      this.MaterialData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: [
        "S.No.",
        "Material Code",
        "SAP Code",
        "Mat. Type",
        "Material Name",
        "Material Group",
        "Material Sub Group",
        "Material Description",
        "Unit of Measurement (UOM)",
        "Material Lead Time",
        "Material Tolerance in (%)",
        "HSN",
        "Remarks"
      ]
    };
    new ngxCsv(this.MaterialData, "MaterialList", options);
    // window.location.reload();
  }


  getNames(data:any,name:any) {
    if(data && name != '') {
      if(name == 'group') {
        if(data?.parent_details?.name) {
          return data.parent_details.name
        } else if(data.name) {
          return data.name
        }
      }
      if(name == 'subgroup') {
        if(data?.parent_details?.name && data.name) {
          return data.name
        }
      }
    } else {
      return ''
    }
    return ''
  }

  getalldata(scope:any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true')

    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      if(scope == 'pdf')  {
        this.downloadPdf(data.results)
      }
      if(scope == 'csv') {
        this.downloadCsv(data.results)
      }
    })
  }

  downloadPdf(data:any) {
    var i = 0;
    for (const item of data) {
      i = i + 1;
      var obj = [
        i,
        item.material_code,
        item.sap_code,
        item.materialtype,
        item.material_name,
        this.getNames(item.material_group_details[0],'group'),
        this.getNames(item.material_group_details[0],'subgroup'),
        item.material_descriptions,
        item.unit_of_mesurement_name,
        item.material_lead_time,
        item.material_tolerance,
        item.hsncode,
        item.remarks
      ]
      this.MaterialData.push(obj);
    }
    var header = [
      "S.No.",
      "Material Code",
      "SAP Code",
      "Mat. Type",
      "Material Name",
      "Material Group",
      "Material Sub Group",
      "Material Description",
      "Unit of Measurement (UOM)",
      "Material Lead Time",
      "Material Tolerance in (%)",
      "HSN",
      "Remarks"
    ];
    var pdfsize = 'a0';
    var doc = new jsPDF('p', 'pt', 'a4');
    (doc as any).autoTable({
      head: header, body: this.MaterialData,
      startY: 10,
      startX: 0,
       styles: {
        overflow: 'linebreak',
        fontSize: 2
      }
    })
    doc.save("Material List");
    this.MaterialData = [];
  }

  closeCanvas() {
    this.scope = ''
    this.selectedID = ''
    this.offcanvasAdd.hide();
    this.offcanvasedit.hide();
    this.viewMaterialList()
  }
}
