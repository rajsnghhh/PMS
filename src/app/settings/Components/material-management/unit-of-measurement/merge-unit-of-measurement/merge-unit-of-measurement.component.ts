import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-merge-unit-of-measurement',
  templateUrl: './merge-unit-of-measurement.component.html',
  styleUrls: ['./merge-unit-of-measurement.component.scss',
  '../../../../../../assets/scss/scrollableTable.scss',
  '../../../../../../assets/scss/from-coomon.scss'

]
})
export class MergeUnitOfMeasurementComponent implements OnInit {

  addUser: any = {
    unitfrom: '',
    unitto:'',
    vatax:false
  }
  localStorageData:any;
  uomList:any;
  uomListFrom:any;
  allUomList:any;
  fromUnitId:any=[];

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService:ToastrService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewUnitofMeasurement();
  }

  viewUnitofMeasurement() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getUOMList(params).subscribe(data => {
      this.uomList = data.results;
      this.uomListFrom=data.results;
      this.allUomList=data.results;
    })
  }

  unitSelect(){
    this.uomList=this.allUomList;
    this.uomListFrom=this.allUomList;
    if(this.addUser.unitfrom){
      this.uomList = this.uomList.filter((x:any)=>(x.id != this.addUser.unitfrom));
    }
    if(this.addUser.unitto){
      this.uomListFrom = this.uomListFrom.filter((x:any)=>(x.id != this.addUser.unitto));
    }
  }

  mergeData() {
    this.fromUnitId=[];
    this.fromUnitId.push(this.addUser.unitfrom)
    let param={
      "type": "uom",
      "from_id_list":this.fromUnitId,
      "to_id": this.addUser.unitto
    }
    this.apiservice.mergeUOMData(param).subscribe(data=>{
      this.toastrService.success('Unit Merged Successfully', '', {
        timeOut: 2000,
      });
      this.router.navigateByUrl('/pms/settings/unit-of-measurement-purchase');
    })

  }

}
