import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-dropdown-wise-budget',
  templateUrl: './dropdown-wise-budget.component.html',
  styleUrls: ['./dropdown-wise-budget.component.scss',
    '../../../../../assets/scss/scrollableTable.scss'
  ]
})
export class DropdownWiseBudgetComponent {
  localStorageData: any;
  projectId: any
  chainageId: any
  activityId: any
  subactivityId: any
  projectList: Array<any> = [];
  chainageMasterList: Array<any> = [];
  activityMasterList: Array<any> = [];
  subactivityMasterList: Array<any> = [];
  tableHeaders: string[] = ['', 'Item/ Activity/ Sub Activity', 'Code', 'UOM', 'Qty.', 'Rate', 'Budgeted Amt',
    'Consumed Qty', 'Consumption Amt', 'Rate/ Qty Consumed', 'Qty. Left', 'Budget Left (Rs.)'
  ];

  selectedMaterObject: any = {}
  // 'projectId' : any,
  // 'chainageId' : any,
  // 'activityId' : any,
  // 'subActivityId' :any
  // }


  chainageIds: any
  activityIds: any
  projectName: any;
  chainage_name: any;
  activity_name: any
  subactivity_name: any


  fieldselections!: FormGroup
  // chainageMultiselectGroupList = [
  //   { id: '1', itemName: 'Chainage 1' },
  //   { id: '2', itemName: 'Chainage 2' },
  //   { id: '3', itemName: 'Chainage 3' }
  // ];

