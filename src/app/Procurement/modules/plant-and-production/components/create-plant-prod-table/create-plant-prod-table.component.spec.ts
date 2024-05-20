import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlantProdTableComponent } from './create-plant-prod-table.component';

describe('CreatePlantProdTableComponent', () => {
  let component: CreatePlantProdTableComponent;
  let fixture: ComponentFixture<CreatePlantProdTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlantProdTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlantProdTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
