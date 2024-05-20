import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PROCUREMENTAPIService } from '../../shared/PROCUREMENT-Services/procurementApi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';
import { CommonFunctionService } from 'src/app/Shared/Services/common-function.service';
import * as XLSX from 'xlsx-js-style';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: [
    './quotations.component.scss',
    '../../../../assets/scss/scrollableTable.scss'
  ]
})


export class QuotationsComponent implements OnInit {

  removeFromPrint = true

  @ViewChild('pdfExportButton', { read: ElementRef })
  pdfExportButton!: ElementRef;

  @ViewChild('TABLE', { static: false })
  TABLE!: ElementRef;

  
  @ViewChild('EXCELTABLE', { static: false })
  EXCELTABLE!: ElementRef;

  @ViewChild('TABLE_CONTAINER', { static: false })
  TABLE_CONTAINER!: ElementRef;


  localStorageData: any
  selected_quotation_id:any = ''
  purchased = false
  materialMasterlist: any = []
  vendorList: any = []
  quoteList: any = []
  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.expanceList()
    this.viewVendorList()
  }

  poByIDs(id:any) {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/create-through-quotation/' + id])
  }


  pogstByIDs(id:any) {
    this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/purchase-order/create-through-quotation/gst/' + id])
  }

  constructor(
    private procurtementApiService: PROCUREMENTAPIService,
    private activeroute: ActivatedRoute,
    private apiservice: APIService,
    private datasharedservice: DataSharedService,
    private router: Router,
    private commonService : CommonFunctionService
  ) { }


  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getVendorListNew(params).subscribe(data => {
      this.vendorList = data.results;
      this.getMaterialmasterList()
    })
  }

  getMaterialmasterList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getMaterialManagementList(params).subscribe(data => {
      this.materialMasterlist = data.results
      this.getProcurementQuotationDetails()
    })
  }


  quotationData : any = {}
  allExpances : any = []
  getProcurementQuotationDetails() {
    let IndentScope = this.activeroute.snapshot.paramMap.get('indentId') || ''
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    params.set('rfq_vendor', IndentScope);
    this.procurtementApiService.getProcurementQuotationDetails(params).subscribe(data => {
      this.quoteList = data.results
      for(let i=0;i<this.quoteList.length;i++) {
        for(let j=0;j<this.quoteList[i].quotation_expense.length;j++) {
          this.allExpances.push(this.quoteList[i].quotation_expense[j].expense_head) 
        }
        
      }
      this.quotationData = data.custom_data
      this.selected_quotation_id = this.quotationData?.rfq_vendor_details?.selected_quotation
      if( this.selected_quotation_id ) {
        this.purchased = true
      }
      
      this.syncMasterData()
      
    })
  }


  exapnceMaster : any = []
 

  getCharges(data:any) {
    let filter = data.quotation_tax.filter((item: { name: string; }) => item.name == 'If Any Other Add.')
    if(filter.length > 0) {
      return filter[0].total_tax_amount
    }
    return ''
  }


  expanceadded(expanceData:any) {    
    return this.allExpances.includes(expanceData.id)
  }


  expanceList() {
    let params = new URLSearchParams();
    params.set(
      'organization_id',
      this.localStorageData.organisation_details[0].id
    );
    params.set('all', 'true');

    this.apiservice.getExpenseMasterList(params).subscribe((data) => {
      this.exapnceMaster = data.results;
    });
  }

  


  getexpanceData(masterData:any,expanceScope:any,scope:any) {
    let masterList = this.exapnceMaster.filter((item: { name: any; }) => item.name == expanceScope)
    if(masterList.length > 0) {
      let filterData = masterData.quotation_expense.filter( (item: { expense_head: any; }) => item.expense_head == masterList[0].id)
      if(filterData.length > 0) {
        if(scope == 'amount') {
          return filterData[0].expense_amount
        }

        if(scope == 'parcent') {
          if(filterData[0].expense_percentage > 0) {
            return '@'+filterData[0].expense_percentage+'%'
          } else {
            return ''
          }
        }
      }
    }
    return ''
  }

  filteredData (requestedItem:any,QuoteData:any,scope:any) {
    let filter = QuoteData.quotation_items.filter((item: { requested_material: any; }) => item.requested_material == requestedItem.requested_material)

    if(filter.length == 0) {
      return '0'
    } else {
      if(scope == 'price') {
        return filter[0].item_amount
      }else if(scope == 'discount') {
        return filter[0].disc_amount
      }else if(scope == 'discountP') {
        return filter[0].disc_percentage
      }else if(scope == 'Final') {
        return filter[0].taxable_amount
      }else if(scope == 'amount') {
        return filter[0].taxable_amount
      }
    }
    return 0
  }

  generatPDF() {
    this.removeFromPrint = false   
    setTimeout(()=>{ 
      this.pdfExportButton.nativeElement.click();
    }, 100);
    setTimeout(()=>{ 
      this.removeFromPrint = true;
    }, 1000);
  }

  generateexcel(){
    // convert to excel**********
    var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

    tab_text = tab_text + '<x:Name>Test Sheet</x:Name>';

    tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

    tab_text = tab_text + "<table border='1px'>";
    tab_text = tab_text + Buffer.from(this.EXCELTABLE.nativeElement.innerHTML).toString();
    tab_text = tab_text + '</table></body></html>';

    var data_type = 'data:application/vnd.ms-excel';

   
    
    var downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = data_type + ', ' + encodeURIComponent(tab_text);
    downloadLink.download = 'quotation_compare.xls';
    downloadLink.click();
    // convert to excel**********
  }



  DownloadPDF() {
    let body = {
      content : Buffer.from(this.TABLE_CONTAINER.nativeElement.innerHTML).toString('base64'),
      size: "A3 landscape",
      margin: "1cm"
    }
    

    this.apiservice.getPDF(body).subscribe((dada) => {
      // this.doenloadPDF(atob(dada.results))
      this.downloadBase64File(dada,this.getCsNo()+this.getCSNoDate('date')+'.pdf')
    })
  }
  

  downloadBase64File(req:any,fileName:any) {
    var blob = new Blob([req], { type: "application/pdf" });
    //Check the Browser type and download the File.
    var url = window.URL || window.webkitURL;
    let link = url.createObjectURL(blob);
    var a = document.createElement("a");
    a.setAttribute("download", fileName);
    a.setAttribute("href", link);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  doenloadPDF(data:any) {
    // let filename = 'tags.pdf';
    // filename = decodeURI(filename);
    // const url = window.URL.createObjectURL(new Blob([data]));
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', filename);
    // document.body.appendChild(link);
    // link.click();
    // window.URL.revokeObjectURL(url);
    // link.remove();
  }
  


  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement
    );
    for (var i in ws) {
      if (typeof ws[i] != 'object') continue;
      let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
        // styling for all cells
        font: {
          name: 'arial',
        },
        alignment: {
          vertical: 'center',
          horizontal: 'left',
          wrapText: '1', // any truthy value here
        },
        border: {
          top: {
            style: 'thin',
            color: '000000',
          },
          left: {
            style: 'thin',
            color: '000000',
          },
          right: {
            style: 'thin',
            color: '000000',
          },
          bottom: {
            style: 'thin',
            color: '000000',
          },
        },
        
      };

      if (cell.c == 6) {
        // first column
        ws[i].s.numFmt = 'DD-MM-YYYY'; // for dates
        ws[i].z = 'DD-MM-YYYY';
      } else {
        ws[i].s.numFmt = '00'; // other numbers
      }

      

      if (cell.r % 2) {
        // every other row
        ws[i].s.fill = {
          // background color
          patternType: 'solid',
          fgColor: { rgb: 'ffffff' },
          bgColor: { rgb: 'ffffff' },
        };
      }
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'quotation_compare_Sheet.xlsx');
  }

  getCsNo() {
    let code = this.quotationData?.rfq_vendor_details.request_code.replace(/ENQUIRY/g, "CS");
    return code
  }
  getCSNoDate(scope:any) {
    
    let min = Math.min(...this.quoteList.map((item: { id: any; }) => item.id))
    let result = this.quoteList.filter((item: { id: number; }) => item.id === min)

    if(scope == 'date') {
      return result[0].created_at
    }

  }

  syncMasterData() {
    for (let i = 0; i < this.quoteList.length; i++) {
      // getVendorData
      for (let j = 0; j < this.vendorList.length; j++) {
        if (this.vendorList[j].id == this.quoteList[i].vendor) {
          this.quoteList[i]["VendorMasterData"] = this.vendorList[j]
          break;
        }
      }

      for (let k = 0; k < this.quoteList[i].quotation_items.length; k++) {

        for (let j = 0; j < this.materialMasterlist.length; j++) {
          if (this.materialMasterlist[j].id == this.quoteList[i].quotation_items[k].requested_material) {
            this.quoteList[i].quotation_items[k]["MaterialMasterData"] = this.materialMasterlist[j]
            break;
          }
        }

      }

    }
  }

  gotoViewQuotation(quotation_id: any) {
    this.commonService.navigateAndReload('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/quotation/view/'+ quotation_id)
    // this.router.navigate(['/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/quotation/view', quotation_id]);
  }

}

