import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-add-tabular-budget-data',
  templateUrl: './add-tabular-budget-data.component.html',
  styleUrls: ['./add-tabular-budget-data.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class AddTabularBudgetDataComponent {
  localStorageData: any;
  projectId: any;
  chainageId: any;
  projectList: Array<any> = [];
  chainageDataForCalculation: Array<any> = [];
  ACTIVITY_GROUP: string = ''

  tableHeaders: string[] = ['Item/ Activity/ Sub Activity', 'Code', 'Budgeted Amount', 'Consumption Amount', 'Variance %'];
  tableProps = ['activity_group', 'code', 'budgeted_amount', 'consumption_amount', 'variance_per'];

  chainage_text: any;
  chainage_no: any;
  calculated_chainage_intervals: Array<any> = [];
  item_act_subAct_list: Array<any> = [];
  getAccountsBudgetGetList: Array<any> = [];
  addChildRowDataBoolean: Boolean = true;
  addRowDataBoolean: Boolean = false;

  pushChildThroughIndex: any;
  pushChildThroughOrdering: any;
  pushChildThroughParent: any;
  pushChildThroughActivityGrp: any;


  pushAfterChildCount: any;
  anotherOrderingForRow: any;


  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.getProjectList();
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');
    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results;
    })
  }

  getChainageDataForCalculations(projectID: any) {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData?.organisation_details[0]?.id);
    params.set('id', projectID.target.value);
    this.apiservice.getChainageList(params).subscribe(data => {
      this.chainageDataForCalculation = data.result;
    })
  }

  calculateChainageIntervals(): number[] {
    const numIntervals = ((parseFloat(this.chainageDataForCalculation[0]?.project_end_in_kms) - parseFloat(this.chainageDataForCalculation[0]?.project_start_in_kms)) / parseFloat(this.chainageDataForCalculation[0]?.chainage_details_kms));
    let emptyObj: any = [];

    let psf = parseFloat(this.chainageDataForCalculation[0]?.project_start_in_kms)
    let chainage = parseFloat(this.chainageDataForCalculation[0]?.chainage_details_kms)
    let _val = psf
    for (let index = 0; index < numIntervals; index++) {
      emptyObj.push(`${_val}-${_val + chainage}`)
      _val = _val + chainage
    }
    this.calculated_chainage_intervals = emptyObj

    return emptyObj
  }

  AddNewHeader() {
    this.item_act_subAct_list.push({ activity_group: '', code: '', budgeted_amount: '', consumption_amount: '', variance_per: '', is_header: true });
  }

  AddNewRow() {

    // this.anotherOrderingForRow = this.pushChildThroughOrdering

    if (this.pushAfterChildCount) {
      this.pushChildThroughIndex = this.pushChildThroughIndex + this.pushAfterChildCount

    }


    if (this.pushChildThroughIndex || this.pushChildThroughIndex === 0) {
      this.item_act_subAct_list.splice(this.pushChildThroughIndex + 1, 0, { activity_group: '', code: '', budgeted_amount: '', consumption_amount: '', variance_per: '', isChild: false });
      this.pushChildThroughIndex = '';
    } else {
      this.item_act_subAct_list.push({ activity_group: '', code: '', budgeted_amount: '', consumption_amount: '', variance_per: '', isChild: false });
    }


  }


  AddNewChildRow() {
    const newItem = { activity_group: '', code: '', budgeted_amount: '', consumption_amount: '', variance_per: '', isChild: true };

    // Calculate the index to insert the new item
    let insertIndex = this.pushChildThroughIndex + this.pushAfterChildCount + 1; // Insert after the specified row 
    if (this.item_act_subAct_list[insertIndex]?.isChild) {
      // If the row after the specified row is a child row, find the index of the next non-child row
      for (let i = insertIndex + 1; i < this.item_act_subAct_list.length; i++) {
        if (!this.item_act_subAct_list[i]?.isChild) {
          insertIndex = i;
          break;
        }
      }
    }

    // Insert the new item at the calculated index
    this.item_act_subAct_list.splice(insertIndex, 0, newItem);
  }


  addchildRowFromHere(data: any) {

    if (data.isChild) {
      this.addChildRowDataBoolean = true
      this.addRowDataBoolean = true
    } else {
      this.pushChildThroughOrdering = data.ordering
      this.pushChildThroughParent = data.id
      this.pushChildThroughActivityGrp = data.activity_group
      this.pushChildThroughIndex = this.item_act_subAct_list.indexOf(data)
      this.addChildRowDataBoolean = false
      this.addRowDataBoolean = false
      this.pushAfterChildCount = !data.children ? 0 : data.children.split(',').length
    }


    // if (data.is_header) {
    //   this.addChildRowDataBoolean = false
    // }

  }


  onChangeChainageIntervalText(chainage: any) {
    this.chainage_text = chainage.target.value
    this.chainage_no = this.calculated_chainage_intervals.indexOf(this.chainage_text);
    // this.getItem_Activity_SubActivity_List();
    this.getAccountsBudgetGetData()
  }

  // getItem_Activity_SubActivity_List() {
  //   let params = new URLSearchParams();
  //   params.set('organization_id', this.localStorageData.organisation_details[0].id);
  //   params.set('order_by', 'ordering');

  //   this.apiservice.getAccountsCostMaster(params).subscribe(data => {
  //     this.item_act_subAct_list = data.results;
  //     this.getAccountsBudgetGetData()

  //     this.item_act_subAct_list.forEach((res: any) => {
  //       res.code = '',
  //         res.budgeted_amt = '',
  //         res.consumption_amt = '',
  //         res.variance_amt = ''
  //     })

  //   })

  // }


  getAccountsBudgetGetData() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('chainage_no', this.chainage_no);
    params.set('project', this.projectId);
    params.set('order_by', 'ordering');
    params.set('flat', '1');
    params.set('entry_date', new Date().toISOString().slice(0, 10));
    // params.set('order_by_child', 'ordering_child');

    this.item_act_subAct_list = []
    this.apiservice.getAccountsBudget(params).subscribe(data => {
      this.getAccountsBudgetGetList = data.result;


      // const updateOrderingMap = this.getAccountsBudgetGetList.map((item, index) => {
      //   const container: any = {};

      //   container.index = index;
      //   container.id = item.id;

      //   return container;
      // })



      this.getAccountsBudgetGetList.forEach((res: any) => {
        if (res.parent_id) {
          res.activity_group = res.activity
          res.isChild = true
        }

        if (res.is_header == true) {
          res.consumption_amount = ''
          res.budgeted_amount = ''
          res.variance_per = ''
        }
      })

      // this.updateAccountsBudgetOrdering(updateOrderingMap)


      this.item_act_subAct_list = this.getAccountsBudgetGetList
      // this.item_act_subAct_list = []
      // this.getAccountsBudgetGetList.forEach((res: any) => {
      //   res.name = res.activity_group
      // })
      // this.item_act_subAct_list = this.getAccountsBudgetGetList
      if (this.getAccountsBudgetGetList.length == 0) {
        this.seed_data()
      }


    });
  }

  seed_data() {
    /////////  call master api
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('order_by', 'ordering');

    // this.apiservice.getAccountsCostMaster(params).subscribe(data => {
    //   this.item_act_subAct_list = data.results;

    //   this.item_act_subAct_list.forEach((res: any) => {
    //     //// call budget post 

    //     let obj = {
    //       organization: this.localStorageData.organisation_details[0].id,
    //       material: '',
    //       project: this.projectId,
    //       financialyear: this.localStorageData.financial_year[0].id,
    //       chainage_no: this.chainage_no,
    //       chainage_text: this.chainage_text,
    //       ordering: res.ordering ? res.ordering : 0,
    //       // activity: res.name ? res.name : '',
    //       entry_date: new Date().toISOString().slice(0, 10),
    //       activity_group: res.name ? res.name : ''
    //     }

    //     this.apiservice.addAccountsBudget(obj).subscribe((res: any) => {
    //       this.callGetBudgetAPI()
    //     })

    //   })



    // })

    this.apiservice.getAccountsCostMaster(params).subscribe(data => {
      this.item_act_subAct_list = data.results;

      const budgetRequests = this.item_act_subAct_list.map((res: any) => {
        let obj = {
          organization: this.localStorageData.organisation_details[0].id,
          material: '',
          project: this.projectId,
          financialyear: this.localStorageData.financial_year[0].id,
          chainage_no: this.chainage_no,
          chainage_text: this.chainage_text,
          ordering: res.ordering ? res.ordering : 0,
          entry_date: new Date().toISOString().slice(0, 10),
          activity_group: res.name ? res.name : ''
        };

        return this.apiservice.addAccountsBudget(obj);
      });

      forkJoin(budgetRequests).subscribe(() => {
        // All budget requests have completed
        this.callGetBudgetAPI(); // Call the function to fetch budget data
      });
    });



    /*   this.getAccountsBudgetGetList.forEach((res: any) => {
      res.name = res.activity_group
    })

    // this.item_act_subAct_list = this.getAccountsBudgetGetList

    data?.result?.forEach((resultItem: any) => {
      const correspondingItem =  this.getAccountsBudgetGetList.find((masterItem: any) => masterItem.name === resultItem.activity);

      if (correspondingItem) {
        correspondingItem.code = resultItem.code;
        correspondingItem.budgeted_amt = resultItem.budgeted_amount;
        correspondingItem.consumption_amt = resultItem.consumption_amount;
        correspondingItem.variance_amt = resultItem.variations;
        correspondingItem.entry_date = resultItem.entry_date;
      }
    }); */


  }

  callGetBudgetAPI() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('chainage_no', this.chainage_no);
    params.set('project', this.projectId);
    params.set('order_by', 'ordering');
    params.set('flat', '1');
    params.set('entry_date', new Date().toISOString().slice(0, 10));

    this.item_act_subAct_list = []
    this.apiservice.getAccountsBudget(params).subscribe(data => {
      this.getAccountsBudgetGetList = data.result;

      this.item_act_subAct_list = this.getAccountsBudgetGetList

    })
  }


  onCellEdit(data: any, index: any) {


    if (!data.activity_group && (data.code || data.budgeted_amount || data.consumption_amount)) {
      this.toastrService.error('Please enter item name', '', {
        timeOut: 3000,
      });
      return;
    }


    const exists = this.item_act_subAct_list.some((item: any, i: number) => {
      if (i !== index && item.activity_group === data.activity_group) {
        return true;
      }
      return false;
    });

    if (exists) {
      // this.item_act_subAct_list.splice(index, 1);
      this.toastrService.error('An item with the same name already exists', '', {
        timeOut: 3000,
      });
    } else {

      if (data.isChild == true) {
        if (!data.id) {
          let obj = {
            organization: this.localStorageData.organisation_details[0].id,
            material: '',
            project: this.projectId,
            financialyear: this.localStorageData.financial_year[0].id,
            chainage_no: this.chainage_no,
            chainage_text: this.chainage_text,
            budgeted_amount: data.budgeted_amount ? data.budgeted_amount : 0,
            consumption_amount: data.consumption_amount ? data.consumption_amount : 0,
            code: data.code ? data.code : '',
            activity: data.activity_group ? data.activity_group : '',
            // variations: data.variations ? data.variations : 0,
            entry_date: new Date().toISOString().slice(0, 10),
            activity_group: this.pushChildThroughActivityGrp,
            ordering: this.pushChildThroughOrdering,
            parent: this.pushChildThroughParent,
            is_header: data.is_header,
            // ordering_child: 0, //pending_
          }
          this.apiservice.addAccountsBudget(obj).subscribe((res: any) => {
            this.item_act_subAct_list[index] = res.results.data
            this.setData(this.item_act_subAct_list)

          })

        } else {
          let obj = {
            organization: this.localStorageData.organisation_details[0].id,
            material: '',
            project: this.projectId,
            financialyear: this.localStorageData.financial_year[0].id,
            chainage_no: this.chainage_no,
            chainage_text: this.chainage_text,
            budgeted_amount: data.budgeted_amount ? data.budgeted_amount : 0,
            consumption_amount: data.consumption_amount ? data.consumption_amount : 0,
            code: data.code ? data.code : '',
            activity: data.activity_group ? data.activity_group : '',
            // variations: data.variations ? data.variations : 0,
            entry_date: new Date().toISOString().slice(0, 10),
            is_header: data.is_header
            // activity_group: this.pushChildThroughActivityGrp,
            // ordering: this.pushChildThroughOrdering,
            // parent: this.pushChildThroughParent,
            // ordering_child: 0, //pending_
          }
          this.apiservice.updateAccountsBudget(obj, data.id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
            this.getAccountsBudgetGetData()
          })
        }

      } else {

        let obj = {
          organization: this.localStorageData.organisation_details[0].id,
          material: '',
          project: this.projectId,
          financialyear: this.localStorageData.financial_year[0].id,
          chainage_no: this.chainage_no,
          chainage_text: this.chainage_text,
          // ordering: data.ordering !== undefined ? data.ordering : this.getAccountsBudgetGetList.length - 1,
          // ordering: this.anotherOrderingForRow !== undefined ? this.anotherOrderingForRow : this.getAccountsBudgetGetList.length - 1,
          ordering: -1,
          budgeted_amount: data.budgeted_amount ? data.budgeted_amount : 0,
          consumption_amount: data.consumption_amount ? data.consumption_amount : 0,
          code: data.code ? data.code : '',
          is_header: data.is_header,
          // activity: data.name ? data.name : '',
          // variations: data.variations ? data.variations : 0,
          entry_date: new Date().toISOString().slice(0, 10),
          activity_group: data.activity_group ? data.activity_group : ''
        }

        if (data.ordering !== undefined) {
          obj.ordering = data.ordering
        } else if (this.anotherOrderingForRow !== undefined)
          obj.ordering = this.anotherOrderingForRow
        else {
          obj.ordering = this.getAccountsBudgetGetList.length - 1
        }



        if (!data.id) {
          this.apiservice.addAccountsBudget(obj).subscribe((res: any) => {
            this.item_act_subAct_list[index] = res.results.data
            this.setData(this.item_act_subAct_list)
          })
        } else {
          this.apiservice.updateAccountsBudget(obj, data.id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {

            this.getAccountsBudgetGetData()
          })
        }

      }

    }





  }


  deleteRowData(data: any, index: any) {
    if (data.id) {
      this.apiservice.deleteAccountsBudget(data.id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        if (res.request_status == 1) {
          this.toastrService.success(Success_Messages.SuccessDelete, '', {
            timeOut: 2000,
          });
          this.getAccountsBudgetGetData()
        } else {
          this.toastrService.error('Error in Delete', '', {
            timeOut: 2000,
          });
        }
      })
    } else {
      this.item_act_subAct_list.splice(index, 1);

      // this.item_act_subAct_list = this.item_act_subAct_list.filter((x: any) => x.id);

    }


  }

  // updateAccountsBudgetOrdering(obj: any) {
  //   this.apiservice.updateAccountsBudgetOrdering(obj).subscribe((res: any) => {
  //   })
  // }

  setData(getAccountsBudgetGetList: any) {
    const updateOrderingMap = getAccountsBudgetGetList.map((item: any, index: any) => {
      const container: any = {};

      container.index = index;
      container.id = item.id;

      return container;
    })


    this.apiservice.updateAccountsBudgetOrdering(updateOrderingMap).subscribe((res: any) => {
      if (res.request_status == 1) {
        this.getAccountsBudgetGetData()

      }


    })
  }

}
