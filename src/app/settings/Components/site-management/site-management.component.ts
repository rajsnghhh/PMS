import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/Shared/Services/api.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { PaginationService } from 'src/app/Shared/Services/pagination.service';

@Component({
  selector: 'app-site-management',
  templateUrl: './site-management.component.html',
  styleUrls: ['./site-management.component.scss',
    '../../../../assets/scss/scrollableTable.scss']
})
export class SiteManagementComponent {
  localStorageData: any;
  siteList: Array<any> = [];
  userPermissions: any = {};
  pageSize: any = 10;
  page: any = 1;
  paginationValue: any;

  constructor(
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private toastrService: ToastrService,
    private commonFunction: CommonFunctionService,
    private paginationservice: PaginationService
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewSiteList();
    this.getUserPermission();
  }

  viewSiteList() {
    // let params = new URLSearchParams();
    // params.set('organization_id', this.localStorageData.organisation_details[0].id);
    // this.apiservice.getPlantMachineryList(params).subscribe(data => {
    //   this.paginationservice.setTotalItemData(data.count);
    //   this.siteList = data.results;
    // })

    this.siteList = [
      {
        "id": 60,
        "plant_machinery_data": [
          {
            "id": 845,
            "form_label": "Plant & Equipment",
            "value": "Water Tanker (12 KL)",
            "document": "",
            "internal_name": "plant___equipment"
          },
          {
            "id": 846,
            "form_label": "UoM for Productivities",
            "value": "KL",
            "document": "",
            "internal_name": "uom_for_productivities"
          },
          {
            "id": 847,
            "form_label": "Productivities",
            "value": "12.00",
            "document": "",
            "internal_name": "productivities"
          },
          {
            "id": 848,
            "form_label": "Capital Cost",
            "value": "2025000.00",
            "document": "",
            "internal_name": "capital_cost"
          },
          {
            "id": 849,
            "form_label": "Depreciation norms per month",
            "value": "1.19",
            "document": "",
            "internal_name": "depreciation_norms_per_month"
          },
          {
            "id": 850,
            "form_label": "Efficiency Norms",
            "value": "85.00",
            "document": "",
            "internal_name": "efficiency_norms"
          },
          {
            "id": 851,
            "form_label": "Month Hours",
            "value": "260.00",
            "document": "",
            "internal_name": "month_hours"
          },
          {
            "id": 852,
            "form_label": "Depriciation Cost",
            "value": 109.04,
            "document": "",
            "internal_name": "depriciation_cost"
          },
          {
            "id": 853,
            "form_label": "HSD Norms (Lit/Hr)",
            "value": "9.00",
            "document": "",
            "internal_name": "hsd_norms__lit_hr_"
          },
          {
            "id": 854,
            "form_label": "HSD Rate  (Rs/ Litr)",
            "value": "107.00",
            "document": "",
            "internal_name": "hsd_rate___rs__litr"
          },
          {
            "id": 855,
            "form_label": "HSD Cost (Rs) (B)",
            "value": "963.00",
            "document": "",
            "internal_name": "hsd_cost__rs___b_"
          },
          {
            "id": 856,
            "form_label": "Lube Norms (Lit/Hr)",
            "value": "0.30",
            "document": "",
            "internal_name": "lube_norms__lit_hr"
          },
          {
            "id": 857,
            "form_label": "Lube Rate  (Rs/ Litr)",
            "value": "190.00",
            "document": "",
            "internal_name": "lube_rate__rs__litr"
          },
          {
            "id": 858,
            "form_label": "Lube Cost (Rs)",
            "value": "57.00",
            "document": "",
            "internal_name": "lube_cost__rs___c_"
          },
          {
            "id": 859,
            "form_label": "Spare Norms & Cost (Rs/Hr)",
            "value": "67.50",
            "document": "",
            "internal_name": "spare_norms_&_cost__rs_hr"
          },
          {
            "id": 860,
            "form_label": "Sum (E=A+B+C+D)",
            "value": "1196.5384615384614",
            "document": "",
            "internal_name": "total_sum_plant_machinery"
          },
          {
            "id": 861,
            "form_label": "Mob & Demob Norms",
            "value": "0.10",
            "document": "",
            "internal_name": "mob___demob_norms"
          },
          {
            "id": 862,
            "form_label": "Cost of Mob & Demob Exp.",
            "value": "1.20",
            "document": "",
            "internal_name": "cost_of_mob___demob_exp_"
          },
          {
            "id": 863,
            "form_label": "Prelim Exp Civil",
            "value": "0.44",
            "document": "",
            "internal_name": "prelim_exp"
          },
          {
            "id": 864,
            "form_label": "Cost of Wear & Tear/Denting & Painting/Replacement & BD Exp./Cost of Insurance-part of Prelim Exp",
            "value": "5.26",
            "document": "",
            "internal_name": "cost_of_wear___tear_denting___painting_replacement___bd_exp_cost_of_insurance_part_of_prelim_exp"
          },
          {
            "id": 865,
            "form_label": "Opearators Batta (Rs/ Hr.) (H)",
            "value": "57.69",
            "document": "",
            "internal_name": "opearators_batta__rs__hr"
          },
          {
            "id": 866,
            "form_label": "Weighted Component of Prelim Exp & IDC-2 Projects (On E)",
            "value": "0.22",
            "document": "",
            "internal_name": "weighted_component_of_prelim_exp___idc_2_projects__on_e_"
          },
          {
            "id": 867,
            "form_label": "Cost of Weighted Component of Prelim Exp & IDC (Rs/Hr)",
            "value": "2.63",
            "document": "",
            "internal_name": "cost_of_weighted_component_of_prelim_exp___idc__rs"
          },
          {
            "id": 868,
            "form_label": "Total Internal Hire Charges",
            "value": "1263.00",
            "document": "",
            "internal_name": "total_internal_hire_charges"
          },
          {
            "id": 869,
            "form_label": "External HC incl. Vendors OH & Profit",
            "value": "1453.00",
            "document": "",
            "internal_name": "external_hc_incl__vendors_oh___profit"
          },
          {
            "id": 870,
            "form_label": "Monthly Hire Charges",
            "value": "4.00",
            "document": "",
            "internal_name": "monthly_hire_charges"
          }
        ],
        "is_deleted": false,
        "created_at": "2023-07-05T19:11:01.466875+05:30",
        "updated_at": "2023-07-05T19:11:01.467559+05:30",
        "created_by": 1,
        "updated_by": null,
        "organization": 1
      }
    ]
  }

  getUserPermission() {
    // this.userPermissions = this.commonFunction.getUserPermission('Manage User');
  }

  getPaginate() {
    this.paginationservice.getPaginationData().subscribe(newPaginationData => {
      if (newPaginationData) {
        this.paginationValue = newPaginationData;
      }
    });
    this.pageSize = this.paginationValue.pagesizeValue;
    this.page = this.paginationValue.pagevalue;
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('page', this.paginationValue.pagevalue)
    params.set('page_size', this.paginationValue.pagesizeValue)

    // this.apiservice.getZoneList(params).subscribe(data => {
    //   this.vendorList = data.results;    
    // })

  }


}
