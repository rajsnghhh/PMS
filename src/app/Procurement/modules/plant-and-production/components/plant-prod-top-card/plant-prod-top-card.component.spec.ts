import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantProdTopCardComponent } from './plant-prod-top-card.component';

describe('PlantProdTopCardComponent', () => {
  let component: PlantProdTopCardComponent;
  let fixture: ComponentFixture<PlantProdTopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantProdTopCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantProdTopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
