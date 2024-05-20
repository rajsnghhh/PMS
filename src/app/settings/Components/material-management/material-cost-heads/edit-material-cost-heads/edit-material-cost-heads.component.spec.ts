import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialCostHeadsComponent } from './edit-material-cost-heads.component';

describe('EditMaterialCostHeadsComponent', () => {
  let component: EditMaterialCostHeadsComponent;
  let fixture: ComponentFixture<EditMaterialCostHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMaterialCostHeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMaterialCostHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
