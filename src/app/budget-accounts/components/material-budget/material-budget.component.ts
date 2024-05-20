import { Component, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-material-budget',
  templateUrl: './material-budget.component.html',
  styleUrls: ['./material-budget.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})
export class MaterialBudgetComponent {
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
  userList: Array<any> = [];
  toggle_name: string = '';
  private saveDataSubject = new Subject<any>();

  upperTableHeaders: Array<any> = [
    { title: 'MATERIAL BUDGET', colspan: 3 },
    // { title: 'BUDGET', colspan: 3 },
    { title: 'CONSUMPTION', colspan: 3 },
    { title: 'REMAINDER', colspan: 2 }
  ];

  tableHeadersWithVisibility: Array<any> = ['Material Code', 'Item Description', 'UOM',
    'Consumed Qty', 'Consumption Amount', 'Rate /Qty', 'Qty. left', 'Budget Left (Rs.)'
  ];


  tableHeaders = this.tableHeadersWithVisibility.map(header => ({ name: header, is_visible: true }));


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

  toggleColumnVisibility() {
    if (this.tableHeaders.some(header => header.name.includes("Budgeted"))) {
      if (this.tableHeaders.filter(header => header.name.includes("Budgeted")).length > 3) {
        this.toggle_name = this.tableHeaders.some(header => !header.is_visible) ? 'Show Latest Budget Data' : 'Show All Budget Data';
      } else {
        this.toggle_name = 'Latest Budget Data Displayed';
      }
    } else {
      this.toggle_name = 'Latest Budget Data Displayed';
    }

    // Find the latest date
    const latestDate = this.tableHeaders.reduce((latest: any, header: any) => {
      const matches = header.name.match(/\d{4}-\d{2}-\d{2}/); // Extract date from the name
      const date = matches ? new Date(matches[0]) : null; // Parse the date
      return date && (!latest || date > latest) ? date : latest;
    }, null);

    // Toggle the visibility of old budget-related dates
    this.tableHeaders.forEach(header => {
      if (header.name.includes("Budgeted")) {
        const matches = header.name.match(/\d{4}-\d{2}-\d{2}/); // Extract date from the name
        const date = matches ? new Date(matches[0]) : null; // Parse the date
        if (date && date < latestDate) {
          header.is_visible = !header.is_visible;
        }
      }
    });

    this.accountsMaterialBudgetList.forEach((res: any) => {
      const latestDate = res.breakdown.find((item: any) => item.is_latest)?.entry_date;

      if (latestDate) {
        res.breakdown.forEach((item: any) => {
          if (item.entry_date !== latestDate) {
            item.is_visible = !item.is_visible;
          }
        });
      }

    });

    console.log(this.tableHeaders);
    const budgetedVisibleCount = this.tableHeaders.filter(header => header.name.includes("Budgeted") && header.is_visible).length;

    const index = this.upperTableHeaders.findIndex(header => header.title === 'MATERIAL BUDGET');
    if (index !== -1) {
      this.upperTableHeaders.splice(index + 1, 0, { title: 'BUDGET', colspan: budgetedVisibleCount });
    }
    const uniqueHeaders = this.upperTableHeaders.filter((header, index) => {
      return this.upperTableHeaders.findIndex(h => h.title === header.title) === index;
    });
    this.upperTableHeaders = uniqueHeaders
    console.log(this.upperTableHeaders);


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
      this.tableHeaders = this.tableHeadersWithVisibility.map(header => ({ name: header, is_visible: true }));


      if (this.accountsMaterialBudgetList.length == 0) {
        this.budgetName = 'Add Budget'
        // Remove budget-related table upperheaders
        const index = this.upperTableHeaders.findIndex(header => header.title === 'BUDGET');
        if (index !== -1) {
          this.upperTableHeaders.splice(index, 1);
        }

        // Remove budget-related table headers 
        this.tableHeaders = this.tableHeadersWithVisibility.map(header => ({ name: header, is_visible: true }));

      } else {
        this.budgetName = 'Update Budget'
        this.accountsMaterialBudgetList.forEach((res: any) => {

          // add TableHeaders

          var tt: any = []
          res.breakdown.forEach((breakdownItem: any) => {
            const latestEntry = res.breakdown[res.breakdown.length - 1]
            latestEntry.is_latest = true;
            latestEntry.is_visible = true;

            const budgetedQty = { name: `Budgeted Qty\n(${breakdownItem.entry_date})`, is_visible: true };
            const budgetedRate = { name: `Budgeted Rate\n(${breakdownItem.entry_date})`, is_visible: true };
            const budgetedAmt = { name: `Budgeted Amt\n(${breakdownItem.entry_date})`, is_visible: true };

            // Push budget-related objects into tt array
            tt.push(budgetedQty, budgetedRate, budgetedAmt);
          });


          const consumedQtyIndex = this.tableHeaders.findIndex(header => header.name === 'Consumed Qty');
          const uomQtyIndex = this.tableHeaders.findIndex(header => header.name === 'UOM');

          this.tableHeaders.splice(uomQtyIndex + 1, consumedQtyIndex - 3);

          if (uomQtyIndex !== -1) {
            this.tableHeaders.splice(uomQtyIndex + 1, 0, ...tt);
          }

          // Find the latest date
          const latestDate = res.breakdown.reduce((latest: any, item: any) => latest ? (latest < item.entry_date ? item.entry_date : latest) : item.entry_date, null);

          // Filter out the headers related to budgeted amounts that match the latest date
          const latestBudgetHeaders = this.tableHeaders.filter(header => header.name.includes("Budgeted") && header.name.includes(latestDate));

          // Iterate through all headers and set is_visible accordingly
          this.tableHeaders.forEach(header => {
            console.log(!latestBudgetHeaders.some(budgetHeader => budgetHeader.name === header.name));
            if (header.name.includes("Budgeted") && !latestBudgetHeaders.some(budgetHeader => budgetHeader.name === header.name)) {
              header.is_visible = false;
            } else {
              header.is_visible = true;
            }
          });

        })

        // Function to remove duplicates based on the 'name' property
        const uniqueTableHeaders = this.tableHeaders.filter((header, index, self) =>
          index === self.findIndex(h => h.name === header.name)
        );

        // Update this.tableHeaders with unique values
        this.tableHeaders = uniqueTableHeaders;


        // add upperTableHeaders
        const budgetedVisibleCount = this.tableHeaders.filter(header => header.name.includes("Budgeted") && header.is_visible).length;

        const index = this.upperTableHeaders.findIndex(header => header.title === 'MATERIAL BUDGET');
        if (index !== -1) {
          this.upperTableHeaders.splice(index + 1, 0, { title: 'BUDGET', colspan: budgetedVisibleCount });
        }
        const uniqueHeaders = this.upperTableHeaders.filter((header, index) => {
          return this.upperTableHeaders.findIndex(h => h.title === header.title) === index;
        });
        this.upperTableHeaders = uniqueHeaders
        console.log(this.upperTableHeaders);



        if (this.tableHeaders.some(header => header.name.includes("Budgeted"))) {
          if (this.tableHeaders.filter(header => header.name.includes("Budgeted")).length > 3) {
            this.toggle_name = this.tableHeaders.filter(header => header.name.includes("Budgeted").is_visible).length > 3 ? 'Show Latest Budget Data' : 'Show All Budget Data';
          } else {
            this.toggle_name = 'Latest Budget Data Displayed';
          }
        } else {
          this.toggle_name = 'Latest Budget Data Displayed';
        }
      }


    })

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
              entry_date: selectedDate,
              is_latest: true,
              is_visible: true
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

          const budgetedQty = { name: `Budgeted Qty\n(${selectedDate})`, is_visible: true };
          const budgetedRate = { name: `Budgeted Rate\n(${selectedDate})`, is_visible: true };
          const budgetedAmt = { name: `Budgeted Amt\n(${selectedDate})`, is_visible: true };

          // const uomindex = this.tableHeaders.indexOf('UOM');
          const uomindex = this.tableHeaders.findIndex(header => header.name === 'UOM');

          if (uomindex !== -1) {
            this.tableHeaders.splice(uomindex + 1, 0, budgetedQty, budgetedRate, budgetedAmt);
          }

          const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }


        } else {

          // const breakdown_bulk = this.accountsMaterialBudgetList.map((item: any, index: any) => {
          //   const container: any = {};
          //   container.material_code = item.material_code;
          //   container.entry_date = item.start_date;
          //   container.master = item.id

          //   return container;
          // })

          // this.apiservice.accountsMaterialBudgetBreakdownBulk(breakdown_bulk).subscribe((res: any) => {
          //   console.log(res);

          // })

          this.accountsMaterialBudgetList.forEach((data: any) => {
            console.log(data);

            const breakdown = data.breakdown;
            if (breakdown.length > 0) {
              const latestEntry = breakdown[breakdown.length - 1]

              data.breakdown.push({
                material_code: latestEntry.material_code,
                qty: latestEntry.qty,
                rate: latestEntry.rate,
                amount: latestEntry.amount,
                entry_date: selectedDate,
                is_latest: true,
                is_visible: true
              })
            }

          })

          this.accountsMaterialBudgetList.forEach((res: any) => {

            var tt: any = [];

            res.breakdown.forEach((breakdownItem: any) => {
              const budgetedQty = { name: `Budgeted Qty\n(${breakdownItem.entry_date})`, is_visible: true };
              const budgetedRate = { name: `Budgeted Rate\n(${breakdownItem.entry_date})`, is_visible: true };
              const budgetedAmt = { name: `Budgeted Amt\n(${breakdownItem.entry_date})`, is_visible: true };

              // const consumedQtyIndex = this.tableHeaders.indexOf('Consumed Qty');
              const consumedQtyIndex = this.tableHeaders.findIndex(header => header.name === 'Consumed Qty');
              if (consumedQtyIndex !== -1) {
                tt.push(budgetedQty, budgetedRate, budgetedAmt);
              }

            });


            // const consumedQtyIndex = this.tableHeaders.indexOf('Consumed Qty');
            const consumedQtyIndex = this.tableHeaders.findIndex(header => header.name === 'Consumed Qty');
            const uomQtyIndex = this.tableHeaders.findIndex(header => header.name === 'UOM');

            this.tableHeaders.splice(uomQtyIndex + 1, consumedQtyIndex - 3);

            if (consumedQtyIndex !== -1) {
              this.tableHeaders.splice(uomQtyIndex + 1, 0, ...tt);

              // this.tableHeaders = Array.from(new Set(this.tableHeaders));
            }

            // Find the latest date
            const latestDate = res.breakdown.reduce((latest: any, item: any) => latest ? (latest < item.entry_date ? item.entry_date : latest) : item.entry_date, null);

            console.log(latestDate);


            // Filter out the headers related to budgeted amounts that match the latest date
            const latestBudgetHeaders = this.tableHeaders.filter(header => header.name.includes("Budgeted") && header.name.includes(latestDate));


            // Iterate through all headers and set is_visible accordingly
            this.tableHeaders.forEach(header => {
              if (header.name.includes("Budgeted") && !latestBudgetHeaders.some(budgetHeader => budgetHeader.name === header.name)) {
                header.is_visible = false;
              } else {
                header.is_visible = true;
              }
            });


          })


          console.log(this.tableHeaders);


          // Function to remove duplicates based on the 'name' property
          // const uniqueTableHeaders = this.tableHeaders.filter((header, index, self) =>
          //   index === self.findIndex(h => h.name === header.name)
          // );

          // console.log(uniqueTableHeaders);


          // Update this.tableHeaders with unique values
          // this.tableHeaders = uniqueTableHeaders;
          console.log(this.tableHeaders);
          console.log(this.accountsMaterialBudgetList);

          // add upperTableHeaders
          const budgetedVisibleCount = this.tableHeaders.filter(header => header.name.includes("Budgeted") && header.is_visible).length;

          const index = this.upperTableHeaders.findIndex(header => header.title === 'MATERIAL BUDGET');
          if (index !== -1) {
            this.upperTableHeaders.splice(index + 1, 0, { title: 'BUDGET', colspan: budgetedVisibleCount });
          }
          const uniqueHeaders = this.upperTableHeaders.filter((header, index) => {
            return this.upperTableHeaders.findIndex(h => h.title === header.title) === index;
          });
          this.upperTableHeaders = uniqueHeaders
          console.log(this.upperTableHeaders);

          const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }

        }

        if (this.tableHeaders.some(header => header.name.includes("Budgeted"))) {
          if (this.tableHeaders.filter(header => header.name.includes("Budgeted")).length > 3) {
            this.toggle_name = this.tableHeaders.filter(header => header.name.includes("Budgeted").is_visible).length > 3 ? 'Show Latest Budget Data' : 'Show All Budget Data';
          } else {
            this.toggle_name = 'Latest Budget Data Displayed';
          }
        } else {
          this.toggle_name = 'Latest Budget Data Displayed';
        }

      })
    }

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

      // Check if the current item is the last item in the breakdown array
      if (index === data.breakdown.length - 1) {
        mappedItem.is_latest = true;
        mappedItem.is_visible = true;
      }

      if (item.id) {
        mappedItem.id = item.id;
      }

      return mappedItem;
    });
    const latestRowData = mappedBreakdown[mappedBreakdown.length - 1];
    data.qty_left = latestRowData.qty - data?.consumption_breakdown[0]?.consumed_qty
    data.budget_left = latestRowData.amount - data?.consumption_breakdown[0]?.consumed_amt


    data.consumption_breakdown[0].consumed_rate = isNaN(data?.consumption_breakdown[0]?.consumed_amt / data?.consumption_breakdown[0]?.consumed_qty) ? 0 : (parseInt(data?.consumption_breakdown[0]?.consumed_amt) / parseInt(data?.consumption_breakdown[0]?.consumed_qty)).toFixed(2)

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
            consumed_rate: isNaN(data.consumption_breakdown[0].consumed_rate) ? 0 : data.consumption_breakdown[0]?.consumed_rate ? data.consumption_breakdown[0]?.consumed_rate : 0
          }
        ]
      }
      this.apiservice.addAccountsMaterialBudget(obj).subscribe((res: any) => {
        console.log(res);

        this.accountsMaterialBudgetList[index] = res.results.data
        res.results.data.breakdown.forEach((res: any, i: any) => {
          if (i === data.breakdown.length - 1) {
            res.is_latest = true;
            res.is_visible = true;
          }

        })

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
            consumed_rate: isNaN(data.consumption_breakdown[0].consumed_rate) ? 0 : data.consumption_breakdown[0].consumed_rate ? data.consumption_breakdown[0].consumed_rate : 0
          }
        ]
      }
      this.apiservice.updateAccountsMaterialBudget(obj, data.id, this.localStorageData.organisation_details[0].id).subscribe((res: any) => {
        console.log(res);

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
      entry_date: item.entry_date,
      is_latest: item.is_latest,
      is_visible: item.is_visible
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
      entry_date: item.entry_date,
      is_latest: item.is_latest,
      is_visible: item.is_visible
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
