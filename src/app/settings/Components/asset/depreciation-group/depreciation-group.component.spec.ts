import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationGroupComponent } from './depreciation-group.component';

describe('DepreciationGroupComponent', () => {
  let component: DepreciationGroupComponent;
  let fixture: ComponentFixture<DepreciationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepreciationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
