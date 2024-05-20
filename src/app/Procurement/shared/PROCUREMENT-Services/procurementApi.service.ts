import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../Shared/Services/http.service';
import { PROCUREMENT_API_CONFIG } from '../Config/procurement.const';

@Injectable({
  providedIn: 'root'
})
export class PROCUREMENTAPIService {

  constructor(
    private HTTP: HttpService
  ) { }


  getProcurementMaterialDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_MR_ACTIVITY + req.toString();
    return this.HTTP.get(url);
  }

  getProcurementQuotationDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_QUOTATION + req.toString();
    return this.HTTP.get(url);
  }

  getAccountHead(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.ACCOUNT_HEADS + req.toString();
    return this.HTTP.get(url);
  }

  getTaxHeadDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TAX_HEADS + req.toString();
    return this.HTTP.get(url);
  }

  addTax(param: any, request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TAX_HEADS + param.toString();
    return this.HTTP.post(url, request);
  }

  addMultipleIssue(param: any, request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.ADD_MULTIOLE_ISSUE + param.toString();
    return this.HTTP.post(url, request);
  }

  editTax(param: any, request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TAX_HEADS + param.toString();
    return this.HTTP.put(url, request);
  }

  linkProcurement(param: any, request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_LINKING + param.toString();
    return this.HTTP.post(url, request);
  }

  getLinkData(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_LINKING + req.toString();
    return this.HTTP.get(url);
  }


  deleteTax(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TAX_HEADS + request.toString();
    return this.HTTP.put(url);
  }

  getModelDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_MODEL + req.toString();
    return this.HTTP.get(url);
  }

  addModel(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_MODEL;
    return this.HTTP.post(url, request);
  }

  editModel(param: any, request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_MODEL + param.toString();
    return this.HTTP.put(url, request);
  }
  deleteModel(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_MODEL + request.toString();
    return this.HTTP.put(url);
  }
  getAssetDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_ASSET + req.toString();
    return this.HTTP.get(url);
  }
  addAsset(param: any, request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_ASSET + param.toString();
    return this.HTTP.post(url, request);
  }

  editAsset(param: any, request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_ASSET + param.toString();
    return this.HTTP.put(url, request);
  }
  deleteAsset(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_ASSET + request.toString();
    return this.HTTP.put(url);
  }

  getProcurementInventoryDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_INVENTORY + req.toString();
    return this.HTTP.get(url);
  }

  addInventory(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_INVENTORY + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateInventory(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_INVENTORY + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getProcurementGroupTaskDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_GROUP_TASK + req.toString();
    return this.HTTP.get(url);
  }

  addGroupTask(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_GROUPTASK_ADD + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateGroupTask(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_GROUP_TASK_UPDATE + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getMaterialWastageDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_WASTAGE + req.toString();
    return this.HTTP.get(url);
  }

  addMaterialWastage(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_WASTAGE_ADD + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateMaterialWastage(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_WASTAGE_EDIT + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  deleteMaterialWastage(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_WASTAGE + request.toString();
    return this.HTTP.put(url);
  }

  getWayBillList(req: any) {
    const url = PROCUREMENT_API_CONFIG.WAY_BILL + req.toString();
    return this.HTTP.get(url);
  }

  deletePurchase(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_LIST + request.toString();
    return this.HTTP.put(url);
  }

  getPurchaseListDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_LIST + req.toString();
    return this.HTTP.get(url);
  }

  addPurchaseList(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_LIST + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updatePurchaseList(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_LIST + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getPurchaseReturnListDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_RETURN + req.toString();
    return this.HTTP.get(url);
  }

  addPurchaseReturnList(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_RETURN + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updatePurchaseReturnList(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_RETURN + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getItemStockJvDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.ITEM_STOCK_JV + req.toString();
    return this.HTTP.get(url);
  }

  addItemStockJv(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.ITEM_STOCK_JV_ADD + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateItemStockJv(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.ITEM_STOCK_JV_EDIT + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  deleteItemStockJv(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.ITEM_STOCK_JV_DELETE + request.toString();
    return this.HTTP.put(url);
  }

  getMaterialIssueReturnDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_ISSUE_RETURN + req.toString();
    return this.HTTP.get(url);
  }

  addMaterialIssueReturn(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_ISSUE_RETURN_ADD + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateMaterialIssueReturn(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_ISSUE_RETURN_EDIT + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  deleteMaterialIssueReturn(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MATERIAL_ISSUE_RETURN_DELETE + request.toString();
    return this.HTTP.put(url);
  }

  getSingleLogBookDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SINGLE_LOG_BOOK + req.toString();
    return this.HTTP.get(url);
  }

  addSingleLogBookMachine(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SINGLE_LOG_BOOK_ADD + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateSingleLogBookMachine(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SINGLE_LOG_BOOK_EDIT + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  deleteSingleLogBook(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SINGLE_LOG_BOOK_DELETE + request.toString();
    return this.HTTP.put(url);
  }

  getLabReportDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.LAB_REPORT + req.toString();
    return this.HTTP.get(url);
  }

  addLabReportEntry(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.LAB_REPORT_ADD + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateLabReportEntry(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.LAB_REPORT_EDIT + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  deleteLabReportEntry(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.LAB_REPORT_DELETE + request.toString();
    return this.HTTP.put(url);
  }

  getWorkIndentDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WORK_INDENT + req.toString();
    return this.HTTP.get(url);
  }

  addWorkIndent(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WORK_INDENT_ADD + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateWorkIndent(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WORK_INDENT_EDIT + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  deleteWorkIndent(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WORK_INDENT_ADD_DELETE + request.toString();
    return this.HTTP.put(url);
  }

  getProcurementFreightDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.FREIGHT_CONTRACT + req.toString();
    return this.HTTP.get(url);
  }

  addFreight(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.FREIGHT_CONTRACT + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateFreight(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.FREIGHT_CONTRACT + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getProcurementRateDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.RATE_CONTRACT + req.toString();
    return this.HTTP.get(url);
  }

  addRate(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.RATE_CONTRACT + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateRate(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.RATE_CONTRACT + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getProcurementADocDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.APPROVAL_DOC + req.toString();
    return this.HTTP.get(url);
  }

  addADoc(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.APPROVAL_DOC + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateADoc(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.APPROVAL_DOC + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getProcurementApprovalUser(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.APPROVAL_USER + req.toString();
    return this.HTTP.get(url);
  }

  addApprovalUser(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.APPROVAL_USER + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateApprovalUser(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.APPROVAL_USER + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getProcurementMultistage(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MULTI_STAGE_SETTING + req.toString();
    return this.HTTP.get(url);
  }

  addMultistage(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MULTI_STAGE_SETTING + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  updateMultistage(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MULTI_STAGE_SETTING + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  updateModuleMultistage(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.STAGE_UPDATE + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getProcurementGeneralSetting(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GENERAL_SETTING + req.toString();
    return this.HTTP.get(url);
  }

  updateGeneralSetting(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GENERAL_SETTING + query.toString();
    return this.HTTP.post(url, reqbody);
  }

  getFinanCialyrData(): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.FINANCIAL_YEAR_DATA;
    return this.HTTP.get(url);
  }

  getFinanCialyrDataQry(query: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.FINANCIAL_YEAR_DATA + '?' + query.toString();
    return this.HTTP.get(url);
  }

  closingStockUpdate(query: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.CLOSING_STOCK_TRN + query.toString();
    return this.HTTP.put(url);
  }

  sitewiseStockUpdate(data: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SITE_STOCK;
    return this.HTTP.post(url, data);
  }

  updateProcurementSatatus(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.POCUREMENT_APPROVA + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getProcurementMRDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_MR + req.toString();
    return this.HTTP.get(url);
  }

  getProcurementMaterialRequestItems(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_MATERIAL_REQ_ITEMS + req.toString();
    return this.HTTP.get(url);
  }
  // adddeviation(req: any): Observable<any> {
  //   const url = PROCUREMENT_API_CONFIG.DEVIATION;
  //   return this.HTTP.post(url, req);
  // }

  addProcurementMRIndent(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_MR_INDENT;
    return this.HTTP.post(url, reqbody);
  }

  getProcurementIndentDetails(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_MR_INDENT + '?' + req.toString();
    return this.HTTP.get(url);
  }

  getprocurementFilterList(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_ALL_FILTER + req.toString();
    return this.HTTP.get(url);
  }


  updateProcurementIndent(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_MR_INDENT + '?' + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  getMaterialIssueDetails(query: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_MR_ISSUE + '?' + query.toString();
    return this.HTTP.get(url);
  }


  addProcurementMRIssue(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_MR_ISSUE;
    return this.HTTP.post(url, reqbody);
  }


  getProcurementIssueList(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PROCUREMENT_ISSUE_SEARCH + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  getRfqVendors(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.VENDOR_NOTIFY + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  deleteEnquiry(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.VENDOR_NOTIFY + '?' + request.toString();
    return this.HTTP.put(url);
  }

  notifyVendors(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.VENDOR_NOTIFY;
    return this.HTTP.post(url, req);
  }


  addIndentQuotation(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.INDENT_QUOTATION;
    return this.HTTP.post(url, reqbody);
  }

  editIndentQuotation(query:any,reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.INDENT_QUOTATION + '?' + query.toString();;
    return this.HTTP.put(url, reqbody);
  }

  getIndentQuotation(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.INDENT_QUOTATION + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  getTermsFromMaster(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MISC_TERMS_CONDITIONS + '?' + req.toString();
    return this.HTTP.get(url);
  }

  addPurchaseOrder(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_ORDER;
    return this.HTTP.post(url, reqbody);
  }

  editPurchaseOrder(req: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_ORDER + '?' + req.toString();
    return this.HTTP.put(url, reqbody);
  }

  addRawMaterialSale(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.RAW_MATERIAL_SALE;
    return this.HTTP.post(url, reqbody);
  }
  updateRawMaterialSale(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.RAW_MATERIAL_SALE + '?' + query.toString();;
    return this.HTTP.put(url, reqbody);
  }
  getRawMaterialList(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.RAW_MATERIAL_SALE + '?' + orgId.toString();
    return this.HTTP.get(url);
  }
  addWayBill(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WAY_BILL;
    return this.HTTP.post(url, reqbody);
  }
  updateWayBill(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WAY_BILL + '?' + query.toString();;
    return this.HTTP.put(url, reqbody);
  }
  getWayBill(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WAY_BILL + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  getPrintDataMR(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PRINT_MR + req.toString();
    return this.HTTP.get(url);
  }

  getPrintDataGRN(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PRINT_GRN + req.toString();
    return this.HTTP.get(url);
  }

  getPrintDataPO(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.VENDOR_PO + req.toString();
    return this.HTTP.get(url);
  }

  getPrintDataIndent(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PRINT_INDENT + req.toString();
    return this.HTTP.get(url);
  }


  getVendorCurrencyList(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.VENDOR_CURRENCY + '?' + orgId.toString();
    return this.HTTP.get(url);
  }


  getQuotationList(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PURCHASE_ORDER + '?' + orgId.toString();
    return this.HTTP.get(url);
  }


  addGRN(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GRN;
    return this.HTTP.post(url, reqbody);
  }

  editGRN(reqbody: any, params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GRN + '?' + params.toString();
    return this.HTTP.put(url, reqbody);
  }

  addMultipleGRN(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MULTIPLE_GRN;
    return this.HTTP.post(url, reqbody);
  }

  getGRNList(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GRN + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  getGRNDetails(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GRN + '?' + params.toString();
    return this.HTTP.get(url);
  }

  addGetPass(reqbody: any, params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GATE_PASS + params.toString();
    return this.HTTP.post(url, reqbody);
  }

  getListGatePass(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GATE_PASS + params.toString();
    return this.HTTP.get(url);
  }

  editGatePass(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GATE_PASS + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  addWorkOrder(reqbody: any, params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WORK_ORDER + '?' + params.toString();
    return this.HTTP.post(url, reqbody);
  }

  editWorkOrder(reqbody: any, params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WORK_ORDER + '?' + params.toString();
    return this.HTTP.put(url, reqbody);
  }

  getWOList(orgId: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.WORK_ORDER + '?' + orgId.toString();
    return this.HTTP.get(url);
  }

  addFabricationWork(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.FABRICATION_WORK;
    return this.HTTP.post(url, reqbody);
  }

  getFabricationWork(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.FABRICATION_WORK + params.toString();
    return this.HTTP.get(url);
  }

  getGeneralAdminExpenses(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.GENERAL_ADMIN_EXPENSES + params.toString();
    return this.HTTP.get(url);
  }

  addGeneralAdminExpenses(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.ADD_GENERAL_ADMIN_EXPENSES;
    return this.HTTP.post(url, reqbody);
  }

  updateGeneralAdminExpenses(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.EDIT_GENERAL_ADMIN_EXPENSES + query.toString();
    return this.HTTP.put(url, reqbody);
  }

  deleteGeneralAdminExpenses(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.DELETE_GENERAL_ADMIN_EXPENSES + request.toString();
    return this.HTTP.put(url);
  }

  getMaterialIssueDebitNote(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.DEBIT_NOTE + params.toString();
    return this.HTTP.get(url);
  }

  addSubletOrder(reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SUBLET_ORDER;
    return this.HTTP.post(url, reqbody);
  }
  getSubletOrder(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SUBLET_ORDER + params.toString();
    return this.HTTP.get(url);
  }
  updateSubletOrder(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SUBLET_ORDER + query.toString();
    return this.HTTP.put(url, reqbody);
  }
  deleteSuborder(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.SUBLET_ORDER + request.toString();
    return this.HTTP.put(url);
  }

  addBillReceive(param: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.BILL_RECEIVE + param.toString();;
    return this.HTTP.post(url, reqbody);
  }

  getBillReceive(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.BILL_RECEIVE + params.toString();
    return this.HTTP.get(url);
  }
  updateBillReceive(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.BILL_RECEIVE + query.toString();
    return this.HTTP.put(url, reqbody);
  }
  deleteBillReceive(request: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.BILL_RECEIVE + request.toString();
    return this.HTTP.put(url);
  }

  MailTrigger(): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.MAIL_SEND;
    return this.HTTP.post(url);
  }
  createTaxInvoice(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TAX_INVOICE;
    return this.HTTP.post(url, req);
  }
  getTaxInvoice(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TAX_INVOICE + params.toString();
    return this.HTTP.get(url);
  }

  createTransportBill(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TRANSPORT_BILL;
    return this.HTTP.post(url, req);
  }
  getTransportBill(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TRANSPORT_BILL + params.toString();
    return this.HTTP.get(url);
  }

  getPlantProduction(params: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PLANT_PRODUCTION + params.toString();
    return this.HTTP.get(url);
  }
  createPlantProduction(req:any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PLANT_PRODUCTION;
    return this.HTTP.post(url,req);
  }
  updateProcurementPlantProduction(query: any, reqbody: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.PLANT_PRODUCTION + query.toString();
    return this.HTTP.put(url, reqbody);
  }
 
  createMaterialIssueDebitNote(req: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.DEBIT_NOTE;
    return this.HTTP.post(url, req);
  }

  toDoList(query:any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TODO_LIST + query.toString();
    return this.HTTP.get(url);
  }

  transactionList(query:any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.TRANSCTION_LIST + query.toString();
    return this.HTTP.get(url);
  }
  updateIndentAttachment(query: any): Observable<any> {
    const url = PROCUREMENT_API_CONFIG.INDENT_ATTACHMENT + query.toString();
    return this.HTTP.put(url);
  }
  

}
