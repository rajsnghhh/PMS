import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionRackSettingComponent } from './section-rack-setting.component';

describe('SectionRackSettingComponent', () => {
  let component: SectionRackSettingComponent;
  let fixture: ComponentFixture<SectionRackSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionRackSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionRackSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
