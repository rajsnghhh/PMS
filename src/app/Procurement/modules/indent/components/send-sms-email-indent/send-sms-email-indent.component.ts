import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PROCUREMENTAPIService } from 'src/app/Procurement/shared/PROCUREMENT-Services/procurementApi.service';
import { Success_Messages } from 'src/app/Shared/Config/config.const';
import { APIService } from 'src/app/Shared/Services/api.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
  selector: 'app-send-sms-email-indent',
  templateUrl: './send-sms-email-indent.component.html',
  styleUrls: ['./send-sms-email-indent.component.scss']
})
export class SendSmsEmailIndentComponent {
  localStorageData: any;
  vendorList: Array<any> = [];
  vendorRfqIds: number[] = [];
  @Input() prefieldData: any;
  alreadyRfqVendor: any;

  constructor(
    private apiservice: APIService,
    private procurementApiService: PROCUREMENTAPIService,
    private datasharedservice: DataSharedService,
    public router: Router,
    private toastrService: ToastrService,
    private activeroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.localStorageData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
    this.viewVendorList()
    this.getVendorRfq()
  }


  viewVendorList() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('all', 'true');
    this.apiservice.getVendorList(params).subscribe(data => {
      this.vendorList = data.results;
    })
  }

  getVendorRfq() {
    let params = new URLSearchParams();
    params.set('organization_id', this.localStorageData.organisation_details[0].id);
    params.set('indent_id', this.prefieldData.id);
    this.procurementApiService.getRfqVendors(params).subscribe(data => {
      this.alreadyRfqVendor = data.results[0]?.vendor_ids
    });
  }


  onVendorRfq(event: any, itemId: number) {
    if (event.target.checked) {
      this.vendorRfqIds.push(itemId);
    } else {
      const index = this.vendorRfqIds.indexOf(itemId);
      if (index !== -1) {
        this.vendorRfqIds.splice(index, 1);
      }
    }

  }


  notifyVendor() {

    let rfqRequest = {
      "organization": this.localStorageData.organisation_details[0].id,
      "indent": this.prefieldData.id,
      "vendor_ids": this.vendorRfqIds.join(','),
      "material_request": this.prefieldData.material_request
    }
    this.procurementApiService.notifyVendors(rfqRequest).subscribe(data => {
      this.toastrService.success(Success_Messages.SuccessUpdate, '', {
        timeOut: 2000,
      });
      this.backtolistIndent()
    });

  }

  backtolistIndent() {
    this.RouteToRoll('/pms/'+this.activeroute.snapshot.paramMap.get('procurementScope')+'/procurement/indent')
  }


  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }

}
