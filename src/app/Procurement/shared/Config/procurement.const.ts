import { environment } from "src/environments/environment";

export const PROCUREMENT_API_CONFIG = {

    PROCUREMENT_MR_ACTIVITY: environment.API_URL + "procurement-material-check/?",
    PROCUREMENT_MR: environment.API_URL + "procurement-material-request/?",
    PROCUREMENT_INVENTORY: environment.API_URL + "procurement-inventory/?",
    PROCUREMENT_MATERIAL_REQ_ITEMS: environment.API_URL + "procurement-material-request-items/?",
    PROCUREMENT_MR_INDENT: environment.API_URL + "procurement-indent/",
    PROCUREMENT_ALL_FILTER: environment.API_URL + "procurement-all/?",
    PROCUREMENT_MR_ISSUE: environment.API_URL + "procurement-material-issue/",
    PROCUREMENT_ISSUE_SEARCH: environment.API_URL + "procurement-material-issue-item-search/",
    INDENT_ATTACHMENT: environment.API_URL + "procurement-indent-attachement-update/?",
    ADD_MULTIOLE_ISSUE : environment.API_URL + "procurement-multiple-material-issue/?",

    PROCUREMENT_GROUP_TASK: environment.API_URL + "procurement-group-task-master/?",
    PROCUREMENT_GROUPTASK_ADD: environment.API_URL + "procurement-group-task-master/",
    PROCUREMENT_GROUP_TASK_UPDATE: environment.API_URL + "procurement-group-task-master/?",
    FABRICATION_WORK: environment.API_URL + "procurement-fabrication-work/?",

    GENERAL_ADMIN_EXPENSES: environment.API_URL + "procurement-general-admin-expenses/?",
    ADD_GENERAL_ADMIN_EXPENSES: environment.API_URL + "procurement-general-admin-expenses/?",
    EDIT_GENERAL_ADMIN_EXPENSES: environment.API_URL + "procurement-general-admin-expenses/?",
    DELETE_GENERAL_ADMIN_EXPENSES: environment.API_URL + "procurement-general-admin-expenses/?",

    DEBIT_NOTE: environment.API_URL + "procurement-material-issue-debit-note/?",

    SUBLET_ORDER: environment.API_URL + "procurement-sublet-order/?",
    BILL_RECEIVE: environment.API_URL + "procurement-bill-receive/?",
    MAIL_SEND: environment.API_URL + "procurement-rfq-mail-send/?",



    VENDOR_NOTIFY: environment.API_URL + "procurement-rfq-vendors/",
    PROCUREMENT_QUOTATION: environment.API_URL + "procurement-quotation/?",
    TAX_HEADS: environment.API_URL + "misc-tax-head/?",
    ACCOUNT_HEADS: environment.API_URL + "misc-accounts-head/?",
    MATERIAL_MODEL: environment.API_URL + "material-model/?",
    MATERIAL_ASSET: environment.API_URL + "material-asset/?",

    MATERIAL_WASTAGE: environment.API_URL + "procurement-material-wastage/?",
    MATERIAL_WASTAGE_ADD: environment.API_URL + "procurement-material-wastage/",
    MATERIAL_WASTAGE_EDIT: environment.API_URL + "procurement-material-wastage/?",
    PROCUREMENT_LINKING: environment.API_URL + "procurement-voucher-linking/?",
    TAX_INVOICE: environment.API_URL + "procurement-tax-invoice/?",
    TRANSPORT_BILL: environment.API_URL + "procurement-transporter-bill/?",


    PURCHASE_LIST : environment.API_URL + "procurement-purchase/?",
    PURCHASE_RETURN : environment.API_URL + "procurement-purchase-return/?",
    WAY_BILL : environment.API_URL + "way-bill-form/",
    


    WORK_INDENT: environment.API_URL + "procurement-work-indent/?",
    WORK_INDENT_ADD: environment.API_URL + "procurement-work-indent/",
    WORK_INDENT_ADD_DELETE: environment.API_URL + "procurement-work-indent/?",
    WORK_INDENT_EDIT: environment.API_URL + "procurement-work-indent/?",

    ITEM_STOCK_JV: environment.API_URL + "procurement-stock-item-jv/?",
    ITEM_STOCK_JV_ADD: environment.API_URL + "procurement-stock-item-jv/",
    ITEM_STOCK_JV_EDIT: environment.API_URL + "procurement-stock-item-jv/?",
    ITEM_STOCK_JV_DELETE: environment.API_URL + "procurement-stock-item-jv/?",

    MATERIAL_ISSUE_RETURN: environment.API_URL + "procurement-material-issue-return/?",
    MATERIAL_ISSUE_RETURN_ADD: environment.API_URL + "procurement-material-issue-return/",
    MATERIAL_ISSUE_RETURN_EDIT: environment.API_URL + "procurement-material-issue-return/?",
    MATERIAL_ISSUE_RETURN_DELETE: environment.API_URL + "procurement-material-issue-return/?",



    SINGLE_LOG_BOOK: environment.API_URL + "procurement-log-book/?",
    SINGLE_LOG_BOOK_ADD: environment.API_URL + "procurement-log-book/",
    SINGLE_LOG_BOOK_EDIT: environment.API_URL + "procurement-log-book/?",
    SINGLE_LOG_BOOK_DELETE: environment.API_URL + "procurement-log-book/?",

    LAB_REPORT: environment.API_URL + "procurement-lab-report-entry/?",
    LAB_REPORT_ADD: environment.API_URL + "procurement-lab-report-entry/",
    LAB_REPORT_EDIT: environment.API_URL + "procurement-lab-report-entry/?",
    LAB_REPORT_DELETE: environment.API_URL + "procurement-lab-report-entry/?",


    INDENT_QUOTATION: environment.API_URL + "procurement-quotation/",
    MISC_TERMS_CONDITIONS: environment.API_URL + "misc-terms-and-conditions-master/",
    PURCHASE_ORDER: environment.API_URL + "procurement-purchase-order/",
    RAW_MATERIAL_SALE: environment.API_URL + "procurement-raw-material-sales/",
    VENDOR_CURRENCY: environment.API_URL + "misc-vendor-currency/",
    FREIGHT_CONTRACT: environment.API_URL + "procurement-freight-contract/?",
    RATE_CONTRACT: environment.API_URL + "procurement-rate-contract/?",
    APPROVAL_DOC: environment.API_URL + "procurement-approval-doctype/?",
    CLOSING_STOCK_TRN: environment.API_URL + "procurement-closing-stock-trn/?",
    SITE_STOCK: environment.API_URL + "procurement-site-wise-stock-level-setting/",
    FINANCIAL_YEAR_DATA: environment.API_URL + "procurement-financial-year/",
    APPROVAL_USER: environment.API_URL + "procurement-document-employee-approval/?",
    GENERAL_SETTING: environment.API_URL + "procurement-general-setting/?",
    STAGE_UPDATE: environment.API_URL + "procurement-stage/?",
    MULTI_STAGE_SETTING: environment.API_URL + "procurement-multi-stage-setting/?",

    GRN: environment.API_URL + "procurement-grn/",
    MULTIPLE_GRN: environment.API_URL + "procurement-multiple-grn/",
    WORK_ORDER: environment.API_URL + "procurement-work-order/",

    GATE_PASS: environment.API_URL + "procurement-gate-pass/?",

    PLANT_PRODUCTION: environment.API_URL + "procurement-plant-production/?",



    ////
    // DashBoard
    TODO_LIST: environment.API_URL + "record-counts/?",
    TRANSCTION_LIST: environment.API_URL + "multi-list/?",

    /////
    // Print APIS
    PRINT_MR: environment.API_URL + "procurement-material-request-slip/?",
    PRINT_GRN: environment.API_URL + "procurement-grn-slip/?",
    PRINT_INDENT: environment.API_URL + "procurement-indent-slip/?",
    VENDOR_PO: environment.API_URL + "procurement-purchase-order-slip/?",
    POCUREMENT_APPROVA: environment.API_URL + "procurement-approve/?",

};



