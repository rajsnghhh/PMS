import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-material-group-merge',
  templateUrl: './material-group-merge.component.html',
  styleUrls: ['./material-group-merge.component.scss',
  '../../../../../assets/scss/scrollableTable.scss',
  '../../../../../assets/scss/from-coomon.scss'
]
})

export class MaterialGroupMergeComponent implements OnInit {

  addUser: any = {
    groupfrom: '',
    groupto:'',
    vatax:false
  }
  localStorageData:any;
  itemGroupListTo:any;
  itemGroupListFrom:any;
  allGroupList:any;
  allItemGroupTo:any=[]
  allItemGroupFrom:any=[]
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
    this.apiservice.getMaterialTypeList(params).subscribe(data => {
      this.itemGroupListTo = data.results;
      this.itemGroupListFrom=data.results;
      this.allGroupList=data.results;
      this.setDeafLevelFrom();
      this.setDeafLevelTo();
    })
  }

  setDeafLevelFrom(fullobj?: any, parent?: string) {
    const children = this.itemGroupListFrom.filter((c:any) => c.parent == parent);
    if (children.length > 0) {
      children.map((c:any, index:any) => {
        const object: any = Object.assign({}, c, {
          deafLevel: fullobj ? fullobj.deafLevel + 1 : 0,
          index: (fullobj ? fullobj.index : 0) + index * Math.pow(0.1, c.deafLevel)
        })
        this.allItemGroupFrom.push(object);
        this.setDeafLevelFrom(object, object.id);
      });
    }
    return parent;
  }

  setDeafLevelTo(fullobj?: any, parent?: string) {
    const children = this.itemGroupListTo.filter((c:any) => c.parent == parent);
    if (children.length > 0) {
      children.map((c:any, index:any) => {
        const object: any = Object.assign({}, c, {
          deafLevel: fullobj ? fullobj.deafLevel + 1 : 0,
          index: (fullobj ? fullobj.index : 0) + index * Math.pow(0.1, c.deafLevel)
        })
        this.allItemGroupTo.push(object);
        this.setDeafLevelTo(object, object.id);
      });
    }
    return parent;
  }

  unitSelect(){
    this.itemGroupListTo=this.allGroupList;
    this.itemGroupListFrom=this.allGroupList;
    if(this.addUser.groupfrom){
      this.itemGroupListTo = this.itemGroupListTo.filter((x:any)=>(x.id != this.addUser.groupfrom));
      this.allItemGroupTo=[]
      this.setDeafLevelTo();
    }
    if(this.addUser.groupto){
      this.itemGroupListFrom = this.itemGroupListFrom.filter((x:any)=>(x.id != this.addUser.groupto));
      this.allItemGroupFrom=[]
      this.setDeafLevelFrom();
    }
  }

  
  setMyStyles( data:any) {
    let styles = {
      'margin-left': data*20 + 'px',
    };
    return styles;
  }

  mergeData() {

    this.fromUnitId=[];
    this.fromUnitId.push(this.addUser.groupfrom)
    let param={
      "type": "material_group",
      "from_id_list":this.fromUnitId,
      "to_id": this.addUser.groupto
    }
    this.apiservice.mergeUOMData(param).subscribe(data=>{
      this.toastrService.success('Group Merged Successfully', '', {
        timeOut: 2000,
      });
      this.router.navigateByUrl('/pms/settings/material-types-purchase');
    })
    
  }
  
}
