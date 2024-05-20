import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderExicutiveCommtteeComponent } from './tender-exicutive-commttee.component';

describe('TenderExicutiveCommtteeComponent', () => {
  let component: TenderExicutiveCommtteeComponent;
  let fixture: ComponentFixture<TenderExicutiveCommtteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderExicutiveCommtteeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderExicutiveCommtteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
