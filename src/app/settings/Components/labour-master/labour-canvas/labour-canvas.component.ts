import { Component, Input, OnInit } from '@angular/core';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-labour-canvas',
  templateUrl: './labour-canvas.component.html',
  styleUrls: ['./labour-canvas.component.scss']
})
export class LabourCanvasComponent implements OnInit {
  @Input()
  fromData!: any;
  prefieldData:any
  tenderActionData:any
  localStorageData:any
  selectedTab:any 
  activeFromName:any
  ActionButtonName:any = 'Create'

  constructor(
    private datasharedservice:DataSharedService,
    private commonFunction:CommonFunctionService
  ) {

  }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
  }
  genarateTenderData(Data: any) {
    this.genarateTenderDataMain(Data,false)
  }

  proceedNext() {

  }

  genarateTenderDataMain(Data: any,callingForClieldUpdate:boolean) {
    let req = JSON.parse(Data)
    let form_datatest = new FormData();
    for (const [key, value] of Object.entries(req.data)) {
      if (value) {
        form_datatest.append(key, value.toString())
      }
    }
    let fileSet = this.datasharedservice.getObservableData1()
    for (var key in fileSet) {
      form_datatest.append(key, fileSet[key])
    }
    this.datasharedservice.setObservableData({})
    // let query = this.commonFunction.getURL(
    //   {
    //     organization_id: this.localStorageData.organisation_details[0].id,
    //     id: this.projectID,
    //     form_type: this.selectedTab,
    //   }
    // )
    // this.apiservice.saveProjectData(query,form_datatest).subscribe(data => {
    //   if(callingForClieldUpdate == true) {
    //     this.fieldvalue.callFromParent(); 
    //   } else {
    //     this.proceedNext()
    //   }
    // });

  }
}
