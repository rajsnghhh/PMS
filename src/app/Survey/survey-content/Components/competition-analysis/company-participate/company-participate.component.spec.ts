import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyParticipateComponent } from './company-participate.component';

describe('CompanyParticipateComponent', () => {
  let component: CompanyParticipateComponent;
  let fixture: ComponentFixture<CompanyParticipateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyParticipateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
