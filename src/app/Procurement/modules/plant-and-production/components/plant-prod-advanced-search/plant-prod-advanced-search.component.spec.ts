import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantProdAdvancedSearchComponent } from './plant-prod-advanced-search.component';

describe('PlantProdAdvancedSearchComponent', () => {
  let component: PlantProdAdvancedSearchComponent;
  let fixture: ComponentFixture<PlantProdAdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantProdAdvancedSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantProdAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
