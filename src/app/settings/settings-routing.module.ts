import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyMasterComponent } from './Components/company-master/company-master.component';
import { EditCompanyComponent } from './Components/company-master/edit-company/edit-company.component';
import { DepartmentComponent } from './Components/department/department.component';
import { DesignationComponent } from './Components/designation/designation.component';
import { EmailSmsConfigurationComponent } from './Components/email-sms-configuration/email-sms-configuration.component';
import { EmploymentTypeComponent } from './Components/employment-type/employment-type.component';
import { LocationZoneComponent } from './Components/location-zone/location-zone.component';
import { AddNewFieldComponent } from './Components/module-configuration/add-new-field/add-new-field.component';
import { EditModuleComponent } from './Components/module-configuration/edit-module/edit-module.component';
import { ModuleConfigurationComponent } from './Components/module-configuration/module-configuration.component';
import { UpdateFieldComponent } from './Components/module-configuration/update-field/update-field.component';
import { SmsConfigurationComponent } from './Components/sms-configuration/sms-configuration.component';
import { WorkflowListComponent } from './Components/workflow-list/workflow-list.component';
import { WorkFlowComponent } from './Components/work-flow/work-flow.component';
import { SettingDetailsComponent } from './setting-details/setting-details.component';
import { EmployeeMasterComponent } from './Components/employee-master/employee-master.component';
import { JvPrirotyMasterComponent } from './Components/jv-priroty-master/jv-priroty-master.component';
import { StandaloneMasterComponent } from './Components/standalone-master/standalone-master.component';
import { VendorManagementComponent } from './Components/vendor-management/vendor-management.component';
import { SiteManagementComponent } from './Components/site-management/site-management.component';
import { MaterialManagementComponent } from './Components/material-management/material-management.component';
import { ProjectTypesIdCategoriesComponent } from './Components/project-types-id-categories/project-types-id-categories.component';
import { UnitOfMeasurementComponent } from './Components/material-management/unit-of-measurement/unit-of-measurement.component';
import { MaterialTypesComponent } from './Components/material-management/material-types/material-types.component';
import { MaterialCostHeadsComponent } from './Components/material-management/material-cost-heads/material-cost-heads.component';
import { MaterialNaturePropertiesComponent } from './Components/material-management/material-nature-properties/material-nature-properties.component';
import { DelayReasonComponent } from './Components/delay-reason/delay-reason.component';
import { PlanningStructureComponent } from './Components/planning-structure/planning-structure/planning-structure.component';
import { LabourMasterComponent } from './Components/labour-master/labour-master.component';
import { IdcComponent } from './Components/idc/idc.component';
import { WbsMasterComponent } from './Components/wbs-master/wbs-master.component';
import { AuthGuardGuard } from '../Shared/Guard/auth-guard.guard';
import { MaterialSubGroupComponent } from './Components/material-management/material-sub-group/material-sub-group.component';
import { VenderMergeComponent } from './Components/vendor-management/vender-merge/vender-merge.component';
import { ItemwiseVendorComponent } from './Components/vendor-management/itemwise-vendor/itemwise-vendor.component';
import { RackMasterComponent } from './Components/rack-master/rack-master.component';
import { SectionRackSettingComponent } from './Components/section-rack-setting/section-rack-setting.component';
import { MaterialGroupTreeComponent } from './Components/material-management/material-group-tree/material-group-tree.component';
import { TransportRateComponent } from './Components/transport-rate/transport-rate.component';
import { BrandComponent } from './Components/brand/brand.component';
import { TaxManagementComponent } from './Components/tax-management/tax-management.component';
import { MergeUnitOfMeasurementComponent } from './Components/material-management/unit-of-measurement/merge-unit-of-measurement/merge-unit-of-measurement.component';
import { UnitUsedDetailsComponent } from './Components/material-management/unit-of-measurement/unit-used-details/unit-used-details.component';
import { MaterialGroupMergeComponent } from './Components/material-management/material-group-merge/material-group-merge.component';
import { RestrictGroupComponent } from './Components/material-management/restrict-group/restrict-group.component';
import { UnassignedAdvancedSearchComponent } from './Components/vendor-management/unassigned-advanced-search/unassigned-advanced-search.component';
import { FinalcialYearLockingComponent } from './Components/finalcial-year-locking/finalcial-year-locking.component';
import { RestrictDataListComponent } from './Components/material-management/restrict-data-list/restrict-data-list.component';
import { MaterialItemMergeComponent } from './Components/material-management/material-item-merge/material-item-merge.component';
import { MultipleItemsComponent } from './Components/material-management/multiple-items/multiple-items.component';
import { RateContractComponent } from './Components/rate-contract/rate-contract.component';
import { FreightContractComponent } from './Components/freight-contract/freight-contract.component';
import { TermsAndConditionsComponent } from './Components/terms-and-conditions/terms-and-conditions.component';
import { ApprovalDocTypeComponent } from './Components/approval-doc-type/approval-doc-type.component';
import { AddGstComponent } from './Components/tax-management/add-gst/add-gst.component';
import { ClosingStockTRNComponent } from './Components/closing-stock-trn/closing-stock-trn.component';
import { ProcurementSettingsComponent } from './Components/procurement-settings/procurement-settings.component';
import { ModelComponent } from './Components/model/model.component';
import { AssetComponent } from './Components/asset/asset.component';
import { MultiStageComponent } from './Components/multi-stage/multi-stage.component';
import { SiteWiseStockComponent } from './Components/site-wise-stock/site-wise-stock.component';
import { GeneralSettingsComponent } from './Components/general-settings/general-settings.component';
import { LabTestingParametersComponent } from './Components/lab-testing-parameters/lab-testing-parameters.component';
import { DepreciationGroupComponent } from './Components/asset/depreciation-group/depreciation-group.component';
import { ExpenseMasterComponent } from './Components/expense-master/expense-master.component';
import { MergerTransportNameComponent } from './Components/merger-transport-name/merger-transport-name.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'setting-details',
    pathMatch: 'full'
  },
  {
    path: 'companyMaster',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Company Master']},
    component: CompanyMasterComponent,
    pathMatch: 'full'
  },
  {
    path: 'department',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Department']},
    component: DepartmentComponent,
    pathMatch: 'full'
  },
  {
    path: 'role',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Role']},
    component: DesignationComponent,
    pathMatch: 'full'
  },
  {
    path: 'employmentType',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Employment Type']},
    component: EmploymentTypeComponent,
    pathMatch: 'full'
  },
  {
    path: 'location-zone',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Location and Zone']},
    component: LocationZoneComponent,
    pathMatch: 'full'
  },
  {
    path: 'editcompany',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Company Master']},
    component: EditCompanyComponent,
    pathMatch: 'full'
  },
  {
    path: 'module-configuration',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Module Configurations']},
    component: ModuleConfigurationComponent,
    pathMatch: 'full'
  },
  {
    path: 'module-configuration/edit',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Module Configurations']},
    component: EditModuleComponent,
    pathMatch: 'full',
  },
  {
    path: 'module-configuration/add',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Module Configurations']},
    component: AddNewFieldComponent,
    pathMatch: 'full',
  },
  {
    path: 'module-configuration/update',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Module Configurations']},
    component: UpdateFieldComponent,
    pathMatch: 'full',
  },
  {
    path: 'email-config',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Email Template']},
    component: EmailSmsConfigurationComponent,
    pathMatch: 'full',
  },
  {
    path: 'sms-config',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting SMS Template']},
    component: SmsConfigurationComponent,
    pathMatch: 'full',
  },
  {
    path: 'workflow-list',
    component: WorkflowListComponent,
    pathMatch: 'full',
  },
  {
    path: 'workflow',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Tender Workflow']},
    component: WorkFlowComponent
  },
  {
    path: 'setting-details',
    canActivate: [AuthGuardGuard],
    component: SettingDetailsComponent,
    pathMatch: 'full',
  },
  {
    path: 'employee-master',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Employer Master']},
    component: EmployeeMasterComponent,
    pathMatch: 'full'
  },
  {
    path: 'jv-priroty-master',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting JV MASTER']},
    component: JvPrirotyMasterComponent,
    pathMatch: 'full'
  },
  {
    path: 'standalone-master',
    component: StandaloneMasterComponent,
    pathMatch: 'full'
  },
 
  {
    path: 'itemwise-vendor-store',
    canActivate: [AuthGuardGuard],
    component: ItemwiseVendorComponent,
    data: {url: ['Setting Item wise list']},
    pathMatch: 'full'
  },
  {
    path: 'itemwise-vendor-purchase',
    canActivate: [AuthGuardGuard],
    component: ItemwiseVendorComponent,
    data: {url: ['Setting Item Wise Vendor List']},
    pathMatch: 'full'
  },
  {
    path: 'unassigned-vendor',
    canActivate: [AuthGuardGuard],
    component: UnassignedAdvancedSearchComponent,
    data: {url: ['Setting Vendor Masters']},
    pathMatch: 'full'
  },
  {
    path: 'merger-transport-name',
    canActivate: [AuthGuardGuard],
    component: MergerTransportNameComponent,
    data: {url: ['Setting Merger Transport Name']},
    pathMatch: 'full'
  },
  {
    path: 'vender-merge',
    canActivate: [AuthGuardGuard],
    component: VenderMergeComponent,
    data: {url: ['Setting Vendor Masters']},
    pathMatch: 'full'
  },
  
  {
    path: 'vendor-management-store',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Vendor Master']},
    component: VendorManagementComponent,
    pathMatch: 'full'
  },
  {
    path: 'vendor-management-purchase',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Vendor Masters']},
    component: VendorManagementComponent,
    pathMatch: 'full'
  },
  {
    path: 'site-management',
    component: SiteManagementComponent,
    pathMatch: 'full'
  },
  {
    path: 'project-id',
    component: ProjectTypesIdCategoriesComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-management',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Master']},
    component: MaterialManagementComponent,
    pathMatch: 'full'
  },
  {
    path: 'tax-management',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Tax']},
    component: TaxManagementComponent,
    pathMatch: 'full'
  },
  {
    path: 'add-gst',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Tax']},
    component: AddGstComponent,
    pathMatch: 'full'
  },
  {
    path: 'update-gst/:taxId',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Tax']},
    component: AddGstComponent,
    pathMatch: 'full'
  },
  {
    path: 'unit-of-measurement-store',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Unit Of Measurements (UOM)']},
    component: UnitOfMeasurementComponent,
    pathMatch: 'full'
  },
  {
    path: 'unit-of-measurement-purchase',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Item Measurement Unit']},
    component: UnitOfMeasurementComponent,
    pathMatch: 'full'
  },
  {
    path: 'merge-unit-of-measurement',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Item Measurement Unit']},
    component: MergeUnitOfMeasurementComponent,
    pathMatch: 'full'
  },
  {
    path: 'unit-used-details',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Item Measurement Unit']},
    component: UnitUsedDetailsComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-nature-properties',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Nature/Properties']},
    component: MaterialNaturePropertiesComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-cost-head',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Cost Heads']},
    component: MaterialCostHeadsComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-types-store',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Group Store']},
    component: MaterialTypesComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-types-purchase',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Group Purchase']},
    component: MaterialTypesComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-sub-group',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Sub Group']},
    component: MaterialSubGroupComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-group-tree',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Group Store']},
    component: MaterialGroupTreeComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-group-merge',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Group Purchase']},
    component: MaterialGroupMergeComponent,
    pathMatch: 'full'
  },
  {
    path: 'material-item-merge',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Master']},
    component: MaterialItemMergeComponent,
    pathMatch: 'full'
  },
  {
    path: 'multiple-items',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Master']},
    component: MultipleItemsComponent,
    pathMatch: 'full'
  },
  {
    path: 'restrict-group',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Group Purchase']},
    component: RestrictGroupComponent,
    pathMatch: 'full'
  },
  {
    path: 'restrict-group-list',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Material Group Purchase']},
    component: RestrictDataListComponent,
    pathMatch: 'full'
  },
  {
    path: 'delay-reason',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Delay Reasons']},
    component: DelayReasonComponent,
    pathMatch: 'full'
  },
  {
    path: 'model',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Model']},
    component: ModelComponent,
    pathMatch: 'full'
  },
  {
    path: 'asset-master',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Asset Master']},
    component: AssetComponent,
    pathMatch: 'full'
  },
  {
    path: 'depreciation-group',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Asset Master']},
    component: DepreciationGroupComponent,
    pathMatch: 'full'
  },
  {
    path: 'planning-structure',
    component: PlanningStructureComponent,
    pathMatch: 'full'
  },
  {
    path: 'wbs',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Wbs Master']},
    component: WbsMasterComponent,
    pathMatch: 'full'
  },
  {
    path: 'labour',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Labour Master']},
    component: LabourMasterComponent,
    pathMatch: 'full'
  },
  {
    path: 'idc',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Indirect Cost Master']},
    component: IdcComponent,
    pathMatch: 'full'
  },
  {
    path: 'rack-master',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Rack Master']},
    component: RackMasterComponent,
    pathMatch: 'full'
  },
  {
    path: 'section-rack-setting',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Section/Rack setting']},
    component: SectionRackSettingComponent,
    pathMatch: 'full'
  },
  {
    path: 'section-rack-setting-purchase',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Section/Rack setting Purchase']},
    component: SectionRackSettingComponent,
    pathMatch: 'full'
  },
  {
    path: 'transport-rate',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Transportation Rate']},
    component: TransportRateComponent,
    pathMatch: 'full'
  },
  {
    path: 'terms-conditions',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Terms & Conditions']},
    component: TermsAndConditionsComponent,
    pathMatch: 'full'
  },
  {
    path: 'lab-testing-parameters',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Lab Testing Parameters']},
    component: LabTestingParametersComponent,
    pathMatch: 'full'
  },
  {
    path: 'brand',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Brand']},
    component: BrandComponent,
    pathMatch: 'full'
  },
  {
    path: 'expense-master',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Expense Master']},
    component: ExpenseMasterComponent,
    pathMatch: 'full'
  },
  {
    path: 'lock-financial-year',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Month Financial Year Lock (Store / Purchase)']},
    component: FinalcialYearLockingComponent,
    pathMatch: 'full'
  },
  {
    path: 'freight-Contract',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Freight Contract']},
    component: FreightContractComponent,
    pathMatch: 'full'
  },
  {
    path: 'rate-contract',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Rate Contract']},
    component: RateContractComponent,
    pathMatch: 'full'
  },
  {
    path: 'approval-doc-type',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Approval Doctype']},
    component: ApprovalDocTypeComponent,
    pathMatch: 'full'
  },
  {
    path: 'closing-stock-trn',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Closing Stock TRN. To Next Year']},
    component: ClosingStockTRNComponent,
    pathMatch: 'full'
  },
  {
    path: 'prcurement-settings/po',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting PO Approval Setting']},
    component: ProcurementSettingsComponent,
    pathMatch: 'full'
  },
  {
    path: 'prcurement-settings/wo',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting WO Approval Setting']},
    component: ProcurementSettingsComponent,
    pathMatch: 'full'
  },
  {
    path: 'prcurement-settings/indent',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Indent Approval Setting']},
    component: ProcurementSettingsComponent,
    pathMatch: 'full'
  },
  {
    path: 'general-setting',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting General Setting']},
    component: GeneralSettingsComponent,
    pathMatch: 'full'
  },
  {
    path: 'site-wise',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Site Wise Stock Level Setting']},
    component: SiteWiseStockComponent,
    pathMatch: 'full'
  },
  {
    path: 'multi-stage',
    canActivate: [AuthGuardGuard],
    data: {url: ['Setting Multi Stage Setting']},
    component: MultiStageComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
