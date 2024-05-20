import { Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-entry-activity-budget',
  templateUrl: './entry-activity-budget.component.html',
  styleUrls: ['./entry-activity-budget.component.scss',
  '../../../../../assets/scss/scrollableTable.scss']
})
export class EntryActivityBudgetComponent {
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuData: any;
  localStorageData: any;
  projectId: any;
  projectList: Array<any> = [];
  accountsMaterialBudgetList: Array<any> = [];
  selectedDate: any;
  budgetName: any;
  userList: Array<any> = []

  private saveDataSubject = new Subject<any>();

  upperTableHeaders: Array<any> = [
    { title: 'MATERIAL BUDGET', colspan: 3 },
    // { title: 'BUDGET', colspan: 3 },
    { title: 'CONSUMPTION', colspan: 3 },
    { title: 'REMAINDER', colspan: 2 }
  ];

  tableHeaders: Array<any> = ['Material Code', 'Item Description', 'UOM',
    'Consumed Qty', 'Consumption Amount', 'Rate /Qty', 'Qty. left', 'Budget Left (Rs.)'
  ];
  /* 'Budgeted Qty.', 'Budgeted Rate', 'Budgeted Amt (Rs.)' */

  @ViewChildren('inputField') inputFields!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.inputFields.first.nativeElement.focus();
  }

  constructor(
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
    this.getUserList()
    this.accountsMaterialBudgetGetAPI('2')
  }

  getProjectList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('list', 'true');
    this.apiservice.getProjectList(params).subscribe(data => {
      this.projectList = data.results;
    })
  }

  getUserList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    this.apiservice.getAllUserList(params).subscribe(data => {
      this.userList = data
    })
  }


  accountsMaterialBudgetGetAPI(projectID: any) {
    let params = new URLSearchParams();
    params.set('organization', this.localStorageData?.organisation_details[0]?.id);
    params.set('project', projectID?.target?.value ? projectID?.target?.value : projectID);
    params.set('order_by', 'ordering');
    params.set('all', 'true');

    this.apiservice.getAccountsMaterialBudget(params).subscribe(data => {
      this.accountsMaterialBudgetList = data.results;

      // Remove budget-related table upperheaders
      const index = this.upperTableHeaders.findIndex(header => header.title === 'BUDGET');
      if (index !== -1) {
        this.upperTableHeaders.splice(index, 1);
      }
      // Remove budget-related table headers
      const headersToRemove = ['Budgeted Qty', 'Budgeted Rate', 'Budgeted Amt']; // Add more if needed
      this.tableHeaders = this.tableHeaders.filter(header => !headersToRemove.some(removeHeader => header.includes(removeHeader)));


      if (this.accountsMaterialBudgetList.length == 0) {
        this.budgetName = 'Add Budget'
        // Remove budget-related table upperheaders
        const index = this.upperTableHeaders.findIndex(header => header.title === 'BUDGET');
        if (index !== -1) {
          this.upperTableHeaders.splice(index, 1);
        }
        // Remove budget-related table headers
        const headersToRemove = ['Budgeted Qty', 'Budgeted Rate', 'Budgeted Amt']; // Add more if needed
        this.tableHeaders = this.tableHeaders.filter(header => !headersToRemove.some(removeHeader => header.includes(removeHeader)));

      } else {
        this.budgetName = 'Update Budget'
        this.accountsMaterialBudgetList.forEach((res: any) => {
          // add upperTableHeaders
          const index = this.upperTableHeaders.findIndex(header => header.title === 'MATERIAL BUDGET');
          if (index !== -1) {
            this.upperTableHeaders.splice(index + 1, 0, { title: 'BUDGET', colspan: res.breakdown.length * 3 });
          }
          const uniqueHeaders = this.upperTableHeaders.filter((header, index) => {
            return this.upperTableHeaders.findIndex(h => h.title === header.title) === index;
          });
          this.upperTableHeaders = uniqueHeaders

          var tt: any = []

          // add TableHeaders
          res.breakdown.forEach((breakdownItem: any) => {
            // breakdownItem.is_latest = false
            const latestEntry = res.breakdown[res.breakdown.length - 1]
            latestEntry.is_latest = true;

            const budgetedQty = `Budgeted Qty\n(${breakdownItem.entry_date})`;
            const budgetedRate = `Budgeted Rate\n(${breakdownItem.entry_date})`;
            const budgetedAmt = `Budgeted Amt\n(${breakdownItem.entry_date})`;


            const uomindex = this.tableHeaders.indexOf('UOM');

            if (uomindex !== -1) {
              // this.tableHeaders.splice(uomindex + 1, 0, budgetedQty, budgetedRate, budgetedAmt);
              tt.push(budgetedQty, budgetedRate, budgetedAmt);
            }

          });


          const uomindex = this.tableHeaders.indexOf('UOM');
          this.tableHeaders.splice(uomindex + 1, 0, ...tt)
          this.tableHeaders = Array.from(new Set(this.tableHeaders));
        })
      }


    })

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

    this.selectedDate = formattedValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1-$2-$3');
  }

  onKeyPress(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue: string = event.target.value;

    // Allow only numeric input, backspace, and dash
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 45) {
      event.preventDefault();
    }

    // Prevent entering more than 10 characters
    if (inputValue.length >= 10 && charCode !== 8) {
      event.preventDefault();
    }

  }

  onDataChange(data: any, index: any) {
    this.saveDataSubject.next({ data: data, index: index });
  }


  manageDatewiseBudget() {
    if (this.selectedDate) {
      let selectedDate = this.selectedDate.split('/').reverse().join('-')

      let params = new URLSearchParams();
      params.set('organization', this.localStorageData?.organisation_details[0]?.id);
      params.set('project', this.projectId);
      params.set('order_by', 'ordering');
      params.set('all', 'true');

      this.apiservice.getAccountsMaterialBudget(params).subscribe(data => {
        this.accountsMaterialBudgetList = data.results;

        if (this.accountsMaterialBudgetList.length == 0) {
          this.accountsMaterialBudgetList.push({
            start_date: selectedDate, material_code: '', item_desc: '', uom_text: '', qty_left: 0, budget_left: 0,
            breakdown: [{
              material_code: '',
              qty: 0,
              rate: 0,
              amount: 0,
              entry_date: selectedDate
            }],
            consumption_breakdown: [
              {
                material_code: '',
                consumed_qty: 0,
                consumed_amt: 0,
                consumed_rate: 0
              }
            ]
          });

          const index = this.upperTableHeaders.findIndex(header => header.title === 'MATERIAL BUDGET');
          if (index !== -1) {
            this.upperTableHeaders.splice(index + 1, 0, { title: 'BUDGET', colspan: 3 });
          }

          const budgetedQty = `Budgeted Qty\n(${selectedDate})`;
          const budgetedRate = `Budgeted Rate\n(${selectedDate})`;
          const budgetedAmt = `Budgeted Amt\n(${selectedDate})`;


          const uomindex = this.tableHeaders.indexOf('UOM');
          if (uomindex !== -1) {
            this.tableHeaders.splice(uomindex + 1, 0, budgetedQty, budgetedRate, budgetedAmt);
          }
          const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }


        } else {
          this.accountsMaterialBudgetList.forEach((data: any) => {
            const breakdown = data.breakdown;
            if (breakdown.length > 0) {
              const latestEntry = breakdown[breakdown.length - 1]
              data.breakdown.push({
                material_code: latestEntry.material_code,
                qty: latestEntry.qty,
                rate: latestEntry.rate,
                amount: latestEntry.amount,
                entry_date: selectedDate,
                is_latest: true
              })
            }
          })

          this.accountsMaterialBudgetList.forEach((res: any) => {
            const index = this.upperTableHeaders.findIndex(header => header.title === 'BUDGET');
            if (index !== -1) {
              this.upperTableHeaders[index].colspan = res.breakdown.length * 3;
            }

            var tt: any = [];

            res.breakdown.forEach((breakdownItem: any) => {

              const budgetedQty = `Budgeted Qty\n(${breakdownItem.entry_date})`;
              const budgetedRate = `Budgeted Rate\n(${breakdownItem.entry_date})`;
              const budgetedAmt = `Budgeted Amt\n(${breakdownItem.entry_date})`;


              const index = this.upperTableHeaders.findIndex(header => header.title === 'BUDGET');
              if (index !== -1) {
                this.upperTableHeaders[index].colspan = res.breakdown.length * 3;
              }

              const consumedQtyIndex = this.tableHeaders.indexOf('Consumed Qty');
              if (consumedQtyIndex !== -1) {
                tt.push(budgetedQty, budgetedRate, budgetedAmt);
                //   this.tableHeaders.splice(consumedQtyIndex, 0, budgetedQty, budgetedRate, budgetedAmt);
              }
            });
            const consumedQtyIndex = this.tableHeaders.indexOf('Consumed Qty');
            if (consumedQtyIndex !== -1) {
              this.tableHeaders.splice(consumedQtyIndex, 0, ...tt);
            }

          })

          this.tableHeaders = Array.from(new Set(this.tableHeaders));
          const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }

        }

      })
    }





    // if (this.selectedDate && this.accountsMaterialBudgetList.length == 0) {
    //   this.accountsMaterialBudgetList.push({
    //     start_date: this.selectedDate, material_code: '', item_desc: '', uom_text: '', qty_left: 0, budget_left: 0,
    //     breakdown: [{
    //       material_code: '',
    //       qty: 0,
    //       rate: 0,
    //       amount: 0,
    //       entry_date: this.selectedDate
    //     }],
    //     consumption_breakdown: [
    //       {
    //         material_code: '',
    //         consumed_qty: 0,
    //         consumed_amt: 0,
    //         consumed_rate: 0
    //       }
    //     ]
    //   });

    //   const index = this.upperTableHeaders.findIndex(header => header.title === 'MATERIAL BUDGET');
    //   if (index !== -1) {
    //     this.upperTableHeaders.splice(index + 1, 0, { title: 'BUDGET', colspan: 3 });
    //   }

    //   const budgetedQty = `Budgeted Qty\n(${this.selectedDate.split('/').reverse().join('-')})`;
    //   const budgetedRate = `Budgeted Rate\n(${this.selectedDate.split('/').reverse().join('-')})`;
    //   const budgetedAmt = `Budgeted Amt\n(${this.selectedDate.split('/').reverse().join('-')})`;

    //   const uomindex = this.tableHeaders.indexOf('UOM');
    //   if (uomindex !== -1) {
    //     this.tableHeaders.splice(uomindex + 1, 0, budgetedQty, budgetedRate, budgetedAmt);
    //   }
    //   const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
    //   if (closeButton) {
    //     (closeButton as HTMLElement).click();
    //   }

    // } else {
    //   const dateString = this.selectedDate;
    //   const parts = dateString.split("/");
    //   const year = parseInt(parts[2]);
    //   const month = parseInt(parts[1]) - 1;
    //   const day = parseInt(parts[0]);

    //   // Construct a Date object
    //   const selectedDate = new Date(year, month, day);

    //   // Check if selectedDate is a valid Date object
    //   if (!(selectedDate instanceof Date && !isNaN(selectedDate.getTime()))) {
    //     this.toastrService.error('Entered date is not valid', '', {
    //       timeOut: 2000,
    //     });
    //   } else if (this.accountsMaterialBudgetList.length > 0 && this.accountsMaterialBudgetList[0].breakdown) {
    //     let validationFailed = false;

    //     this.accountsMaterialBudgetList[0].breakdown.forEach((res: any) => { 
    //       const entryDate = new Date(res.entry_date);

    //       if (!(entryDate instanceof Date && !isNaN(entryDate.getTime()))) {
    //         this.toastrService.error('Entered date is not valid', '', {
    //           timeOut: 2000,
    //         });
    //         validationFailed = true;
    //         return;
    //       }

    //       if (entryDate.getTime() >= selectedDate.getTime()) {
    //         validationFailed = true;
    //         return;
    //       }
    //     });

    //     if (validationFailed) {
    //       this.toastrService.error('Entered date is not valid', '', {
    //         timeOut: 2000,
    //       });
    //     } else {
    //       this.toastrService.success('New set of budgeted columns are added', '', {
    //         timeOut: 3000,
    //       });


    //       const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
    //       if (closeButton) {
    //         (closeButton as HTMLElement).click();
    //       }
    //       this.accountsMaterialBudgetList.forEach((res: any) => {
    //         res.breakdown.push({
    //           material_code: '',
    //           qty: 0,
    //           rate: 0,
    //           amount: 0,
    //           entry_date: this.selectedDate.split('/').reverse().join('-')
    //         })
    //       })


    //       this.accountsMaterialBudgetList.forEach((res: any) => {
    //         const index = this.upperTableHeaders.findIndex(header => header.title === 'BUDGET');
    //         if (index !== -1) {
    //           this.upperTableHeaders[index].colspan = res.breakdown.length * 3;
    //         }

    //         res.breakdown.forEach((breakdownItem: any) => {
    //           const budgetedQty = `Budgeted Qty\n(${breakdownItem.entry_date})`;
    //           const budgetedRate = `Budgeted Rate\n(${breakdownItem.entry_date})`;
    //           const budgetedAmt = `Budgeted Amt\n(${breakdownItem.entry_date})`;


    //           const index = this.upperTableHeaders.findIndex(header => header.title === 'BUDGET');
    //           if (index !== -1) {
    //             this.upperTableHeaders[index].colspan = res.breakdown.length * 3;
    //           }

    //           const consumedQtyIndex = this.tableHeaders.indexOf('Consumed Qty');
    //           if (consumedQtyIndex !== -1) {
    //             this.tableHeaders.splice(consumedQtyIndex, 0, budgetedQty, budgetedRate, budgetedAmt);
    //           }
    //         });

    //       })

    //       this.tableHeaders = Array.from(new Set(this.tableHeaders));


    //     }



    //   }
    // }

  }

  onCellEdit(data: any, index: any) {

    data.breakdown.forEach((res: any) => {
      res.amount = res.qty * res.rate
    })

    const mappedBreakdown = data.breakdown.map((item: any) => {
      const mappedItem: any = {
        material_code: data.material_code,
        qty: item.qty || 0,
        rate: item.rate || 0,
        amount: item.amount || 0,
        entry_date: item.entry_date
      };

      if (item.id) {
        mappedItem.id = item.id;
      }

      return mappedItem;
    });

    data.consumption_breakdown[0].consumed_rate = data?.consumption_breakdown[0]?.consumed_amt / data?.consumption_breakdown[0]?.consumed_qty

    if (!data.id) {
      let obj = {
        material_code: data.material_code,
        item_desc: data.item_desc,
        uom_text: data.uom_text,
        project: this.projectId,
        start_date: data.start_date,
        organization: this.localStorageData?.organisation_details[0]?.id,
        qty_left: data.qty_left,
        budget_left: data.budget_left,
        breakdown: mappedBreakdown,
        consumption_breakdown: [
          {
            material_code: data.material_code,
            consumed_qty: data.consumption_breakdown[0].consumed_qty ? data.consumption_breakdown[0].consumed_qty : 0,
            consumed_amt: data.consumption_breakdown[0].consumed_amt ? data.consumption_breakdown[0].consumed_amt : 0,
            consumed_rate: data.consumption_breakdown[0]?.consumed_rate ? data.consumption_breakdown[0]?.consumed_rate : 0
          }
        ]
      }
      this.apiservice.addAccountsMaterialBudget(obj).subscribe((res: any) => {
        this.accountsMaterialBudgetList[index] = res.results.data
        this.budgetName = 'Update Budget'
        // this.accountsMaterialBudgetList[index] = res.results.data

        this.setOrderData(this.accountsMaterialBudgetList, index)
      })

    } else {
      let obj = {
        material_code: data.material_code,
        item_desc: data.item_desc,
        uom_text: data.uom_text,
        project: this.projectId,
        start_date: data.start_date,
        qty_left: data.qty_left,
        budget_left: data.budget_left,
        breakdown: mappedBreakdown,
        consumption_breakdown: [
          {
            id: data.consumption_breakdown[0].id ? data.consumption_breakdown[0].id : '',
            material_code: data.material_code,
            consumed_qty: data.consumption_breakdown[0].consumed_qty ? data.consumption_breakdown[0].consumed_qty : 0,
            consumed_amt: data.consumption_breakdown[0].consumed_amt ? data.consumption_breakdown[0].consumed_amt : 0,
            consumed_rate: data.consumption_breakdown[0].consumed_rate ? data.consumption_breakdown[0].consumed_rate : 0
          }
        ]
      }
      this.apiservice.updateAccountsMaterialBudget(obj, data.id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {

        // this.accountsMaterials[index] = res.results.data
        // this.accountsMaterialBudgetList[index] = res.results.data
        // this.setOrderData(this.accountsMaterialBudgetList, index)

        // this.callGetBudgetAPI()
      })
    }

  }


  setOrderData(item_act_subAct_list: any, index: any) {
    const updateOrderingMap = item_act_subAct_list.map((item: any, index: any) => {
      const container: any = {};

      container.index = index;
      container.id = item.id;

      return container;
    })

    this.apiservice.updateAccountsMaterialOrdering(updateOrderingMap).subscribe((res: any) => {
      if (res.request_status == 1) {

        const inputs = this.inputFields.toArray();
        const nextIndex = (index) % inputs.length;
        inputs[nextIndex].nativeElement.focus();
        // this.callGetBudgetAPI()

      }

    })
  }


  deleteRowData(data: any, index: any) {
    if (data.id) {
      this.apiservice.deleteAccountsMaterialBudget(data.id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        if (res.request_status == 1) {
          this.toastrService.success(Success_Messages.SuccessDelete, '', {
            timeOut: 2000,
          });
          this.accountsMaterialBudgetGetAPI(this.projectId)
        } else {
          this.toastrService.error('Error in Delete', '', {
            timeOut: 2000,
          });
        }
      })
    } else {
      this.accountsMaterialBudgetList.splice(index, 1);
      this.accountsMaterialBudgetGetAPI(this.projectId)
    }

  }


  onRightClick(event: MouseEvent, data: any) {
    event.preventDefault();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuData = data;
    this.contextMenuVisible = true;
  }

  addRowAbove() {
    this.contextMenuVisible = false;
    const clickedIndex = this.accountsMaterialBudgetList.indexOf(this.contextMenuData);

    let nextIndex = clickedIndex === 0 ? 0 : clickedIndex;

    const newBreakdown = this.contextMenuData.breakdown.map((item: any) => ({
      material_code: '',
      qty: '',
      rate: '',
      amount: '',
      entry_date: item.entry_date
    }));

    const new_consumption_breakdownwn = this.contextMenuData.consumption_breakdown.map((item: any) => ({
      material_code: '',
      consumed_qty: '',
      consumed_amt: '',
      consumed_rate: ''
    }));


    const newRow = {
      start_date: this.contextMenuData.start_date,
      material_code: '',
      item_desc: '', uom_text: '', qty_left: 0, budget_left: 0,

      breakdown: newBreakdown,
      consumption_breakdown: new_consumption_breakdownwn
    }

    // Insert the new row at the end of found index 

    const updatedItems = [
      ...this.accountsMaterialBudgetList.slice(0, nextIndex),
      newRow,
      ...this.accountsMaterialBudgetList.slice(nextIndex)
    ];

    this.accountsMaterialBudgetList = updatedItems;
  }


  addRowBelow() {
    this.contextMenuVisible = false;
    const clickedIndex = this.accountsMaterialBudgetList.indexOf(this.contextMenuData);

    let nextIndex = clickedIndex + 1;

    const newBreakdown = this.contextMenuData.breakdown.map((item: any) => ({
      material_code: '',
      qty: '',
      rate: '',
      amount: '',
      entry_date: item.entry_date
    }));

    const new_consumption_breakdownwn = this.contextMenuData.consumption_breakdown.map((item: any) => ({
      material_code: '',
      consumed_qty: '',
      consumed_amt: '',
      consumed_rate: ''
    }));


    const newRow = {
      start_date: this.contextMenuData.start_date,
      material_code: '',
      item_desc: '', uom_text: '', qty_left: 0, budget_left: 0,

      breakdown: newBreakdown,
      consumption_breakdown: new_consumption_breakdownwn
    }

    // Insert the new row at the end of found index 

    const updatedItems = [
      ...this.accountsMaterialBudgetList.slice(0, nextIndex),
      newRow,
      ...this.accountsMaterialBudgetList.slice(nextIndex)
    ];

    this.accountsMaterialBudgetList = updatedItems;

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
}