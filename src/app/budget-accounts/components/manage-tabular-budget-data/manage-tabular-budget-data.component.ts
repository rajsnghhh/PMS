import { Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-manage-tabular-budget-data',
  templateUrl: './manage-tabular-budget-data.component.html',
  styleUrls: ['./manage-tabular-budget-data.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class ManageTabularBudgetDataComponent {
  localStorageData: any;
  projectId: any;
  chainageId: any;
  projectName: any;
  projectCode: any;
  projectList: Array<any> = [];
  getAccountsBudgetGetList: Array<any> = [];

  chainageDataForCalculation: Array<any> = [];
  calculated_chainage_intervals: Array<any> = [];
  item_act_subAct_list: Array<any> = [];
  items: Array<any> = [];
  hideShowChildRow: any;

  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuData: any;
  selectedDate: any
  private saveDataSubject = new Subject<any>();

  tableHeaders: string[] = ['', 'Item/ Activity/ Sub Activity', 'Code', 'UOM', 'Qty.', 'Rate', 'Budgeted Amt',
    'Consumed Qty', 'Consumption Amt', 'Rate/ Qty Consumed', 'Qty. Left', 'Budget Left (Rs.)'
  ];
  // tableProps = ['action', 'activity', 'code'];

  @ViewChildren('inputField') inputFields!: QueryList<ElementRef>;


  ngAfterViewInit() {
    this.inputFields.first.nativeElement.focus();
  }


  constructor(
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService) {
    this.saveDataSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((dataWithIndex) => ({ data: dataWithIndex.data, index: dataWithIndex.index })),
        switchMap(async (dataWithIndex) => this.onCellEdit(dataWithIndex.data, dataWithIndex.index))
      )
      .subscribe();
  }

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
      this.projectName = data.result[0].project_name
      this.projectCode = data.result[0].project_code
      this.chainageDataForCalculation = data.result;

      this.callGetBudgetAPIFirstTime()
    })
  }

  callGetBudgetAPIFirstTime() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.projectId);
    params.set('order_by', 'ordering');
    // params.set('flat', '1');
    // params.set('latest_version', '1');
    // params.set('entry_date', new Date().toISOString().slice(0, 10));

    this.item_act_subAct_list = []
    this.apiservice.getAccountsBudget(params).subscribe(data => {

      this.getAccountsBudgetGetList = data.results;

      this.item_act_subAct_list = data.results
      this.items = data.results


      if (this.getAccountsBudgetGetList?.length == 0) {
        this.seed_data()
      }

    })
  }

  seed_data() {
    //get project name and code from project-data API 
    let obj = {
      organization: this.localStorageData.organisation_details[0].id,
      project: this.projectId,
      financialyear: this.localStorageData.financial_year[0].id,
      entry_date: new Date().toISOString().slice(0, 10),
      activity: this.projectName,
      code: this.projectCode,
      is_header: true,
      ordering: 0,
      tab_count: 0,
      is_visible: true
    }
    this.apiservice.addAccountsBudget(obj).subscribe((res: any) => {
      if (res?.results?.data?.id) {
        this.calculateChainageIntervals(res?.results?.data?.id)
      }
    })

  }


  calculateChainageIntervals(parentId: any): number[] {
    const numIntervals = ((parseFloat(this.chainageDataForCalculation[0]?.project_end_in_kms) - parseFloat(this.chainageDataForCalculation[0]?.project_start_in_kms)) / parseFloat(this.chainageDataForCalculation[0]?.chainage_details_kms));
    let emptyObj: any = [];

    let psf = parseFloat(this.chainageDataForCalculation[0]?.project_start_in_kms)
    let chainage = parseFloat(this.chainageDataForCalculation[0]?.chainage_details_kms)
    let _val = psf
    const requests = [];
    for (let index = 0; index < numIntervals; index++) {
      emptyObj.push(`${_val} to ${_val + chainage}`)
      _val = _val + chainage

      const res = emptyObj[emptyObj.length - 1];
      const chainageInterval = `CHAINAGE ${index + 1} (kms - ${res})`;
      const code = `${this.projectCode}-${index + 1}`;
      requests.push(
        this.apiservice.addAccountsBudget({
          organization: this.localStorageData.organisation_details[0].id,
          project: this.projectId,
          financialyear: this.localStorageData.financial_year[0].id,
          entry_date: new Date().toISOString().slice(0, 10),
          activity: chainageInterval,
          code: code,
          parent: parentId,
          ordering: index + 1,
          tab_count: 1,
          is_visible: true
        })
      );
    }

    forkJoin(requests).subscribe((results: any[]) => {
      this.callGetBudgetAPI(); // Call this once after all requests are done
    });

    this.calculated_chainage_intervals = emptyObj;

    return emptyObj;
  }

  callGetBudgetAPI() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('project', this.projectId);
    params.set('order_by', 'ordering');
    // params.set('flat', '1');
    params.set('hideLoader', 'true');

    // params.set('latest_version', '1');

    this.item_act_subAct_list = []
    this.apiservice.getAccountsBudget(params).subscribe(data => {


      this.getAccountsBudgetGetList = data.results;

      this.item_act_subAct_list = this.getAccountsBudgetGetList
      this.items = this.getAccountsBudgetGetList
    })
  }

  onDataChange(data: any, index: any) {
    this.saveDataSubject.next({ data: data, index: index });
  }


  onCellEdit(data: any, index: any) {
    data.budgeted_amount = data.qty * data.rate
    data.rate_qty_consumed = data.consumption_amount / data.consumption_qty
    data.qty_left = data.qty - data.consumption_qty
    data.budget_left = data.budgeted_amount - data.consumption_amount


    if (!data.id) {
      let obj = {
        organization: this.localStorageData.organisation_details[0].id,
        project: this.projectId,
        financialyear: this.localStorageData.financial_year[0].id,
        chainage_no: data.chainage_no,
        code: data.code ? data.code : '',
        activity: data.activity ? data.activity : '',
        entry_date: new Date().toISOString().slice(0, 10),
        parent: data.parent_id,
        tab_count: data.tab_count,
        is_header: data.is_header,
        qty: data.qty,
        rate: data.rate,
        budgeted_amount: data.budgeted_amount,
        consumption_qty: data.consumption_qty,
        consumption_amount: data.consumption_amount,
        rate_qty_consumed: data.rate_qty_consumed,
        qty_left: data.qty_left,
        budget_left: data.budget_left,
        uom_txt: data.uom_txt

      }
      this.apiservice.addAccountsBudget(obj).subscribe((res: any) => {
        this.item_act_subAct_list[index] = res.results.data
        this.items[index] = res.results.data

        // this.item_act_subAct_list.splice(index, 0, res.results.data)
        // this.saveDataSubject.next({ data: res.results.data, index: index });

        this.setOrderData(this.items, index)
      })

    } else {

      let obj = {
        organization: this.localStorageData.organisation_details[0].id,
        project: this.projectId,
        financialyear: this.localStorageData.financial_year[0].id,
        // chainage_no: this.chainage_no,
        // chainage_text: this.chainage_text,
        // budgeted_amount: data.budgeted_amount ? data.budgeted_amount : 0,
        // consumption_amount: data.consumption_amount ? data.consumption_amount : 0,
        code: data.code ? data.code : '',
        activity: data.activity ? data.activity : '',
        // variations: data.variations ? data.variations : 0,
        entry_date: new Date().toISOString().slice(0, 10),
        // ordering: data.ordering,
        tab_count: data.tab_count,
        qty: data.qty,
        rate: data.rate,
        budgeted_amount: data.budgeted_amount,
        consumption_qty: data.consumption_qty,
        consumption_amount: data.consumption_amount,
        rate_qty_consumed: data.rate_qty_consumed,
        qty_left: data.qty_left,
        budget_left: data.budget_left,
        uom_txt: data.uom_txt
      }
      this.apiservice.updateAccountsBudget(obj, data.id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        // this.items[index] = res.results.data
        // this.setOrderData(this.items, index)

        // this.callGetBudgetAPI()
      })
    }

  }


  hideShowChildRows(state: any, item: any) {
    if (state == 'plus') {
      this.hideShowChildRow = true
      // item.expanded = !item.expanded;
      this.showHideRowRecursive(item)
      // this.expanded(item)
    } else {
      this.hideShowChildRow = false
      // item.expanded = !item.expanded;
      this.showHideRowRecursive(item)
      // this.expanded(item)
    }
  }

  showHideRowRecursive(data: any) {
    data?.children_details?.forEach((res: any) => {
      res.is_visible = this.hideShowChildRow; // Update visibility based on the expanded flag
      if (res.children_details) {
        // Recursively call showHideRowRecursive for each child node
        this.showHideRowRecursive(res);
      }
    });

    // Update UI with new visibility settings
    this.setVisibility(data?.children_details)
  }

  setVisibility(getAccountsBudgetGetList: any) {
    const updateOrderingMap = getAccountsBudgetGetList.map((item: any) => {
      return { id: item.id, is_visible: item.is_visible };
    });
    this.setData(updateOrderingMap);

  }

  setData(updateOrderingMap: any) {
    this.apiservice.updateAccountsBudgetOrdering(updateOrderingMap).subscribe((res: any) => {
      if (res.request_status == 1) {
        this.callGetBudgetAPI()

      }

    })
  }

  setOrderData(item_act_subAct_list: any, index: any) {

    const updateOrderingMap = item_act_subAct_list.map((item: any, index: any) => {
      const container: any = {};

      container.index = index;
      container.id = item.id;

      return container;
    })

    // let updateOrderingMap = [{
    //   index: index,
    //   id: item_act_subAct_list.id
    // }]


    this.apiservice.updateAccountsBudgetOrdering(updateOrderingMap).subscribe((res: any) => {
      if (res.request_status == 1) {

        const inputs = this.inputFields.toArray();

        // Calculate the index of the next input field in the row
        const nextIndex = (index) % inputs.length;

        // Set focus on the next input field
        inputs[nextIndex].nativeElement.focus();
        // this.focusOnNext()

        // this.callGetBudgetAPI()

      }

    })
  }

  onRightClick(event: MouseEvent, data: any) {
    event.preventDefault();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuData = data;

    this.contextMenuVisible = true;
  }

  addRowUp() {
    this.contextMenuVisible = false;
    const clickedIndex = this.items.indexOf(this.contextMenuData);

    const newRow = {
      is_visible: true,
      activity: '',
      code: '',
      parent_id: this.contextMenuData.parent_id ? this.contextMenuData.parent_id : this.contextMenuData.parent,
      tab_count: this.contextMenuData.tab_count,
      chainage_no: this.contextMenuData.chainage_no,
      is_header: this.contextMenuData.is_header
    }
    // const updatedItems = [...this.items.slice(0, clickedIndex + 1), newRow, ...this.items.slice(clickedIndex + 1)];
    const updatedItems = [
      ...this.items.slice(0, clickedIndex),
      newRow,
      ...this.items.slice(clickedIndex)
    ];

    this.items = updatedItems;

  }

  addRowDown() {
    this.contextMenuVisible = false;

    const clickedIndex = this.items.indexOf(this.contextMenuData);
    const clickedTabCount = this.contextMenuData.tab_count;

    let nextIndex = clickedIndex;

    if (this.contextMenuData.children) {
      const totalLength = this.getTotalLength(this.contextMenuData.children_details);
      nextIndex += totalLength + 1
    } else {
      nextIndex = clickedIndex + 1
    }


    // if (this.contextMenuData.children) {
    //   while (nextIndex < this.items.length && this.items[nextIndex].tab_count !== clickedTabCount) {
    //     nextIndex++;
    //   }
    // }
    // let lastIndex = -1; // Initialize with -1

    // if (this.contextMenuData.children) {
    //   while (nextIndex < this.items.length && this.items[nextIndex].tab_count <= clickedTabCount + 1) {
    //     if (this.items[nextIndex].tab_count === clickedTabCount + 1) {
    //       lastIndex = nextIndex; // Update lastIndex when tab_count is found
    //     }
    //     nextIndex++;
    //   }
    // }

    // if (lastIndex !== -1) {
    //   // lastIndex will have the index of the last row with tab_count+1
    //   lastIndex = lastIndex + 1;
    // } else {
    //   lastIndex = clickedIndex + 1;
    //   console.log("No row found with tab_count + 1.");
    // }


    const newRow = {
      is_visible: true,
      activity: '',
      code: '',
      parent_id: this.contextMenuData.parent_id ? this.contextMenuData.parent_id : this.contextMenuData.parent,
      tab_count: clickedTabCount,
      chainage_no: this.contextMenuData.chainage_no,
      is_header: this.contextMenuData.is_header
    }

    // Insert the new row at the found index or at the end if no row with the same tab_count is found
    const updatedItems = [
      ...this.items.slice(0, nextIndex),
      newRow,
      ...this.items.slice(nextIndex)
    ];

    this.items = updatedItems;

  }

  getTotalLength(childrenDetails: any[]): number {
    let totalLength = childrenDetails.length;

    // Recursively traverse through each child array
    childrenDetails.forEach(child => {
      if (child.children_details) {
        totalLength += this.getTotalLength(child.children_details);
      }
    });

    return totalLength;
  }


  addChildRow() {
    this.contextMenuVisible = false;
    const clickedIndex = this.items.indexOf(this.contextMenuData);
    const clickedTabCount = this.contextMenuData.tab_count;

    let nextIndex = clickedIndex + 1;

    const newRow = {
      is_visible: true,
      activity: '',
      code: '',
      parent_id: this.contextMenuData.id,
      tab_count: clickedTabCount + 1,
      chainage_no: this.contextMenuData.chainage_no,
      is_header: false
    }

    const updatedItems = [
      ...this.items.slice(0, nextIndex),
      newRow,
      ...this.items.slice(nextIndex)
    ];

    this.items = updatedItems;

  }

  deleteRowData(data: any, index: any) {
    if (data.id) {
      this.apiservice.deleteAccountsBudget(data.id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        if (res.request_status == 1) {
          this.toastrService.success(Success_Messages.SuccessDelete, '', {
            timeOut: 2000,
          });
          this.callGetBudgetAPI()
        } else {
          this.toastrService.error('Error in Delete', '', {
            timeOut: 2000,
          });
        }
      })
    } else {
      this.items.splice(index, 1);

      // this.item_act_subAct_list = this.item_act_subAct_list.filter((x: any) => x.id);

    }


  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent) {
    if (!this.contextMenuVisible) {
      return;
    }

    // Check if the click was outside of the context menu
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.context-menu')) {
      this.contextMenuVisible = false;
    }
  }

  formatDate(event: any) {
    const inputValue: string = event.target.value;
    let formattedValue = '';

    if (inputValue.length <= 2) {
      formattedValue = inputValue.replace(/\D/g, '').slice(0, 2);
    } else if (inputValue.length <= 4) {
      formattedValue = inputValue.replace(/\D/g, '').slice(0, 2) + '/' + inputValue.replace(/\D/g, '').slice(2);
    } else {
      formattedValue = inputValue.replace(/\D/g, '').slice(0, 2) + '/' + inputValue.replace(/\D/g, '').slice(2, 4) + '/' + inputValue.replace(/\D/g, '').slice(4, 8);
    }

    this.selectedDate = formattedValue;
  }

  saveDatewiseBudget() {
    if (this.selectedDate) {
      let params = new URLSearchParams();
      params.set('organization_id', this.localStorageData.organisation_details[0].id);
      params.set('project', this.projectId);
      params.set('order_by', 'ordering');
      // params.set('flat', '1');
      params.set('hideLoader', 'true');
      // params.set('latest_version', '1');

      this.item_act_subAct_list = []
      this.apiservice.getAccountsBudget(params).subscribe(data => {
        this.getAccountsBudgetGetList = data.results;

        this.item_act_subAct_list = this.getAccountsBudgetGetList
        this.items = this.getAccountsBudgetGetList
        this.updateTable(data.results);
      })
    }
    const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
    if (closeButton) {
      (closeButton as HTMLElement).click();
    }

  }


  updateTable(data: any) {

    // Assuming data structure contains fields for rate, qty, and budgeted amount
    const qtyIndex = this.tableHeaders.findIndex(header => header === 'Qty.');
    const rateIndex = this.tableHeaders.findIndex(header => header === 'Rate');
    const budgetedIndex = this.tableHeaders.findIndex(header => header === 'Budgeted Amt');
    console.log(qtyIndex, rateIndex, budgetedIndex);


    if (rateIndex !== -1 && qtyIndex !== -1 && budgetedIndex !== -1) {
      // Add new headers and fields for the selected date
      const newQtyHeader = `${this.selectedDate} Qty`;
      const newRateHeader = `${this.selectedDate} Rate`;
      const newBudgetedHeader = `${this.selectedDate} Budgeted Amt`;
      console.log(this.tableHeaders);

      this.tableHeaders.splice(qtyIndex + 3, 0, newQtyHeader);
      this.tableHeaders.splice(rateIndex + 3, 0, newRateHeader);
      this.tableHeaders.splice(budgetedIndex + 3, 0, newBudgetedHeader);
      console.log(this.tableHeaders);

      //   // Update fields
      //   this.items.forEach(item => {
      //     item[newRateHeader] = data[item.code]?.rate || ''; // Assuming data contains rate for each item code
      //     item[newQtyHeader] = data[item.code]?.qty || ''; // Assuming data contains qty for each item code
      //     item[newBudgetedHeader] = data[item.code]?.budgetedAmount || ''; // Assuming data contains budgeted amount for each item code
      //   });
    }

  }

}
