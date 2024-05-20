import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialCostHeadsComponent } from './add-material-cost-heads.component';

describe('AddMaterialCostHeadsComponent', () => {
  let component: AddMaterialCostHeadsComponent;
  let fixture: ComponentFixture<AddMaterialCostHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaterialCostHeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMaterialCostHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
