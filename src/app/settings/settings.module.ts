import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { LocationZoneComponent } from './Components/location-zone/location-zone.component';
import { CompanyMasterComponent } from './Components/company-master/company-master.component';
import { EmploymentTypeComponent } from './Components/employment-type/employment-type.component';
import { DepartmentComponent } from './Components/department/department.component';
import { DesignationComponent } from './Components/designation/designation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AddLocationComponent } from './Components/location-zone/add-location/add-location.component';
import { AddCompanyComponent } from './Components/company-master/add-company/add-company.component';
import { AddDepartmentComponent } from './Components/department/add-department/add-department.component';
import { AddDesignationComponent } from './Components/designation/add-designation/add-designation.component';
import { AddEmploymentComponent } from './Components/employment-type/add-employment/add-employment.component';
import { EditCompanyComponent } from './Components/company-master/edit-company/edit-company.component';
import { PaginateModule } from '../Shared/Module/paginate/paginate.module';
import { EditDepartmentComponent } from './Components/department/edit-department/edit-department.component';
import { EditDesignationComponent } from './Components/designation/edit-designation/edit-designation.component';
import { EditEmployementComponent } from './Components/employment-type/edit-employement/edit-employement.component';
import { EditLocationComponent } from './Components/location-zone/edit-location/edit-location.component';
import { ModuleConfigurationComponent } from './Components/module-configuration/module-configuration.component';
import { EditModuleComponent } from './Components/module-configuration/edit-module/edit-module.component';
import { AddNewFieldComponent } from './Components/module-configuration/add-new-field/add-new-field.component';
import { FormFieldIMGPipe } from '../Shared/Pipes/form-field-img.pipe';
import { UpdateFieldComponent } from './Components/module-configuration/update-field/update-field.component';
import { EmailSmsConfigurationComponent } from './Components/email-sms-configuration/email-sms-configuration.component';
import { AddEmailSmsConfigurationComponent } from './Components/add-email-sms-configuration/add-email-sms-configuration.component';
import { EditEmailSmsConfigurationComponent } from './Components/edit-email-sms-configuration/edit-email-sms-configuration.component';
import { SmsConfigurationComponent } from './Components/sms-configuration/sms-configuration.component';
import { AddSmsConfigurationComponent } from './Components/add-sms-configuration/add-sms-configuration.component';
import { EditSmsConfigurationComponent } from './Components/edit-sms-configuration/edit-sms-configuration.component'
import { SharedModuleModule } from '../Shared/Module/shared-module/shared-module.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { WorkflowListComponent } from './Components/workflow-list/workflow-list.component';
import { WorkFlowComponent } from './Components/work-flow/work-flow.component';
import { AddNotificationComponent } from './Components/work-flow/add-notification/add-notification.component';
import { AddEventComponent } from './Components/work-flow/add-event/add-event.component';
import { EditNotificationComponent } from './Components/work-flow/edit-notification/edit-notification.component';
import { ConformationComponent } from './Components/work-flow/add-event/conformation/conformation.component';
import { EditEventComponent } from './Components/work-flow/edit-event/edit-event.component';
import { EditConformationComponent } from './Components/work-flow/edit-event/edit-conformation/edit-conformation.component';
import { UserEventComponent } from './Components/work-flow/add-event/user-event/user-event/user-event.component';
import { EditUserEventComponent } from './Components/work-flow/edit-event/edit-user-event/edit-user-event/edit-user-event.component';
import { DndModule } from 'ngx-drag-drop';
import { AddGroupComponent } from './Components/module-configuration/add-group/add-group.component';
import { UpdateGroupComponent } from './Components/module-configuration/update-group/update-group.component';
import { SettingDetailsComponent } from './setting-details/setting-details.component';
import { EmployeeMasterComponent } from './Components/employee-master/employee-master.component';
import { JvPrirotyMasterComponent } from './Components/jv-priroty-master/jv-priroty-master.component';
import { StandaloneMasterComponent } from './Components/standalone-master/standalone-master.component';
import { AddStandaloneMasterComponent } from './Components/standalone-master/add-standalone-master/add-standalone-master.component';
import { EditStandaloneMasterComponent } from './Components/standalone-master/edit-standalone-master/edit-standalone-master.component';
import { AddJvPrirotyMasterComponent } from './Components/jv-priroty-master/add-jv-priroty-master/add-jv-priroty-master.component';
import { EditJvPrirotyMasterComponent } from './Components/jv-priroty-master/edit-jv-priroty-master/edit-jv-priroty-master.component';
import { AddEmployeeMasterComponent } from './Components/employee-master/add-employee-master/add-employee-master.component';
import { EditEmployeeMasterComponent } from './Components/employee-master/edit-employee-master/edit-employee-master.component';
import { NoSpaceDirective } from '../Shared/Directive/no-space.directive';
import { VendorManagementComponent } from './Components/vendor-management/vendor-management.component';
import { AddVendorComponent } from './Components/vendor-management/add-vendor/add-vendor.component';
import { SiteManagementComponent } from './Components/site-management/site-management.component';
import { MaterialManagementComponent } from './Components/material-management/material-management.component';
import { ProjectTypesIdCategoriesComponent } from './Components/project-types-id-categories/project-types-id-categories.component';
import { AddMaterialComponent } from './Components/material-management/add-material/add-material.component';
import { AddProjectComponent } from './Components/project-types-id-categories/add-project/add-project.component';
import { AddSiteComponent } from './Components/site-management/add-site/add-site.component';
import { DynamicFormsModule } from "../Shared/Module/dynamic-forms/dynamic-forms.module";
import { VendorDetailsComponent } from './Components/vendor-management/vendor-details/vendor-details.component';
import { UnitOfMeasurementComponent } from './Components/material-management/unit-of-measurement/unit-of-measurement.component';
import { MaterialTypesComponent } from './Components/material-management/material-types/material-types.component';
import { MaterialCostHeadsComponent } from './Components/material-management/material-cost-heads/material-cost-heads.component';
import { MaterialNaturePropertiesComponent } from './Components/material-management/material-nature-properties/material-nature-properties.component';
import { AddMaterialCostHeadsComponent } from './Components/material-management/material-cost-heads/add-material-cost-heads/add-material-cost-heads.component';
import { EditMaterialCostHeadsComponent } from './Components/material-management/material-cost-heads/edit-material-cost-heads/edit-material-cost-heads.component';
import { AddMaterialNaturePropertiesComponent } from './Components/material-management/material-nature-properties/add-material-nature-properties/add-material-nature-properties.component';
import { EditMaterialNaturePropertiesComponent } from './Components/material-management/material-nature-properties/edit-material-nature-properties/edit-material-nature-properties.component';
import { AddMaterialTypesComponent } from './Components/material-management/material-types/add-material-types/add-material-types.component';
import { EditMaterialTypesComponent } from './Components/material-management/material-types/edit-material-types/edit-material-types.component';
import { AddUnitOfMeasurementComponent } from './Components/material-management/unit-of-measurement/add-unit-of-measurement/add-unit-of-measurement.component';
import { EditUnitOfMeasurementComponent } from './Components/material-management/unit-of-measurement/edit-unit-of-measurement/edit-unit-of-measurement.component';
import { MinMaxDirective } from '../Shared/Directive/maximum-length.directive';
import { DelayReasonComponent } from './Components/delay-reason/delay-reason.component';
import { AddDelayReasonComponent } from './Components/delay-reason/add-delay-reason/add-delay-reason.component';
import { EditDelayReasonComponent } from './Components/delay-reason/edit-delay-reason/edit-delay-reason.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { PlanningStructureComponent } from './Components/planning-structure/planning-structure/planning-structure.component';
import { AddPlanningStructureComponent } from './Components/planning-structure/add-planning-structure/add-planning-structure.component';
import { EditPlanningStructureComponent } from './Components/planning-structure/edit-planning-structure/edit-planning-structure.component';
import { LabourMasterComponent } from './Components/labour-master/labour-master.component';
import { LabourCanvasComponent } from './Components/labour-master/labour-canvas/labour-canvas.component';
import { IdcComponent } from './Components/idc/idc.component';
import { WbsMasterComponent } from './Components/wbs-master/wbs-master.component';
import { ExecutiveSummaryModule } from '../executive-summary/executive-summary.module';
import { AddUpdateLabourComponent } from './Components/labour-master/add-update-labour/add-update-labour.component';
import { AddUpdateIdcComponent } from './Components/idc/add-update-idc/add-update-idc.component';
import { MaterialSubGroupComponent } from './Components/material-management/material-sub-group/material-sub-group.component';
import { AddEditMaterialSubComponent } from './Components/material-management/material-sub-group/add-edit-material-sub/add-edit-material-sub.component';
import { VenderMergeComponent } from './Components/vendor-management/vender-merge/vender-merge.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { ItemwiseVendorComponent } from './Components/vendor-management/itemwise-vendor/itemwise-vendor.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddUpdateRackMasterComponent } from './Components/rack-master/add-update-rack-master/add-update-rack-master.component';
import { SectionRackSettingComponent } from './Components/section-rack-setting/section-rack-setting.component';
import { AddUpdateRackSettingComponent } from './Components/section-rack-setting/add-update-rack-setting/add-update-rack-setting.component';
import { RackMasterComponent } from './Components/rack-master/rack-master.component';
import { MaterialGroupTreeComponent } from './Components/material-management/material-group-tree/material-group-tree.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { A11yModule } from '@angular/cdk/a11y';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon'
import { TransportRateComponent } from './Components/transport-rate/transport-rate.component';
import { AddUpdateTransportRateComponent } from './Components/transport-rate/add-update-transport-rate/add-update-transport-rate.component';
import { BrandComponent } from './Components/brand/brand.component';
import { AddEditBrandComponent } from './Components/brand/add-edit-brand/add-edit-brand.component';
import { TaxManagementComponent } from './Components/tax-management/tax-management.component';
import { AdEditTaxComponent } from './Components/tax-management/ad-edit-tax/ad-edit-tax.component';
import { MergeUnitOfMeasurementComponent } from './Components/material-management/unit-of-measurement/merge-unit-of-measurement/merge-unit-of-measurement.component';
import { UnitUsedDetailsComponent } from './Components/material-management/unit-of-measurement/unit-used-details/unit-used-details.component';
import { MaterialGroupMergeComponent } from './Components/material-management/material-group-merge/material-group-merge.component';
import { RestrictGroupComponent } from './Components/material-management/restrict-group/restrict-group.component';
import { UnassignedAccountVendorComponent } from './Components/vendor-management/unassigned-account-vendor/unassigned-account-vendor.component';
import { UnassignedAdvancedSearchComponent } from './Components/vendor-management/unassigned-advanced-search/unassigned-advanced-search.component';
import { FinalcialYearLockingComponent } from './Components/finalcial-year-locking/finalcial-year-locking.component';
import { RestrictDataListComponent } from './Components/material-management/restrict-data-list/restrict-data-list.component';
import { MaterialItemMergeComponent } from './Components/material-management/material-item-merge/material-item-merge.component';
import { MultipleItemsComponent } from './Components/material-management/multiple-items/multiple-items.component';
import { FreightContractComponent } from './Components/freight-contract/freight-contract.component';
import { FreightContractAddEditComponent } from './Components/freight-contract/freight-contract-add-edit/freight-contract-add-edit.component';
import { RateContractComponent } from './Components/rate-contract/rate-contract.component';
import { RateContractAddEditComponent } from './Components/rate-contract/rate-contract-add-edit/rate-contract-add-edit.component';
import { TermsAndConditionsComponent } from './Components/terms-and-conditions/terms-and-conditions.component';
import { AddEditTermsConditionsComponent } from './Components/terms-and-conditions/add-edit-terms-conditions/add-edit-terms-conditions.component';
import { ApprovalDocTypeComponent } from './Components/approval-doc-type/approval-doc-type.component';
import { ApprovalDocTypeAddEditComponent } from './Components/approval-doc-type/approval-doc-type-add-edit/approval-doc-type-add-edit.component';
import { AddGstComponent } from './Components/tax-management/add-gst/add-gst.component';
import { ClosingStockTRNComponent } from './Components/closing-stock-trn/closing-stock-trn.component';
import { ProcurementSettingsComponent } from './Components/procurement-settings/procurement-settings.component';
import { ProcurementSettingsAddEditComponent } from './Components/procurement-settings/procurement-settings-add-edit/procurement-settings-add-edit.component';
import { ModelComponent } from './Components/model/model.component';
import { AddEditModelComponent } from './Components/model/add-edit-model/add-edit-model.component';
import { AssetComponent } from './Components/asset/asset.component';
import { AddEditAssetComponent } from './Components/asset/add-edit-asset/add-edit-asset.component';
import { GeneralSettingsComponent } from './Components/general-settings/general-settings.component';
import { SiteWiseStockComponent } from './Components/site-wise-stock/site-wise-stock.component';
import { MultiStageComponent } from './Components/multi-stage/multi-stage.component';
import { LabTestingParametersComponent } from './Components/lab-testing-parameters/lab-testing-parameters.component';
import { AddUpdateLabTestingComponent } from './Components/lab-testing-parameters/add-update-lab-testing/add-update-lab-testing.component';
import { DepreciationGroupComponent } from './Components/asset/depreciation-group/depreciation-group.component';
import { ExpenseMasterComponent } from './Components/expense-master/expense-master.component';
import { AddUpdateExpenseMasterComponent } from './Components/expense-master/add-update-expense-master/add-update-expense-master.component';
import { MergerTransportNameComponent } from './Components/merger-transport-name/merger-transport-name.component';



