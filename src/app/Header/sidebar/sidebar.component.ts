import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessPermissionService } from 'src/app/Shared/Services/access-permission.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { APIService } from 'src/app/Shared/Services/api.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  userData: any
  settingsData: any
  masterSetting: any
  purchaseMasterSetting: any
  permissionData: any = {}
  sidebarMenu: any = []
  titleDisplay:boolean=true;
  activeModuleData:any='';
  allModule:any=[]
  transactionActiveModule = ''

  @Output() sidebarInfo = new EventEmitter<any>();

  constructor(
    private toastrService: ToastrService,
    public router: Router,
    private accessPermissionService: AccessPermissionService,
    private dataShareService: DataSharedService,
    private commonFunction: CommonFunctionService,
    private apiservice: APIService,
  ) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.dataShareService.getLocalData('userDATA'))
    this.defaultActiveModule(this.userData?.user_role_details?.user_permissions_details);
    if(this.router.url.indexOf('/pms/purchase') > -1) {
      this.transactionActiveModule = 'purchase'
    } else if(this.router.url.indexOf('/pms/store') > -1) {
      this.transactionActiveModule = 'store'
    }
    this.getSettingList();
  }

  ngAfterViewInit(): void {
    this.sidebarInfo.emit(true)
  }

  moduleName:any;

  defaultActiveModule(data:any){

     this.allModule=data.filter((val:any)=>val.itemName!='Dashboard');

     for (let i = 0; i < this.allModule.length; i++) {
      if (this.allModule[i].level_permission == true) {
        this.moduleName = this.allModule[i].itemName;
         break;
      }
    }
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    } 
    else {
      this.toastrService.error("Development Under progress for this URL!", '', {
        timeOut: 2000,
      });
    }
  }

  routeTransfer(route: any) {
    if (route) {
      this.router.navigateByUrl(route).then(() => {
        window.location.reload();
      });
    }
  }

  defaultSidebar() {
    let dashboardURL = 'pms/'+this.activeModuleData.toLowerCase()+'/procurement/dashboard'
    this.sidebarMenu = [
      {
        name: 'Dashboard',
        url: dashboardURL,
        permission: 'Dashboard',
        image: 'assets/icons/akar-icons_dashboard.png',
        subItem: []
      },

      {
        name: 'Master',
        url: '',
        permission: '',
        image: 'assets/icons/fluent-mdl2_master-database.png',
        subItem: Array()
      },

      {
        name: 'Transactions',
        url: '',
        permission: '',
        image: 'assets/icons/tabler_transaction-rupee.png',
        subItem: Array()
      },
      {
        name: 'Reports',
        url: '',
        permission: '',
        image: 'assets/icons/iconoir_reports.png',
        subItem: [
          {
            name: 'Material Requirement Plan',
            slug: '/pms/purchase/procurement/report',
            permission: 'Indent'
          },
        ]
      },

    ]
  }

  projectModule() {
    this.sidebarMenu = [
      // {
      //   name: 'Dashboard',
      //   url: '/pms/dashbord',
      //   permission: 'Dashboard',
      //   image: 'assets/icons/akar-icons_dashboard.png',
      //   subItem: []
      // },

      {
        name: 'Project',
        url: '/pms/project',
        permission: 'Project',
        image: 'assets/icons/fluent-mdl2_master-database.png',
        subItem: []
      }]
  }

  plantMachineryModule() {
    this.sidebarMenu = [
      // {
      //   name: 'Dashboard',
      //   url: '/pms/dashbord',
      //   permission: 'Dashboard',
      //   image: 'assets/icons/akar-icons_dashboard.png',
      //   subItem: []
      // },

      {
        name: 'Plant & Machinery',
        url: '/pms/plant_machinary',
        permission: 'Plant & Machinery',
        image: 'assets/icons/fluent-mdl2_master-database.png',
        subItem: []
      }]
  }

  insuranceModule() {
    this.sidebarMenu = [
      // {
      //   name: 'Dashboard',
      //   url: '/pms/dashbord',
      //   permission: 'Dashboard',
      //   image: 'assets/icons/akar-icons_dashboard.png',
      //   subItem: []
      // },

      {
        name: 'Insurance',
        url: '/pms/insurance',
        permission: 'Insurance',
        image: 'assets/icons/fluent-mdl2_master-database.png',
        subItem: []
      }]
  }
  getSettingList() {
    let query = this.commonFunction.getURL(
      {
        organization_id: this.userData.organisation_details[0].id,
        settings_for: 'PMS'
      }
    )
    this.apiservice.getSettingList(query).subscribe((data: any) => {
      this.settingsData = data;
      for (let val of this.settingsData) {
        if (val.name == 'Store Master') {
          this.masterSetting = val.settings_details;
        }
        if (val.name == 'Purchase Master') {
          this.purchaseMasterSetting = val.settings_details;
        }
      }

      if(this.dataShareService.getLocalData('ActiveModule')){
        this.activeModuleData=this.dataShareService.getLocalData('ActiveModule');
        this.moduleChange(false)
      }else{
        this.activeModuleData=this.moduleName;
        this.moduleChange(false)
      }
    })
  }

  tenderModule() {
    this.sidebarMenu = [
      // {
      //   name: 'Dashboard',
      //   url: '/pms/dashbord',
      //   permission: 'Dashboard',
      //   image: 'assets/icons/akar-icons_dashboard.png',
      //   subItem: []
      // },

      {
        name: 'Tender Management',
        url: '',
        permission: 'Tender',
        image: 'assets/icons/fluent-mdl2_master-database.png',
        subItem: [
          {
            name: 'Tender Evaluations Summary',
            slug: '/pms/tender/evaluations-summary',
            permission: 'Tender'
          },
          {
            name: 'Add New Tender',
            slug: '/pms/tender/add-new',
            permission: 'Tender'
          },
          {
            name: 'Archived Tenders',
            slug: '/pms/tender/archived',
            permission: 'Tender'
          },
        ]
      },
      {
        name: 'Reports',
        url: '',
        permission: '',
        image: 'assets/icons/iconoir_reports.png',
        subItem: []
      },

    ]

  }

  userModule() {
    this.sidebarMenu = [
      // {
      //   name: 'Dashboard',
      //   url: '/pms/dashbord',
      //   permission: 'Dashboard',
      //   image: 'assets/icons/akar-icons_dashboard.png',
      //   subItem: []
      // },

      {
        name: 'Administration',
        url: '',
        permission: 'User Management',
        image: 'assets/icons/fluent-mdl2_master-database.png',
        subItem: [
          {
            name: 'Manage Group',
            slug: '/pms/usermanagement/manageGroup',
            permission: 'Manage Group'
          },
          {
            name: 'Manage User',
            slug: '/pms/usermanagement/manageUser',
            permission: 'Manage User'
          },
        ]
      }
    ]
  }
  purchaseMaster() {
    this.sidebarMenu[1].subItem = this.purchaseMasterSetting;
  }
  purchaseTransaction() {
    this.sidebarMenu[2].subItem = [
      {
        name: 'Material Requisition(MR)',
        slug: '',
        permission: 'Material Requisition(MR)',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/mr/create',
            permission: 'Material Requisition(MR)',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/mr',
            permission: 'Material Requisition(MR)',
            scope:''
          }
        ]
      },
      {
        name: 'Indent',
        slug: '',
        permission: 'Indent',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/indent/create',
            permission: 'Indent',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/indent',
            permission: 'Indent',
            scope:''
          },
          {
            name: 'Multi Stage Approve',
            url: '/pms/purchase/procurement/indent/multistage-approval',
            permission: 'Indent',
            scope:'procurement-indent-approver'
          },
        ]
      },
      {
        name: 'Enquiry',
        slug: '',
        permission: 'Enquiry',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/enquiry/add',
            permission: 'Enquiry',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/enquiry',
            permission: 'Enquiry',
            scope:''
          },
          {
            name: 'Send Enquiry ',
            url: '/pms/purchase/procurement/enquiry/send-enquiry',
            permission: 'Enquiry',
            scope:''
          }
        ]
      },
      {
        name: 'Purchase Order',
        slug: '',
        permission: 'Purchase Order',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/purchase-order/create',
            permission: 'Purchase Order',
            scope:'add'
          },
          {
            name: 'Add GST',
            url: '/pms/purchase/procurement/purchase-order/create/gst',
            permission: 'Purchase Order',
            scope:'add'
          },
          {
            name: 'Through Indent',
            url: '/pms/purchase/procurement/indent/through',
            permission: 'Indent',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/purchase-order',
            permission: 'Purchase Order',
            scope:''
          },
          {
            name: 'Multi Stage Approve',
            url: '/pms/purchase/procurement/purchase-order/multistage-approval',
            permission: 'Purchase Order',
            scope:''
          },
          {
            name: 'Cancel/Close',
            url: '/pms/purchase/procurement/purchase-order/cancel-close',
            permission: 'Purchase Order',
            scope:'procurement-po-approver'
          }
        ]
      },
      {
        name: 'Purchase',
        slug: '',
        permission: 'Purchase',
        childMenu:[
          {
            name: 'Add (Billing)',
            url: '/pms/purchase/procurement/purchase/add',
            permission: 'Purchase',
            scope:'add'
          },
          {
            name: 'Add GST (Billing)',
            url: '/pms/purchase/procurement/purchase/add-gst',
            permission: 'Purchase',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/purchase',
            permission: 'Purchase',
            scope:''
          },
          {
            name: 'Check',
            url: '/pms/purchase/procurement/purchase/check',
            permission: 'Purchase',
            scope:'procurement-purchase-checker'
          },
          {
            name: 'Approve',
            url: '/pms/purchase/procurement/purchase/approve',
            permission: 'Purchase',
            scope:'procurement-purchase-approver'
          },
          {
            name: 'Reject',
            url: '/pms/purchase/procurement/purchase/reject',
            permission: 'Purchase',
            scope:'procurement-purchase-approver'
          },
          {
            name: 'Cancel/Close',
            url: '/pms/purchase/procurement/purchase/cancel/close',
            permission: 'Purchase',
            scope:'procurement-purchase-approver'
          },
          
          {
            name: 'GRN Cancel/Close',
            url: '/pms/purchase/procurement/purchase/cancel-close',
            permission: 'Purchase',
            scope:'procurement-grn-approver'
          }
        ]
      },
      {
        name: 'General Administration Expenses',
        slug: '',
        permission: 'General Administration Expenses',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/general-administration-expenses/add',
            permission: 'General Administration Expenses',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/general-administration-expenses/list',
            permission: 'General Administration Expenses',
            scope:''
          }
        ]
      },
      {
        name: 'GRN/Party GRN',
        slug: '',
        permission: 'GRN',
        childMenu:[
          {
            name: 'List',
            url: '/pms/purchase/procurement/grn',
            permission: 'GRN',
            scope:''
          }
        ]
      },
      {
        name: 'Voucher Linking',
        slug: '',
        permission: 'Voucher Linking',
        childMenu:[
          {
            name: 'List',
            url: '/pms/purchase/procurement/voucher-linking',
            permission: 'Voucher Linking',
            scope:''
          },
          {
            name: 'MR & Indent',
            url: '/pms/purchase/procurement/voucher-linking/mr/indent',
            permission: 'Voucher Linking',
            scope:''
          },

          {
            name: 'Indent & PO',
            url: '/pms/purchase/procurement/voucher-linking/indent/po',
            permission: 'Voucher Linking',
            scope:''
          },
          {
            name: 'Indent & GRN',
            url: '/pms/purchase/procurement/voucher-linking/indent/grn',
            permission: 'Voucher Linking',
            scope:''
          },
          {
            name: 'PO & GRN',
            url: '/pms/purchase/procurement/voucher-linking/po/grn',
            permission: 'Voucher Linking',
            scope:''
          },

          {
            name: 'Purchase & GRN',
            url: '/pms/purchase/procurement/voucher-linking/grn/purchase',
            permission: 'Voucher Linking',
            scope:''
          },
          {
            name: 'PO & Purchase',
            url: '/pms/purchase/procurement/voucher-linking/po/purchase',
            permission: 'Voucher Linking',
            scope:''
          }
        ]
      },
      {
        name: 'Raw Material Sales',
        slug: '',
        permission: 'Raw Material Sales',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/raw-material-sales/add',
            permission: 'Raw Material Sales',
            scope:'add'
          },
          {
            name: 'Add (GST)',
            url: '/pms/purchase/procurement/raw-material-sales/add/gst',
            permission: 'Raw Material Sales',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/raw-material-sales',
            permission: 'Raw Material Sales',
            scope:''
          }
        ]
      },
      {
        name: 'Work Indent',
        slug: '',
        permission: 'Work Indent',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/work-indent/add',
            permission: 'Work Indent',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/work-indent',
            permission: 'Work Indent',
            scope:''
          },
        ]
      },
      {
        name: 'Work Order',
        slug: '',
        permission: 'Work Order',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/work-order/create',
            permission: 'Work Order',
            scope:'add'
          },
          {
            name: 'Add GST',
            url: '/pms/purchase/procurement/work-order/GST/create',
            permission: 'Work Order',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/work-order',
            permission: 'Work Order',
            scope:''
          },
          {
            name: 'Multi Stage Approve',
            url: '/pms/purchase/procurement/work-order/multistage-approval',
            permission: 'Work Order',
            scope:''
          },
          
        ]
        
      },
      {
        name: 'Way Bill',
        slug: '',
        permission: 'Way Bill',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/way-bill/add',
            permission: 'Way Bill',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/way-bill',
            permission: 'Way Bill',
            scope:''
          },
          {
            name: 'Linking GRN/Purchase Bill',
            url: '/pms/purchase/procurement/way-bill/linking',
            permission: 'Way Bill',
            scope:''
          }
        ]
      },
      {
        name: 'Tax Invoice / Challan By MIN',
        slug: '',
        permission: 'Tax Invoice / Challan By MIN',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/tax-invoice-challan/create',
            permission: 'Tax Invoice / Challan By MIN',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/tax-invoice-challan',
            permission: 'Tax Invoice / Challan By MIN',
            scope:''
          },
          {
            name: 'Approve',
            url: '/pms/purchase/procurement/tax-invoice-challan/approve',
            permission: 'Tax Invoice / Challan By MIN',
            scope:'procurement-tax-invoice-approver'
          }
        ]
      },
      {
        name: 'Debit Note',
        slug: '',
        permission: 'Material Issue Debit Note',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/debit-note/add',
            permission: 'Material Issue Debit Note',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/debit-note/list',
            permission: 'Material Issue Debit Note',
            scope:''
          }
        ]
      },
      {
        name: 'Purchase Return',
        slug: '',
        permission: 'Purchase Return',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/purchase-return/add',
            permission: 'Purchase Return',
            scope:'add'
          },
          {
            name: 'Add GST',
            url: '/pms/purchase/procurement/purchase-return/add-gst',
            permission: 'Purchase Return',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/purchase-return',
            permission: 'Purchase Return',
            scope:''
          },
          // {
          //   name: 'Approve',
          //   url: '/pms/purchase/procurement/purchase/approve',
          //   permission: 'Purchase Return',
          //   scope:'procurement-purchase-approver'
          // },
          {
            name: 'Through GRN',
            url: '/pms/purchase/procurement/grn/through',
            permission: 'GRN',
            scope:''
          },
          // {
          //   name: 'GRN Cancel/Close',
          //   url: '/pms/purchase/procurement/purchase/cancel-close',
          //   permission: 'GRN',
          //   scope:'procurement-grn-approver'
          // },
          
        ]
      },
      {
        name: 'Transport Bill',
        slug: '',
        permission: 'Transport Bill',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/transport-bill/create',
            permission: 'Transport Bill',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/transport-bill',
            permission: 'Transport Bill',
            scope:''
          },
          {
            name: 'Approve',
            url: '/pms/purchase/procurement/transport-bill/approve',
            permission: 'Transport Bill',
            scope:'procurement-transporter-bill-approver'
          }

          
        ]
      },
      {
        name: 'Party Bill Receive',
        slug: '',
        permission: 'Party Bill Receive',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/purchase/procurement/party-bill-receive/add',
            permission: 'Party Bill Receive',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/purchase/procurement/party-bill-receive',
            permission: 'Party Bill Receive',
            scope:''
          },
          {
            name: 'Accept',
            url: '/pms/purchase/procurement/party-bill-receive/accept',
            permission: 'Party Bill Receive',
            scope:''
          },
        ]
      }
    ]

  }

  storeMaster() {
    this.sidebarMenu[1].subItem = this.masterSetting;
  }
  storeTransaction() {
    this.sidebarMenu[2].subItem = [
      {
        name: 'Material Requisition(MR)',
        slug: '',
        permission: 'Store-Material Requisition(MR)',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/mr/create',
            permission: 'Store-Material Requisition(MR)',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/mr',
            permission: 'Store-Material Requisition(MR)',
            scope:''
          }
        ]
      },
      {
        name: 'Indent Request',
        slug: '',
        permission: 'Store-Indent',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/indent/create',
            permission: 'Store-Indent',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/indent',
            permission: 'Store-Indent',
            scope:''
          },
          
        ]
      },
      {
        name: 'Item Opening',
        slug: '',
        permission: 'Store-Item Opening',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/item-opening-add',
            permission: 'Store-Item Opening',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/item-opening',
            permission: 'Store-Item Opening',
            scope:''
          },
        ]
      },
      {
        name: 'Physical Stock',
        slug: '',
        permission: 'Store-Physical Stock',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/physical-stock',
            permission: 'Store-Physical Stock',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/physical-stock-list',
            permission: 'Store-Physical Stock',
            scope:''
          },
          {
            name: 'Posting',
            url: '/pms/store/physical-stock-post',
            permission: 'Store-Physical Stock',
            scope:'procurement-physical-stock-approver'
          },
        ]
      },
      {
        name: 'Purchase Order',
        slug: '',
        permission: 'Store-Purchase Order',
        childMenu:[
          {
            name: 'List',
            url: '/pms/store/procurement/purchase-order',
            permission: 'Store-Purchase Order',
            scope:''
          },
        ]
      },
      {
        name: 'GRN/Party GRN',
        slug: '',
        permission: 'Store-GRN',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/grn/create',
            permission: 'Store-GRN',
            scope:'add'
          },
          {
            name: 'Add GST',
            url: '/pms/store/procurement/grn/create-gst',
            permission: 'Store-GRN',
            scope:'add'
          },
          {
            name: 'Multiple Entry',
            url: '/pms/store/procurement/grn/multiple-add',
            permission: 'Store-GRN',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/grn',
            permission: 'Store-GRN',
            scope:''
          },
          {
            name: 'Import(Through Excel)',
            url: '/pms/store/procurement/grn/import',
            permission: 'Store-GRN',
            scope:'add'
          },
        ]
      },
      {
        name: 'Voucher Linking',
        slug: '',
        permission: 'Store-Voucher Linking',
        childMenu:[
          {
            name: 'List',
            url: '/pms/store/procurement/voucher-linking',
            permission: 'Store-Voucher Linking',
            scope:''
          },
          {
            name: 'MR & Issue',
            url: '/pms/store/procurement/voucher-linking/mr/issue',
            permission: 'Store-Voucher Linking',
            scope:''
          },
          {
            name: 'MR & Indent',
            url: '/pms/store/procurement/voucher-linking/mr/indent',
            permission: 'Store-Voucher Linking',
            scope:''
          },
          {
            name: 'Indent & GRN',
            url: '/pms/store/procurement/voucher-linking/indent/grn',
            permission: 'Store-Voucher Linking',
            scope:''
          },
          {
            name: 'PO & GRN',
            url: '/pms/store/procurement/voucher-linking/po/grn',
            permission: 'Store-Voucher Linking',
            scope:''
          }
        ]
      },
      {
        name: 'Purchase',
        slug: '',
        permission: 'Store-Purchase',
        childMenu:[
          {
            name: 'List',
            url: '/pms/store/procurement/purchase',
            permission: 'Store-Purchase',
            scope:''
          },
        ]
      },
      {
        name: 'Material Issue',
        slug: '',
        permission: 'Store-Material Issue',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/material-issue/request',
            permission: 'Store-Material Issue',
            scope:'add'
          },
          {
            name: 'Multiple Issue',
            url: '/pms/store/procurement/material-issue/multi-request',
            permission: 'Store-Material Issue',
            scope:'add'
          },
          {
            name: 'Import(Through Excel)',
            url: '/pms/store/procurement/material-issue/import',
            permission: 'Store-Material Issue',   
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/material-issue',
            permission: 'Store-Material Issue',
            scope:''
          },
          {
            name: 'Bulk Stock Transfer',
            url: '/pms/store/procurement/material-issue/bulk-transfer',
            permission: 'Store-Material Issue',
            scope:''
          },
          {
            name: 'Received Ack.',
            url: '/pms/store/procurement/material-issue/ackowledgement',
            permission: 'Store-Material Issue',
            scope:''
          },
          {
            name: 'Received Ack. Approval',
            url: '/pms/store/procurement/material-issue/ackowledgement-approval',
            permission: 'Store-Material Issue',
            scope:''
          },
        ]
      },
      {
        name: 'Material Wastage',
        slug: '',
        permission: 'Store-Material Wastage',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/material-wastage/add',
            permission: 'Store-Material Wastage',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/material-wastage',
            permission: 'Store-Material Wastage',
            scope:''
          },
        ]
      },
       {
        name: 'Material Issue Return',
        slug: '',
        permission: 'Store-Material Issue Return',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/material-issue-return/add',
            permission: 'Store-Material Issue Return',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/material-issue-return',
            permission: 'Store-Material Issue Return',
            scope:''
          },
        ]
      },
      {
        name: 'Work Indent',
        slug: '',
        permission: 'Store-Work Indent',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/work-indent/add',
            permission: 'Store-Work Indent',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/work-indent',
            permission: 'Store-Work Indent',
            scope:''
          },
        ]
      },
      {
        name: 'Work Order',
        slug: '',
        permission: 'Store-Work Order',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/work-order/create',
            permission: 'Store-Work Order',
            scope:'add'
          },
          {
            name: 'Add GST',
            url: '/pms/store/procurement/work-order/GST/create',
            permission: 'Store-Work Order',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/work-order',
            permission: 'Store-Work Order',
            scope:''
          },
        ]
      },
      {
        name: 'Fabrication Work',
        slug: '',
        permission: 'Store-Fabrication Work',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/fabrication-work/add',
            permission: 'Store-Fabrication Work',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/fabrication-work/list',
            permission: 'Store-Fabrication Work',
            scope:''
          },
        ]
      },
      {
        name: 'Gate Pass/Entry',
        slug: '',
        permission: 'Store-Gate Pass / Entry',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/gate-pass/add',
            permission: 'Store-Gate Pass / Entry',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/gate-pass',
            permission: 'Store-Gate Pass / Entry',
            scope:''
          },
          {
            name: 'Transportation Charge',
            url: '/pms/store/procurement/gate-pass/transportation',
            permission: 'Store-Gate Pass / Entry',
            scope:''
          },
        ]
      },
      {
        name: 'Item Stock JV',
        slug: '',
        permission: 'Store-Item Stock JV',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/item-stock-jv/add',
            permission: 'Store-Item Stock JV',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/item-stock-jv',
            permission: 'Store-Item Stock JV',
            scope:''
          },
        ]
      },
      {
        name: 'Sublet Order',
        slug: '/pms/store/procurement/sublet-order',
        permission: 'Store-Sublet Order',
        childMenu:[]
      }, 
      {
        name: 'Single Log Book (Machine)',
        slug: '',
        permission: 'Store-Single Log Book (Machine)',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/single-log-book-machine/add',
            permission: 'Store-Single Log Book (Machine)',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/single-log-book-machine',
            permission: 'Store-Single Log Book (Machine)',
            scope:''
          },
        ]
      },
      {
        name: 'Lab Report Entry',
        slug: '',
        permission: 'Store-Lab Report Entry',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/lab-report-entry/add',
            permission: 'Store-Lab Report Entry',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/lab-report-entry',
            permission: 'Store-Lab Report Entry',
            scope:''
          },
        ]
      },
      {
        name: 'Party Bill Receive',
        slug: '',
        permission: 'Store-Party Bill Receive',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/party-bill-receive/add',
            permission: 'Store-Party Bill Receive',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/party-bill-receive',
            permission: 'Store-Party Bill Receive',
            scope:''
          },
          {
            name: 'Accept',
            url: '/pms/store/procurement/party-bill-receive/accept',
            permission: 'Store-Party Bill Receive',
            scope:''
          },
        ]
      },
      {
        name: 'Group Task',
        slug: '',
        permission: 'Store-Group Task',
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/group-task/add',
            permission: 'Store-Group Task',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/group-task',
            permission: 'Store-Group Task',
            scope:''
          },
        ]
      },
      {
        name: 'Plant and Production',
        slug: '',
        permission: 'Store-Plant Production', 
        childMenu:[
          {
            name: 'Add',
            url: '/pms/store/procurement/plant-prod/create',
            permission: 'Store-Plant Production',
            scope:'add'
          },
          {
            name: 'List',
            url: '/pms/store/procurement/plant-prod',
            permission: 'Store-Plant Production',
            scope:''
          },
        ]
      }
     
    ]

  }

  moduleChange( changedByUser : boolean ) {
    this.sidebarMenu=[]
    this.dataShareService.saveLocalData('ActiveModule',this.activeModuleData);

    if (this.activeModuleData == 'Store') {
      this.defaultSidebar()
      this.storeMaster()
      this.storeTransaction()
      if(changedByUser) {
        this.routeTransfer('/pms/store/procurement/dashboard')
      }
    } else if (this.activeModuleData == 'Purchase') {
      this.defaultSidebar()
      this.purchaseMaster()
      this.purchaseTransaction()
      if(changedByUser) {
        this.routeTransfer('/pms/purchase/procurement/dashboard')
      }
    } else if (this.activeModuleData == 'Tender') {
      this.tenderModule()
      if(changedByUser) {
        this.routeTransfer('/pms/tender/evaluations-summary')
      }
    } else if (this.activeModuleData == 'User Management') {
      this.userModule()
      if(changedByUser) {
        this.routeTransfer('/pms/usermanagement/manageUser')
      }
    } else if (this.activeModuleData == 'Project') {
      this.projectModule()
      if(changedByUser) {
        this.routeTransfer('/pms/project')
      }
    } else if (this.activeModuleData == 'Plant & Machinery') {
      this.plantMachineryModule()
      if(changedByUser) {
        this.routeTransfer('/pms/plant_machinary')
      }
    } else if (this.activeModuleData == 'Insurance') {
      this.insuranceModule()
      if(changedByUser) {
        this.routeTransfer('/pms/insurance/insurance')
      }
    } else if (this.activeModuleData == 'Dashboard') {
      if(changedByUser) {
        this.routeTransfer('/pms/dashbord')
      }
    } else {
      if(changedByUser) {
        this.routeTransfer('/pms/dashbord')
      }
    }
  }

  NavigateToSetting(navTarget: string, navName: string) {
    this.commonFunction.NavigateToSetting(navTarget, navName)
  }

  openNav(data: any) {

    var sidebar = <HTMLVideoElement>document.querySelector('#mySidebar')

    if (data == true) {
      sidebar.style.width = "200px";
      this.titleDisplay = true;
      sidebar.style.top = "65px";
    } else {
      sidebar.style.width = "50px";
      this.titleDisplay = false;
      sidebar.style.top = "65px";
    }
  }


  permissionScope = ['add','delete','edit','export','level_permission','view']
  getPermissionchild(moduleName: string, actionName : string) {
    
    let scope = moduleName in this.permissionData
    if (!scope) {
      this.permissionData[moduleName] = this.accessPermissionService.getModulePermissions(moduleName)
    }
    if(actionName == '') {
      return this.permissionData[moduleName].level_permission
    }else {
      if(this.permissionScope.includes(actionName)) {
        return this.permissionData[moduleName][actionName]
      } else {
        /// Scope for Approver Permissions 
        let innerscope = 'userApprovalPermissions' in this.permissionData
        if (!innerscope) {
          this.permissionData['userApprovalPermissions'] = this.userData.user_permissions
        }
        if(this.permissionData['userApprovalPermissions'].includes(actionName)) {
          return true
        } else {
          return false
        }
      }
    }

  }

  openMainMenu(menuName:any) {
    if(menuName == 'Master' && this.router.url.indexOf('/pms/settings') > -1) {
      return true
    } else if(menuName == 'Transactions' && this.transactionActiveModule != '') {
      return true
    } else if(menuName == 'Tender Management' && this.router.url.indexOf('/pms/tender') > -1) {
      return true
    } else if(menuName == 'Administration' && this.router.url.indexOf('/pms/usermanagement') > -1) {
      return true
    } else {
      return false
    }
  }


  openMenu(routeurl:any,value:any){
    let menu = false;
    if(value.childMenu) {
      value.childMenu.forEach((data:any)=>{
        if(data.url==routeurl){
          menu=true;
        }
      })
    }
    return menu;
  }
}
