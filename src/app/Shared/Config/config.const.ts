import { environment } from "src/environments/environment";

export const API_CONFIG = {

    //Login
    USER_LOGIN: environment.API_URL + "login/",
    RESET_PASSWORD: environment.API_URL + "request-reset-email/",
    FORGET_RESET_PASSWORD: environment.API_URL + "password-reset-complete/",
    VERIFY_RESET_URL: environment.API_URL + "password-reset/",

    //Profile
    PROFILE_RESET_PASSWORD: environment.API_URL + "change_password/",
    USER_LOGOUT: environment.API_URL + "logout/",
    QUALIFICATION_LIST: environment.API_URL + "academic_type/",
    PROFILE_LIST: environment.API_URL + "pms_user_list/?",
    PROFILE_EDIT: environment.API_URL + "user_profile_edit/?",
    ACADEMIC_ADD: environment.API_URL + "academic_add/?",
    PROFESSIONAL_ADD: environment.API_URL + "work_experience_add/?",
    LICENSE_ADD: environment.API_URL + "license_add/?",
    OTHER_ADD: environment.API_URL + "other_document_add/?",


    //Settings  
    COUNTRY_LIST: environment.API_URL + "country/",
    ADD_COMPANY: environment.API_URL + "company_crud/?",
    ADD_DEPARTMENT: environment.API_URL + "department_crud/?",
    ADD_DESIGNATION: environment.API_URL + "designation_crud/?",
    ADD_EMPLOYEE: environment.API_URL + "employee_type_crud/?",
    STATE_LIST: environment.API_URL + "states/?",
    CITY_LIST: environment.API_URL + "city/?",
    CURRENCY_LIST: environment.API_URL + "misc-vendor-currency/?",
    ZONE_LIST: environment.API_URL + "zone/?",
    EMAIL_TAG: environment.API_URL + "EmailTagView/?",
    EMAIL_TEMPLATE: environment.API_URL + "EmailtemplateType/?",
    EMAIL_LIST: environment.API_URL + "EmailTemplatesView_POST/?",
    SMS_LIST: environment.API_URL + "SmsTemplateView/?",
    SMS_TAG: environment.API_URL + "SmsTagView/?",
    SMS_TEMPLATE: environment.API_URL + "SmstemplateType/?",
    ROLE_TREE_DATA: environment.API_URL + "comapny_wise_role_tree/?organization_id=",
    FORMULLA_TAG: environment.API_URL + "dynamic_form_crud/?",
    ADD_REPORTING: environment.API_URL + "pms_user_list/?",
    SETTING_LIST: environment.API_URL + "settings_group_master_api/?",
    EMPLOYEE_MASTER: environment.API_URL + "employee_master_crud/?",
    JV_MASTER: environment.API_URL + "jw_master_crud/?",
    STANDALONE_MASTER: environment.API_URL + "standalone_master_crud/?",
    DEPARTMENT_HEAD: environment.API_URL + "pms_custom_user_list/?",
    ADD_DELAYREASON: environment.API_URL + "delay_reason_master/?",
    LABOUR_MASTER: environment.API_URL + "labour-master/",
    INDIRECT_COST_CATEGORY: environment.API_URL + "indirect-cost-category/",
    INDIRECT_COST_MASTER: environment.API_URL + "indirect-cost-master/",
    // rack ===
    RACK_MASTER: environment.API_URL + "rack-master/",
    RACK_MASTER_LIST: environment.API_URL + "procurement-store-section/",
    ADD_RACK_MASTER: environment.API_URL + "procurement-store-section/",
    // rack-setting ===
    RACK_SETTING_LIST: environment.API_URL + "procurement-rack-setting/",
    ADD_RACK_SETTING: environment.API_URL + "procurement-rack-setting/",
    // transport rate ===
    TRANSPORT_RATE_LIST: environment.API_URL + "procurement-transportation-rate/",
    ADD_TRANSPORT_RATE: environment.API_URL + "procurement-transportation-rate/",
    // terms and Conditions ===
    TERMS_AND_CONDITIONS: environment.API_URL + "misc-terms-and-conditions-master/",
    EDIT_TRANSPORT_RATE: environment.API_URL + "misc-terms-and-conditions-master/",
    ADD_NEW_TERM: environment.API_URL + "misc-terms-and-conditions-master/",
    DELETE_TRANSPORT_RATE_CHILD: environment.API_URL + "misc-terms-and-conditions-master-child/",
    TERMS_AND_CONDITIONS_CHILD: environment.API_URL + "misc-terms-and-conditions-master-child/",
    EDIT_TERMS_CHILD: environment.API_URL + "misc-terms-and-conditions-master-child/",
    // lab testing ===========
    LAB_TESTING_LIST: environment.API_URL + "procurement-lab-testing-parameters/",
    ADD_LAB_TESTING: environment.API_URL + "procurement-lab-testing-parameters/",
    EDIT_LAB_TESTING: environment.API_URL + "procurement-lab-testing-parameters/",
    DELETE_LAB_TESTING: environment.API_URL + "procurement-lab-testing-parameters/",
    // brand ======
    BRAND_LIST: environment.API_URL + "material-brand/",
    ADD_BRAND: environment.API_URL + "material-brand/",
    EDIT_BRAND: environment.API_URL + "material-brand/",
    DELETE_BRAND: environment.API_URL + "material-brand/",

    // expense master =====
    EXPENSE_LIST: environment.API_URL + "misc-expense-head/",
    ADD_EXPENSE: environment.API_URL + "misc-expense-head/",
    EDIT_EXPENSE: environment.API_URL + "misc-expense-head/",
    DELETE_EXPENSE: environment.API_URL + "misc-expense-head/",

    // Financial Year ====
    FINANCIAL_YEAR_LOCK: environment.API_URL + "procurement-month-financial-year-lock/?",


    ////PROCUREMENT
    PROCUREMENT_SITE: environment.API_URL + "procurement-site/",
    PROJECT_STORE: environment.API_URL + "procurement-store/",
    PROCUREMENT_MR: environment.API_URL + "procurement-material-request/?",
    PROCUREMENT_APPROVE: environment.API_URL + "procurement-material-request-approve/?",
    INDENT_APPROVE: environment.API_URL + "procurement-indent-approve/?",
    ACCOUNT_HEADS: environment.API_URL + "misc-accounts-head/?",
    DEPRECIATION_GROUP: environment.API_URL + "material-deprecation-group/?",
    WORK_ORDER: environment.API_URL + "procurement-work-order/?",


    //Procurement
    PROCUREMENT_MATERIAL_REQUEST: environment.API_URL + "procurement-material-request-search/",
    PROCUREMENT_INDENT_REQUEST: environment.API_URL + "procurement-indent-item-search/",
    PROCUREMENT_PHYSICAL_STOCK: environment.API_URL + "procurement-physical-stock/",

    //Notifications
    NOTIFICATION_LIST: environment.API_URL + "notification_master/?",

    //Role & Permission Management
    ROLE_PERMISSION_CRUD: environment.API_URL + "user_role_crud/",
    ROLE_PERMISSION_MENU: environment.API_URL + "menu_list/",
    ROLE_PERMISSION_ADMIS_MENU: environment.API_URL + "administrative_list/",
    SETTINGS_PERMISSION_MENU: environment.API_URL + "setting_list/",
    MODULE_PERMISSION_LIST: environment.API_URL + "module_permission_list/",
    CREATE_PERMISSIONS: environment.API_URL + "role_permission_create/",

    //User Management
    USER_LIST: environment.API_URL + "pms_user_list/",
    DELETED_USER_LIST: environment.API_URL + "pms_deleted_user_list/",
    ADD_USER: environment.API_URL + "add_user/",
    DELETE_USER: environment.API_URL + "pms_user_manage/?",
    UPDATE_USER: environment.API_URL + "user/edit/",
    GROUP_LIST: environment.API_URL + "group/",
    IMPORT_USER: environment.API_URL + "bulk_import_upload/?",
    MAP_USER: environment.API_URL + "bulk_import_db_add/?",
    MAP_ISSUE: environment.API_URL + "procurement-bulk-import-material-issue-excel/?",
    IMPORT_GRN: environment.API_URL + "procurement-bulk-import-grn-excel/?",


    //User Permission
    CREATE_USER_PERMISSIONS: environment.API_URL + "role_permission_create_user_wise/",

    //User Activity
    USER_ACTIVITY_LIST: environment.API_URL + "log_activity_track/",
    ACTIVITY_TRACKER: environment.API_URL + "tender-activity-log/",


    //Menu List
    MENU_LIST: environment.API_URL + "menu_list/?",
    MENU_FORM_LIST: environment.API_URL + "form_menu_list/?",
    DYNAMIC_FORM: environment.API_URL + "dynamic_form_crud/?",
    DYNAMIC_FORM_GROUP: environment.API_URL + "dynamic_form_group_crud/?",
    REFERENCE_VALUE: environment.API_URL + "MasterAPI/?",

    //Tender 
    FROMS_CONFIG_CHANGE_ORDER: environment.API_URL + "form_data_counter_update/",
    WORK_FLOW: environment.API_URL + "tender-workflow/?",
    NOTIFICATION_USER_LIST: environment.API_URL + "pms_custom_user_list/?",
    ADD_NOTIFICATION: environment.API_URL + "tender-notifications/",
    TENDER_EVENT: environment.API_URL + "tender-events/",
    TENDER_DATA: environment.API_URL + "tender-master/?",
    TENDER_SURVEY_DATA: environment.API_URL + "tenderevaluationstandalone/?",
    TENDER_JV_DATA: environment.API_URL + "tenderevaluationjv/?",
    WBS_DATA: environment.API_URL + "tender-wbs/?",
    SURVEY_DATA: environment.API_URL + "tender-survey/?",
    EXICUTIVE_COMMITEE: environment.API_URL + "tender-executive-commitee/?",
    EXICUTIVE_COMMITEE_APPROVAR: environment.API_URL + "tender-executive-commitee-members-action/?",
    EXICUTIVE_COMMITEE_FINAL: environment.API_URL + "tender-executive-commitee-final-approval/?",
    EXICUTIVE_COMMITEE_APPROVAR_FINAL: environment.API_URL + "tender-executive-commitee-members-action-final-approval/?",
    RE_SEND_FOR_APPROVAL: environment.API_URL + "approval-request-exc-resend/?",
    REJECT_TENDER: environment.API_URL + "tender-master/reject/?",
    TENDER_REVERSED_EXC: environment.API_URL + "tender-reversed-for-recommendation/?",
    LIST_OF_KEY_SCOPE: environment.API_URL + "tender-key-values/?",
    JV_ANALYTICS: environment.API_URL + "tender_percentage_share_analytics/?",
    JV_ANALYTICS1: environment.API_URL + "jv_tender_percentage_share_analytics/?",

    TOP_SHEET_SALES_GET: environment.API_URL + "top-sheet-sales/?",
    TOP_SHEET_EXPEND_GET: environment.API_URL + "top-sheet-expenditure/?",
    TOP_SHEET_SALES_UPLOAD: environment.API_URL + "top-sheet-sales/",
    TOP_SHEET_EXPEND_UPLOAD: environment.API_URL + "top-sheet-expenditure/",
    TOP_SHEET_TOTAL: environment.API_URL + "top-sheet-totals/?",
    TOP_SHEET_SUBMIT: environment.API_URL + "top-sheet-final-submit/",

    SURVEY_COMPLETE: environment.API_URL + "tender-start-completed/",
    ROLEWISE_SURVEY_COMPLETE: environment.API_URL + "tender-survey-completion-role-wise/",
    EXCEL_MANIPULATION: environment.API_URL + "excel-manipulation/",



    //PlantMachinary
    PLANTMACHINARY_DATA: environment.API_URL + "plant_machinery/?",
    VENDOR_DATA: environment.API_URL + "vendor_master/?",
    VENDOE_LIST_NEW: environment.API_URL + "vendor_master_new/?",
    VENDOR_MERGE: environment.API_URL + "vendor_merge/?",
    ITEM_TYPE: environment.API_URL + "item-type/?",
    PRODUCTION_TYPE: environment.API_URL + "production-type/?",
    ITEM_WISE_VENDOR: environment.API_URL + "procurement-item-wise-vendor-list/?",
    EXECUTIVE_SUMMERY: environment.API_URL + "executivesummery/?",

    CHAINAGE_EXECUTIVE_SUMMERY: environment.API_URL + "chainage-executivesummery/?",

    EXECUTIVE_SUMMERY_NEW: environment.API_URL + "executivesummery-new/?",
    TENDER_USER_DETAILS: environment.API_URL + "user_permission_list/?tender_id=",
    TENDER_USER_PERMISSION_DETAILS: environment.API_URL + "user_permission_list/",
    SUMMERY_LIST: environment.API_URL + "tender_derivative/?",


    //Executive Summery
    TENDER_RISK: environment.API_URL + "risk_details/?",
    TENDER_OPPORTUNITY: environment.API_URL + "opportunity_details/?",
    TENDER_DERIVATIVE: environment.API_URL + "tender_derivative/?",

    PLANNING_RISK: environment.API_URL + "planning-risk/?",
    PLANNING_OPPORTUNITY: environment.API_URL + "opportunity_details/?",
    PLANNING_DERIVATIVE: environment.API_URL + "tender_derivative/?",

    //Project
    PROJECT_DATA: environment.API_URL + "project-master/?",
    PROJECT_MASTER: environment.API_URL + "project-master/?",

    //Planning
    PLANNING_MENU_FORM_LIST: environment.API_URL + "form_menu_list_for_planning/?",
    PLANNING_HEAD_SELECTION: environment.API_URL + "project-planning-head-selection/?",
    PROJECT_HEAD_SELECTION: environment.API_URL + "project-head-selection/?",
    PLANNING_RISk_APPROVAL: environment.API_URL + "project-planning-risk-approval-matrix/?",
    PLANNING_RISK_DIARY: environment.API_URL + "project-planning-risk-diary/?",
    PLANNIG_STRIP_DATA: environment.API_URL + "chainage-breakup/?",
    STRIP_DETAILS: environment.API_URL + "peacon-strip-for-affected-areas/?",
    STRIP_CHAIN_LIST: environment.API_URL + "chainage-list/?",
    STRIP_MODIFY: environment.API_URL + "precon-strip-for-affected-areas-create/",
    STRIP_ACHIVEMENT_PLAN: environment.API_URL + "peacon-strip-actual-date-set/",
    STRIP_ADD_ACHIUVE: environment.API_URL + "precon-strip-actual-date-set/",
    WBS_STRIP_CONFIG: environment.API_URL + "tender-wbs-attribute/?",


    //Material
    UOM_MASTER: environment.API_URL + "unit-of-mesurement/?",
    MATERIAL_TYPE: environment.API_URL + "material-type/?",
    MATERIAL_SUB_TYPE: environment.API_URL + "material-sub-type/?",
    MATERIAL_COST_HEAD: environment.API_URL + "material-cost-head/?",
    NATURE_PROPERTIES: environment.API_URL + "material-nature/?",
    MATERIAL_MASTER: environment.API_URL + "material-master/?",
    MATERIAL_TYPE_MASTER: environment.API_URL + "material-type/?",
    MATERIAL_TYPE_COST: environment.API_URL + "material-cost-head/?",
    MATERIAL_NATURE: environment.API_URL + "material-nature/?",
    HSN_CODE: environment.API_URL + "hsn-code/?",
    MERGE_DATA: environment.API_URL + "merge-data/?",
    USED_DETAILS: environment.API_URL + "used-data/?",
    RESTRICT_ITEM: environment.API_URL + "procurement-restrict-item-group/?",
    BULK_ITEM_MASTER: environment.API_URL + "bulk-material-master/?",


    //LMPI-BOQ-BUDGET
    BOQ_WBS: environment.API_URL + "wbs-list/?",
    BOQ_WBS_LABOUR: environment.API_URL + "wbs-labour/?",
    BOQ_WBS_MATERIAL: environment.API_URL + "wbs-material/?",
    BOQ_WBS_PNE: environment.API_URL + "wbs-plant-machinery/?",
    BOQ_WBS_IDC: environment.API_URL + "wbs-indirect-cost/?",
    BOQ_PMS: environment.API_URL + "boq/?",
    //Budget
    BOQ_DETAILS: environment.API_URL + "wbs-list-details/?",


    //convert-pdf/
    GET_PDF: environment.API_URL + "convert-pdf/",

    //Common
    USER_FILTER_LIST: environment.API_URL + "pms_custom_user_list_by_permissions/?",
    COMMENTS: environment.API_URL + "comments/?",
    MATERIAL_PLAN: environment.API_URL + "wbs-material-project-planning/?",
    COMMUNICATION: environment.API_URL + "communication/",
    COMMUNICATION_TYPE: environment.API_URL + "communication-type/?",


    //Budget Accounts
    CHAINAGE_LISTS: environment.API_URL + "accounts-project-data/?",
    ACCOUNTS_PROJECT_BUDGET: environment.API_URL + "accounts-project-budget/",
    ACCOUNTS_PROJECT_COST_MASTER: environment.API_URL + "account-project-cost-master/?",
    ACCOUNTS_UPDATE_ORDERING: environment.API_URL + "update-ordering/?",

    //Chainage details
    CHAINAGE_DETAILS: environment.API_URL + "tender_chainage/",
    ACCOUNTS_BUDGET_BREAKDOWN: environment.API_URL + "accounts-budget-breakdown/",

    //accounts-material-budget
    ACCOUNTS_MATERIAL_BUDGET: environment.API_URL + "accounts-material-budget/",
    MATERIAL_UPDATE_ORDERING: environment.API_URL + "update-ordering-material/?",
    MATERIAL_APPROVE: environment.API_URL + "procurement-approve/?",
    ACCOUNTS_MATERIAL_BUDGET_BREAKDOWN_BULK: environment.API_URL + "account-material-budget-breakdown-bulk/",
    ACCOUNT_PROJECT_COST_MASTER: environment.API_URL + "account-project-cost-master/?",


    //budget-accounts-item-new
    CHAINAGE_MASTER: environment.API_URL + "account-chainage-master/",
    ACTIVITY_MASTER: environment.API_URL + "account-activity-master/",
    ACTIVITY_MASTER_BULK: environment.API_URL + "account-activity-master-bulk2/",
    SUB_ACTIVITY_MASTER: environment.API_URL + "account-sub-activity-master/",
    SUB_ACTIVITY_MASTER_BULK: environment.API_URL + "account-sub-activity-master-bulk2/",











};

export const Error_Messages = {
    Failed_HTTP: 'Oops Something Went Wrong. Please Try After Sometime!'
};

export const Success_Messages = {
    SuccessAdd: 'Added Successfully!',
    editSuccess: 'Edited Successfully!',
    CreateSucc: 'Created Successfully!',
    SuccessUpdate: 'Updated Successfully!',
    SuccessDelete: 'Deleted Successfully!'
}