@NgModule({
    declarations: [
        LocationZoneComponent,
        CompanyMasterComponent,
        EmploymentTypeComponent,
        DepartmentComponent,
        DesignationComponent,
        AddLocationComponent,
        AddCompanyComponent,
        AddDepartmentComponent,
        AddDesignationComponent,
        AddEmploymentComponent,
        EditCompanyComponent,
        EditDepartmentComponent,
        EditDesignationComponent,
        EditEmployementComponent,
        EditLocationComponent,
        ModuleConfigurationComponent,
        EditModuleComponent,
        AddNewFieldComponent,
        FormFieldIMGPipe,
        UpdateFieldComponent,
        EmailSmsConfigurationComponent,
        AddEmailSmsConfigurationComponent,
        EditEmailSmsConfigurationComponent,
        SmsConfigurationComponent,
        AddSmsConfigurationComponent,
        EditSmsConfigurationComponent,
        WorkflowListComponent,
        WorkFlowComponent,
        AddNotificationComponent,
        AddEventComponent,
        EditNotificationComponent,
        ConformationComponent,
        EditEventComponent,
        EditConformationComponent,
        UserEventComponent,
        EditUserEventComponent,
        AddGroupComponent,
        UpdateGroupComponent,
        SettingDetailsComponent,
        EmployeeMasterComponent,
        JvPrirotyMasterComponent,
        StandaloneMasterComponent,
        AddStandaloneMasterComponent,
        EditStandaloneMasterComponent,
        AddJvPrirotyMasterComponent,
        EditJvPrirotyMasterComponent,
        AddEmployeeMasterComponent,
        EditEmployeeMasterComponent,
        NoSpaceDirective,
        MinMaxDirective,
        VendorManagementComponent,
        AddVendorComponent,
        SiteManagementComponent,
        MaterialManagementComponent,
        ProjectTypesIdCategoriesComponent,
        AddMaterialComponent,
        AddProjectComponent,
        AddSiteComponent,
        VendorDetailsComponent,
        UnitOfMeasurementComponent,
        MaterialTypesComponent,
        MaterialCostHeadsComponent,
        MaterialNaturePropertiesComponent,
        AddMaterialCostHeadsComponent,
        EditMaterialCostHeadsComponent,
        AddMaterialNaturePropertiesComponent,
        EditMaterialNaturePropertiesComponent,
        AddMaterialTypesComponent,
        EditMaterialTypesComponent,
        AddUnitOfMeasurementComponent,
        EditUnitOfMeasurementComponent,
        DelayReasonComponent,
        AddDelayReasonComponent,
        EditDelayReasonComponent,
        PlanningStructureComponent,
        AddPlanningStructureComponent,
        EditPlanningStructureComponent,
        LabourMasterComponent,
        LabourCanvasComponent,
        IdcComponent,
        WbsMasterComponent,
        AddUpdateLabourComponent,
        AddUpdateIdcComponent,
        MaterialSubGroupComponent,
        AddEditMaterialSubComponent,
        VenderMergeComponent,
        ItemwiseVendorComponent,
        RackMasterComponent,
        AddUpdateRackMasterComponent,
        SectionRackSettingComponent,
        AddUpdateRackSettingComponent,
        MaterialGroupTreeComponent,
        TransportRateComponent,
        AddUpdateTransportRateComponent,
        BrandComponent,
        AddEditBrandComponent,
        TaxManagementComponent,
        AdEditTaxComponent,
        MergeUnitOfMeasurementComponent,
        UnitUsedDetailsComponent,
        MaterialGroupMergeComponent,
        RestrictGroupComponent,
        RestrictDataListComponent,
        UnassignedAccountVendorComponent,
        UnassignedAdvancedSearchComponent,
        FinalcialYearLockingComponent,
        MaterialItemMergeComponent,
        MultipleItemsComponent,
        FreightContractComponent,
        FreightContractAddEditComponent,
        RateContractComponent,
        RateContractAddEditComponent,
        TermsAndConditionsComponent,
        AddEditTermsConditionsComponent,
        ApprovalDocTypeComponent,
        ApprovalDocTypeAddEditComponent,
        AddGstComponent,
        ClosingStockTRNComponent,
        ProcurementSettingsComponent,
        ProcurementSettingsAddEditComponent,
        ModelComponent,
        AddEditModelComponent,
        AssetComponent,
        AddEditAssetComponent,
        GeneralSettingsComponent,
        SiteWiseStockComponent,
        MultiStageComponent,
        LabTestingParametersComponent,
        AddUpdateLabTestingComponent,
        DepreciationGroupComponent,
        ExpenseMasterComponent,
        AddUpdateExpenseMasterComponent,
        MergerTransportNameComponent,
    ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SettingsRoutingModule,
        AngularMultiSelectModule,
        PaginateModule,
        SharedModuleModule,
        CKEditorModule,
        DndModule,
        DynamicFormsModule,
        ColorPickerModule,
        ExecutiveSummaryModule,
        MatDividerModule,
        MatSelectModule,
        NgSelectModule,
        MatTableModule,
        CommonModule,
        MatInputModule,
        MatCardModule,
        MatSortModule,
        MatIconModule

    ],
    exports: [
        A11yModule,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        MatDividerModule,
        MatSelectModule,
        ScrollingModule,
        MatTableModule,
        MatInputModule,
        MatCardModule,
        MatSortModule,
        MatIconModule
    ]
})
export class SettingsModule { }
