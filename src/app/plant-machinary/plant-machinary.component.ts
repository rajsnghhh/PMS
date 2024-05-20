import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaginationService } from '../Shared/Services/pagination.service';
import { DataSharedService } from '../Shared/Services/data-shared.service';
import { APIService } from '../Shared/Services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error_Messages, Success_Messages } from '../Shared/Config/config.const';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
declare var window: any;
@Component({
  selector: 'app-plant-machinary',
  templateUrl: './plant-machinary.component.html',
  styleUrls: ['./plant-machinary.component.scss',
    '../../../src/assets/scss/from-coomon.scss',
    '../../../src/assets/scss/scrollableTable.scss']
})
export class PlantMachinaryComponent implements OnInit {
 
  
  @ViewChild('customscroll', { read: ElementRef })
  public customscroll!: ElementRef<any>;

 
  addGroup: any;
  editGroup: any;
  deleteGroup: any;
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;
  localStorageData: any;
  plantMachineryList: any = [];
  editItem: any;
  deleteId: any;
  PandMData: any = [];


  constructor(
    private datasharedservice: DataSharedService,
    private apiservice: APIService,
    private paginationservice: PaginationService,
    private toastrService: ToastrService,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.setupModalOfcanvas();
    this.viewPlantMachinery();
    this.datasharedservice.removeLocalData('tender_id')
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  setupModalOfcanvas() {
    this.deleteGroup = new window.bootstrap.Modal(
      document.getElementById('deleteGroup')
    );

    this.addGroup = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabelAddPlant')
    );

    this.editGroup = new window.bootstrap.Offcanvas(
      document.getElementById('offcanvasRightLabelEditPlant')
    );

  }

  addNewGroup(item: any) {
    if (item == null) {
      this.addGroup.show();
    } else {
      this.editItem = item;
      this.viewPlantMachinery();
      this.editGroup.show();
    }
  }

  closeAddCanvas() {
    this.viewPlantMachinery();
    if (this.editItem) {
      this.editGroup.hide()
    } else {
      this.addGroup.hide()
    }
  }

  deletePlantValue(item: any) {
    this.deleteId = item.id;
  }

  deletePlantModel() {
    this.apiservice.delPlantMachinery(this.deleteId, this.localStorageData.organisation_details[0].id).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessDelete, '', {
        timeOut: 2000,
      });
      this.viewPlantMachinery();
    }, err => {
      this.toastrService.error(Error_Messages.Failed_HTTP, '', {
        timeOut: 2000,
      });
    })
  }

  viewPlantMachinery() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getPlantMachineryList(params).subscribe(data => {
      this.paginationservice.setTotalItemData(data.count);
      this.plantMachineryList = data.results;      
    })
  }

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue?.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)

    this.apiservice.getPlantMachineryList(params).subscribe(data => {
      this.plantMachineryList = data.results;
    })
  }

  downloadCsv() {
    let hadderlist = ['Sl.NO']
    for (const item of this.plantMachineryList[0].plant_machinery_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.plantMachineryList.length; i++) {
      var obj = [i + 1]
      for (const inneritem of this.plantMachineryList[i].plant_machinery_data) {
        obj.push(inneritem.value)
      }
      this.PandMData.push(obj);
    }
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      headers: [hadderlist]
    };
    new ngxCsv(this.PandMData, "Plant&MachinaryList", options);
    window.location.reload();
  }

  downloadPdf() {
    let hadderlist = ['S.No']
    for (const item of this.plantMachineryList[0].plant_machinery_data) {
      hadderlist.push(item.form_label)
    }
    for (let i = 0; i < this.plantMachineryList.length; i++) {
      var obj = [i + 1]
      for (const inneritem of this.plantMachineryList[i].plant_machinery_data) {
        obj.push(inneritem.value)
      }
      this.PandMData.push(obj);
    }
    var header = [hadderlist];
    var pdfsize = 'a0';
    var doc = new jsPDF('p', 'pt', 'a4');
    (doc as any).autoTable({
      head: header, body: this.PandMData,
      startY: 10,
      startX: 0,
      styles: {
        overflow: 'linebreak',
        fontSize: 2,
      }
    })
    doc.save("Plant and Machinery List");
    doc.output('dataurlnewwindow')
    this.PandMData = [];
  }
  
  next() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }
 
  previous() {
    this.customscroll.nativeElement.scrollTo({ left: (this.customscroll.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

}
