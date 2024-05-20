import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.scss',
]
})
export class ProjectMasterComponent {
  projectId: any;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
    });
  }

  gotoProjectSite() {
    this.router.navigate(['/pms/project/master/site' + '/' + this.projectId])
  }

  gotoProjectStore() {
    this.router.navigate(['/pms/project/master/store' + '/' + this.projectId])
  }

  gotoUserManagement() {
    this.router.navigate(['/pms/project/master/users' + '/' + this.projectId])
  }
}
