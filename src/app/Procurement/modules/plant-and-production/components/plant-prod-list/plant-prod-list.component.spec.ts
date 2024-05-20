import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantProdListComponent } from './plant-prod-list.component';

describe('PlantProdListComponent', () => {
  let component: PlantProdListComponent;
  let fixture: ComponentFixture<PlantProdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantProdListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantProdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
