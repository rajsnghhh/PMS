import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-voucher-linking',
  templateUrl: './voucher-linking.component.html',
  styleUrls: ['./voucher-linking.component.scss']
})
export class VoucherLinkingComponent implements OnInit{

  constructor(private router: Router, private route: ActivatedRoute) { }

  moduleScope:any = ''

  ngOnInit(): void {
    this.moduleScope = this.route.snapshot.paramMap.get('procurementScope')
  }

  gotoProjectSite(firstSource:any,secondSource:any) {
    this.RouteToRoll('/pms/' + this.route.snapshot.paramMap.get('procurementScope') + '/procurement/voucher-linking/'+firstSource+'/'+secondSource)
  }

  RouteToRoll(route: any) {
    if (route != '') {
      this.router.navigate([route]).then(() => {
        window.location.reload();
      });
    }
  }
}
