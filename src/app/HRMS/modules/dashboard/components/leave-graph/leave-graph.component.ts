import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'
import { HRMSAPIService } from 'src/app/HRMS/shared/HRMS-Services/hrmsApi.service';
import { DataSharedService } from 'src/app/Shared/Services/data-shared.service';

@Component({
    selector: 'app-leave-graph',
    templateUrl: './leave-graph.component.html',
    styleUrls: ['./leave-graph.component.scss']
})
export class LeaveGraphComponent implements OnInit {

    activeSession: any;
    userData: any;
    leaveData: any;

    constructor(
        private apiservice: HRMSAPIService,
        private datasharedservice: DataSharedService,
    ) { }

    ngOnInit() {
        this.activeSession = JSON.parse(this.datasharedservice.getLocalData('activeSession'));
        this.userData = JSON.parse(this.datasharedservice.getLocalData('userDATA'));
        this.getEmployeeLeaveList()

    }

    getEmployeeLeaveList() {

        let params = new URLSearchParams();
        params.set('organization_id', this.userData.organisation_details[0].id);
        params.set('year', this.activeSession.SprintYear);
        this.apiservice.getEmployeeLeaveList(params).subscribe(data => {
            this.leaveData = data.result;
            let monthList = []
            let LeaveList = []
            for (let i = 0; i < this.leaveData.length; i++) {
                monthList.push(this.leaveData[i].month)
                LeaveList.push(this.leaveData[i].sum)
            }

            const options: any = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: monthList,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} Days</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: '',
                    data: LeaveList

                }]
            };
            Highcharts.chart('chartcontent', options);
        })
    }
}