  // activityMultiselectGroupList = [
  //   { id: '1', itemName: 'Activity 1' },
  //   { id: '2', itemName: 'Activity 2' },
  //   { id: '3', itemName: 'Activity 3' }
  // ];
  // dropdownSettings: IDropdownSettings = {};
  dropdownSettings = {};
  chainageMasterListMultiple: Array<any> = []

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private elementRef: ElementRef,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.selectedMaterObject = {};
    this.getProjectList();
    this.callfieldselections()
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');
    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results;
    })


  }

  callfieldselections() {
    this.fieldselections = this.fb.group({
      projectset: [''],
      chainageset: [''],
      activityset: ['']
    })
  }

  onProjectChainage(projectID: any) {

    this.projectName = this.projectList.find((x: any) => x.id == projectID.target.value)?.project_data[1]?.value
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('project', projectID.target.value);
    this.selectedMaterObject.selectedProjectId = projectID;
    this.projectId = this.selectedMaterObject.selectedProjectId.target.value;
    // this.fieldselections.controls['projectset'].setValue( this.projectId )
    setTimeout(() => {
      this.fieldselections.patchValue({ projectset: this.projectId });
    }, 500);

    this.apiservice.getChainageMaster(params).subscribe((res: any) => {
      if (res.results) {
        this.setupMultiSelectOptions();

      }
      this.chainageMasterList = res?.results;

      // this.chainageMasterListMultiple = this.chainageMasterList.map(item => {
      //   return { id: item.id, name: item.name };
      // });


      // this.chainageMultiselectGroupList = res?.results
    })

    this.fieldselections.patchValue({ projectset: this.projectId });

  }

  onChainageActivity(chainageID: any) {

    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('chainage', chainageID.target.value);
    this.selectedMaterObject.selectedChainageId = chainageID;
 



    setTimeout(() => {
      this.fieldselections.patchValue({ chainageset: this.selectedMaterObject.selectedChainageId.target.value });
    }, 500);

    this.apiservice.getActivityMaster(params).subscribe((res: any) => {
      if (res.results) {
        this.setupMultiSelectOptions();

      }
      this.activityMasterList = res?.results;
    })
  }

  onActivitySubactivity(activityID: any) {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData.organisation_details[0].id);
    params.set('activity', activityID.target.value);
    this.selectedMaterObject.selectedActivityId = activityID;
    this.apiservice.getSubActivityMaster(params).subscribe((res: any) => {
      this.subactivityMasterList = res?.results;
    })
  }


  setupMultiSelectOptions() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  // onItemSelectChainage(itemList: any) { 

  //   this.chainageMasterList.filter(list => list.id == itemList?.id).forEach((x) => {
  //     x.isChecked = true;
  //   });
  // }

  // onItemDeSelectChainage(itemList: any) {
  //   this.chainageMasterList.filter(list => list.id == itemList?.id).forEach((x) => {
  //     x.isChecked = false;
  //   });
  // }

  // onSelectAllChainage() {
  //   this.chainageMasterList.forEach((x) => {
  //     x.isChecked = true;
  //   });
  // }

  // onItemDeSelectAllChainage() {
  //   this.chainageMasterList.forEach((x) => {
  //     x.isChecked = false;
  //   });
  // }


  submitChainage() {
    let obj = {
      name: this.chainage_name,
      ordering: 0,
      project: this.projectId,
      organization: this.localStorageData.organisation_details[0].id
    }

    this.apiservice.addChainageMaster(obj).subscribe((res: any) => { 
      if (res.request_status == 1) {
        this.toastrService.success(res?.msg);
        const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          (closeButton as HTMLElement).click();
        }
        this.getProjectList();
        this.onProjectChainage(this.selectedMaterObject.selectedProjectId);
        // location.reload()
      } else {
        this.toastrService.error(res?.msg);
      }

    })

  }

  // onItemSelectActivity(itemList: any) {
  //   this.activityMasterList.filter(list => list.id == itemList?.id).forEach((x) => {
  //     x.isChecked = true;
  //   });
  // }

  // onItemDeSelectActivity(itemList: any) {
  //   this.activityMasterList.filter(list => list.id == itemList?.id).forEach((x) => {
  //     x.isChecked = false;
  //   });
  // }

  // onSelectAllActivity() {
  //   this.activityMasterList.forEach((x) => {
  //     x.isChecked = true;
  //   });
  // }

  // onItemDeSelectAllActivity() {
  //   this.activityMasterList.forEach((x) => {
  //     x.isChecked = false;
  //   });
  // }


  submitActivity() {
 

    // var tt: Array<any> = []
    // this.chainageMasterList.filter(list => list.isChecked == true).forEach(x => {
    //   tt.push({
    //     chainage_ids: x.id
    //   });
    // });
    // const chainageIds = tt.map(item => item.chainage_ids);
 
    // const chainage_idsArray = this.chainageIds.split(",").map(Number);


    let obj = {
      chainage_ids: this.chainageIds,

      organization: this.localStorageData.organisation_details[0].id,
      name: this.activity_name,
      ordering: 0,
    }

    this.apiservice.addActivityMasterBulk(obj).subscribe((res: any) => { 
      if (res.request_status == 1) { 

        this.toastrService.success(res?.msg);
        // const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
 

        // if (closeButton) {
        //   (closeButton as HTMLElement).click();
        // }
        // location.reload()
        document.getElementById("model_close")?.click();
        this.onChainageActivity(this.selectedMaterObject.selectedChainageId);
      } else {
        this.toastrService.error(res?.msg);
      }

    })
  }

  submitSubActivity() {

    // var tt: Array<any> = []
    // this.activityMasterList.filter(list => list.isChecked == true).forEach(x => {
    //   tt.push({
    //     chainage_ids: x.id
    //   });
    // });
    // const activity_ids = tt.map(item => item.chainage_ids);

    // const activity_idsArray = this.activityIds.split(",").map(Number);
    let obj = {
      name: this.subactivity_name,
      ordering: 0,
      activity_ids: this.activityIds,
      organization: this.localStorageData.organisation_details[0].id
    }

    this.apiservice.addSubActivityMasterBulk(obj).subscribe((res: any) => {
      if (res.request_status == 1) {
        this.toastrService.success(res?.msg);
        // const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
        // if (closeButton) {
        //   (closeButton as HTMLElement).click();
        // }
        // location.reload()
        document.getElementById("model_close_sub_act")?.click();
        this.onActivitySubactivity(this.selectedMaterObject.selectedActivityId);
      } else {
        this.toastrService.error(res?.msg);
      }

    })
  }


}
