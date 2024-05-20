import { Injectable } from '@angular/core';
import { AccessPermissionService } from './access-permission.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataSharedService } from './data-shared.service';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {

  constructor(
    private accessPermissionService: AccessPermissionService,
    private toastrService: ToastrService,
    private router: Router,
    private dataShareService: DataSharedService
  ) { }

  getURL(data: any) {

    let params = new URLSearchParams();
    for (let key in data) {
      params.set(key, data[key])
    }
    return params.toString();

  }

  getUserPermission(moduleName: string) {
    return this.accessPermissionService.getModulePermissions(moduleName)
  }

  filterdynamicformData(key : any,data : any) {
    let filter = data.filter((item: { internal_name: any; }) => item.internal_name == key)
    if(filter.length > 0) {
      return filter[0].value
    } else {
      return ''
    }
  }


  NavigateToSetting(navTarget: string, navName: string) {
    let activeProduct = this.dataShareService.getLocalData('activeProduct');
    if (navTarget == 'manage-profile-permission') {
      this.navigateAndReload('/' + activeProduct + '/usermanagement/manageProfile');
    } else if (navTarget == 'module-configurations') {
      this.navigateAndReload('/' + activeProduct + '/settings/module-configuration');
    } else if (navTarget == 'email-template') {
      this.navigateAndReload('/' + activeProduct + '/settings/email-config');
    } else if (navTarget == 'sms-template') {
      this.navigateAndReload('/' + activeProduct + '/settings/sms-config');
    } else if (navTarget == 'location-and-zone') {
      this.navigateAndReload('/' + activeProduct + '/settings/location-zone');
    } else if (navTarget == 'company-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/companyMaster');
    } else if (navTarget == 'employment-type') {
      this.navigateAndReload('/' + activeProduct + '/settings/employmentType');
    } else if (navTarget == 'department') {
      this.navigateAndReload('/' + activeProduct + '/settings/department');
    } else if (navTarget == 'manage-user') {
      this.navigateAndReload('/' + activeProduct + '/usermanagement/manageUser');
    } else if (navTarget == 'archived-list') {
      this.navigateAndReload('/' + activeProduct + '/usermanagement/archived-user');
    } else if (navTarget == 'role') {
      this.navigateAndReload('/' + activeProduct + '/settings/role');
    } else if (navTarget == 'labour-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/labour');
    } else if (navTarget == 'rate-contract') {
      this.navigateAndReload('/' + activeProduct + '/settings/rate-contract');
    } else if (navTarget == 'freight-contract') {
      this.navigateAndReload('/' + activeProduct + '/settings/freight-Contract');
    } else if (navTarget == 'merger-transport-name') {
      this.navigateAndReload('/' + activeProduct + '/settings/merger-transport-name');
    } else if (navTarget == 'wbs-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/wbs');
    } else if (navTarget == 'employer-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/employee-master');
    } else if (navTarget == 'site-wise-stock-level-purchase') {
      this.navigateAndReload('/' + activeProduct + '/settings/site-wise');
    } else if (navTarget == 'multi-stage-purchase') {
      this.navigateAndReload('/' + activeProduct + '/settings/multi-stage');
    } else if (navTarget == 'general-setting-purchase') {
      this.navigateAndReload('/' + activeProduct + '/settings/general-setting');
    } else if (navTarget == 'jv-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/jv-priroty-master');
    } else if (navTarget == 'stand-alone-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/standalone-master');
    } else if (navTarget == 'vendor-master' && navName=='Vendor Master') {
      this.navigateAndReload('/' + activeProduct + '/settings/vendor-management-store');
    } else if (navTarget == 'vendor-master' && navName=='Vendor Masters') {
      this.navigateAndReload('/' + activeProduct + '/settings/vendor-management-purchase');
    } else if (navTarget == 'unit-of-measurements-uom' && navName=='Item Measurement Unit') {
      this.navigateAndReload('/' + activeProduct + '/settings/unit-of-measurement-purchase');
    } else if (navTarget == 'unit-of-measurements-uom' && navName=='Unit Of Measurements (UOM)') {
      this.navigateAndReload('/' + activeProduct + '/settings/unit-of-measurement-store');
    } else if (navTarget == 'material-group' && navName=='Material Group Store') {
      this.navigateAndReload('/' + activeProduct + '/settings/material-types-store');
    } else if (navTarget == 'material-group' && navName=='Material Group Purchase') {
      this.navigateAndReload('/' + activeProduct + '/settings/material-types-purchase');
    } else if (navTarget == 'material-sub-group') {
      this.navigateAndReload('/' + activeProduct + '/settings/material-sub-group');
    } else if (navTarget == 'material-cost-heads') {
      this.navigateAndReload('/' + activeProduct + '/settings/material-cost-head');
    } else if (navTarget == 'material-natureproperties') {
      this.navigateAndReload('/' + activeProduct + '/settings/material-nature-properties');
    } else if (navTarget == 'indirect-cost-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/idc');
    }  else if (navTarget == 'rack-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/rack-master');
    } else if (navTarget == 'sectionrack-setting') {
      this.navigateAndReload('/' + activeProduct + '/settings/section-rack-setting');
    } else if (navTarget == 'sectionrack-setting-purchase') {
      this.navigateAndReload('/' + activeProduct + '/settings/section-rack-setting-purchase');
    } else if (navTarget == 'transportation-rate') {
      this.navigateAndReload('/' + activeProduct + '/settings/transport-rate');
    } else if (navTarget == 'terms-conditions') {
      this.navigateAndReload('/' + activeProduct + '/settings/terms-conditions');
    } else if (navTarget == 'lab-testing-parameters') {
      this.navigateAndReload('/' + activeProduct + '/settings/lab-testing-parameters');
    } else if (navTarget == 'brand') {
      this.navigateAndReload('/' + activeProduct + '/settings/brand');
    } else if (navTarget == 'expense-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/expense-master');
    } else if (navTarget == 'model') {
      this.navigateAndReload('/' + activeProduct + '/settings/model');
    } else if (navTarget == 'asset-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/asset-master');
    } else if (navTarget == 'item-wise-list' && navName=='Item wise list') {
      this.navigateAndReload('/' + activeProduct + '/settings/itemwise-vendor-store');
    } else if (navTarget == 'item-wise-list' && navName=='Item Wise Vendor List') {
      this.navigateAndReload('/' + activeProduct + '/settings/itemwise-vendor-purchase');
    } else if (navTarget == 'tax') {
      this.navigateAndReload('/' + activeProduct + '/settings/tax-management');
    } else if (navTarget == 'material-master') {
      this.navigateAndReload('/' + activeProduct + '/settings/material-management');
    } else if (navTarget == 'month-financial-year-lock') {
      this.navigateAndReload('/' + activeProduct + '/settings/lock-financial-year');
    } else if (navTarget == 'delay-reasons') {
      this.navigateAndReload('/' + activeProduct + '/settings/delay-reason');
    } else if (navTarget == 'tender-workflow') {
      this.navigateAndReload('/' + activeProduct + '/settings/workflow');
    } else if (navTarget == 'approval-doctype') {
      this.navigateAndReload('/' + activeProduct + '/settings/approval-doc-type');
    } else if (navTarget == 'indent-approval-purchase') {
      this.navigateAndReload('/' + activeProduct + '/settings/prcurement-settings/indent');
    } else if (navTarget == 'po-approval-purchase') {
      this.navigateAndReload('/' + activeProduct + '/settings/prcurement-settings/po');
    } else if (navTarget == 'wo-approval-purchase') {
      this.navigateAndReload('/' + activeProduct + '/settings/prcurement-settings/wo');
    } else if (navTarget == 'closing-stock-trn-to-next-year') {
      this.navigateAndReload('/' + activeProduct + '/settings/closing-stock-trn');
    } else if (navTarget == 'project-workflow') {
      this.openOnNewTab('/coming-soon')
      // this.toastrService.error(navName + " Module not configured yet !!", '', {
      //   timeOut: 2000,
      // });
    } else if (navTarget == 'procurement-workflow') {
      this.openOnNewTab('/coming-soon')
      // this.toastrService.error(navName + " Module not configured yet !!", '', {
      //   timeOut: 2000,
      // });
    } else if (navTarget == 'plant-machinery') {
      this.navigateAndReload('/' + activeProduct + '/plant_machinary');
    } else {
      this.openOnNewTab('/coming-soon')
      // this.toastrService.error(navName + " Module configuration not found !!", '', {
      //   timeOut: 2000,
      // });
    }
  }

  doubleDegit(data:any) {
    let Number = parseInt(data)
    if(Number < 10 && Number >=0 ) {
      data = '0'+data
    }
    return data
  }


  navigateAndReload(nav: string) {
    this.openOnNewTab(nav)
  }


  download(url: any, filename: any) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      })
      .catch(console.error);
  }

  getFinancialYear(data: any) {
    let Year = new Date().getFullYear()
    let Month = new Date().getMonth();
    let start = '01-04-'
    let end = '31-03-'
    if (Month <= 2 && data.financial_year_start_month == 4 && data.financial_year_end_month == 3) {
      Year--;
      start = '01-01-'
      end = '31-12-'
    }

    start = start + Year
    end = end + (Number(Year) + 1).toString()

    return Year + '||' + start + '||' + end
  }


  takeToSFT() {
    let url = 'https://shyamfuture.com/'
    window.open(url, "_blank");
  }

  openOnNewTab(link:string) {
    this.router.navigate([]).then(result => {  window.open(window.location.href.split('/pms')[0]+link, '_blank'); });
  }

}
