import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWorkingComponent } from './company-working.component';

describe('CompanyWorkingComponent', () => {
  let component: CompanyWorkingComponent;
  let fixture: ComponentFixture<CompanyWorkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyWorkingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyWorkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
